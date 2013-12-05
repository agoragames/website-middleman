---
title: Of Penguins, Rabbits and Buses
author: Aaron Westendorf
---
Here at Agora we make use of dedicated hardware and virtual machines running on our providers' respective clouds. In recent months, we've moved our RabbitMQ hosts onto hardware because we found that we could far exceed the CPU capacity of our virtual machines and it was far cheaper to run a small cluster of hardware hosts than a giant cluster of VMs. We used an existing, underutilized host for our primary traffic while awaiting delivery and installation of a new pair servers. Expecting a simple plug-and-play swap, I set out to test the new hardware before we made the transition. What follows is a harrowing tale into the deepest depths of modern hardware architecture.



 Our current primary RabbitMQ host, leviathan, is a 24 core Intel Xeon X5650 running at 2.67GHz and fitted with 132GB of RAM. The machine hosts all our in-memory databases, such as Redis and Memcached, and is vastly underutilized at this time. RabbitMQ is run in a cluster with other nodes hosted on VMs to give us failover capacity.

 To replace its role as RabbitMQ host, we purchased artemis and hermes, two 24 core AMD Opteron 6172s running at 2.1GHz and fitted with 8GB of RAM each. Recent versions of RabbitMQ page queue backlogs to disk, and our traffic pattern and infrastructure validations are such that this amount or RAM is sufficient.

 At first, one might assume that the differences in processors would result in near-equal [performance](http://www.bit-tech.net/hardware/cpus/2010/03/31/amd-opteron-6174-vs-intel-xeon-x5650-review/1) for RabbitMQ. The Intel CPUs have faster clock cycles, but they rely on Hyper-Threading to present 24 logical cores to the operating system. The AMD CPUs are slower, but they present 24 hardware cores to the kernel. [Linux](http://www.centos.org/docs/5/html/5.2/Deployment_Guide/s2-proc-cpuinfo.html) reports 5333 bogomips for the Xeons, 4200 for the Opterons.

 Using [haigha](https://github.com/agoragames/haigha)'s load testing [script](https://github.com/agoragames/haigha/blob/master/scripts/stress_test), we were astonished to discover that our brand-new hardware was almost 50% slower than our until-recently-brand-new Intel hardware! What could possibly have gone wrong?

 The test that we ran consisted of 3 VM clients, each with 4 cores, each running 3 instances of the standard configuration of the `stress_test` script of 500 channels looping messages over 500 queues. That is, 4500 channels and queues, each channel publishing a message as soon as it receives its previously published message. The test would run for a fixed period of time, usually a minute.

 Our investigation started simple enough. Using top and our new favorite, htop, we observed that the kernel was using a substantial portion of each cores capacity. We also observed that cores were underutilized, as htop clearly showed a visible gap on the right-hand side the CPU graphs. Though not scientific, it appeared to be a 10-30% loss. A bit of [research](http://www.theregister.co.uk/2010/04/20/ubuntu_server_10_04/) implied that the Ubuntu 10.04.2 kernel, 2.6.32, was perhaps released around the same time as our AMD chips, and may not fully support them. We tested the latest patches to that release, 2.6.32-32, but did not observe any improvement.

 Venturing into unknown territory, we installed the latest kernel backported from maverick, 2.6.35-25. We immediately observed an improvement in CPU usage, such that all cores were near 100% utilization. Sadly though, our message throughput remained nearly the same, as user space consumed only 40% of each core. Yet when comparing a single instance of `stress_test` , leviathan and artemis performed nearly equal. In no case were we able to induce any IO wait, which was to be expected since we weren't hitting disk. Why would 24 cores of AMD be so dramatically different than 24 cores of Intel?

 With the obvious problems ruled out and the latest kernel installed, I started to dig deeper into the architectural differences between the two companies' designs. Using [lscpu](http://manpages.ubuntu.com/manpages/natty/man1/lscpu.1.html), we can see two very different CPU designs.

 ```
 leviathan:~$ lscpu
 Architecture: x86_64
 CPU op-mode(s): 32-bit, 64-bit
 CPU(s): 24
 Thread(s) per core: 2
 Core(s) per socket: 6
 CPU socket(s): 2
 NUMA node(s): 2
 Vendor ID: GenuineIntel
 CPU family: 6
 Model: 44
 Stepping: 2
 CPU MHz: 2666.806
 Virtualization: VT-x
 L1d cache: 32K
 L1i cache: 32K
 L2 cache: 256K
 L3 cache: 12288K

 artemis:~$ lscpu
 Architecture: x86_64
 CPU op-mode(s): 64-bit
 CPU(s): 24
 Thread(s) per core: 1
 Core(s) per socket: 12
 CPU socket(s): 2
 NUMA node(s): 4
 Vendor ID: AuthenticAMD
 CPU family: 16
 Model: 9
 Stepping: 1
 CPU MHz: 2100.172
 Virtualization: AMD-V
 L1d cache: 64K
 L1i cache: 64K
 L2 cache: 512K
 L3 cache: 5118K
```

 The AMD CPUs have nearly double the amount of dedicated cache per core, but a much smaller (shared) L3 cache. Though this was clearly a fundamental difference, it did not seem adequate in explaining the vast amount of time that the kernel was consuming on each CPU. Yet the only reason why the kernel would be consuming so much time, without any IO wait, would be if it was waiting for something. What would Linux be waiting for that Intel was readily delivering?

 As I noted, our test was running 4500 unique channels and queues. In a [reply](http://lists.rabbitmq.com/pipermail/rabbitmq-discuss/2011-May/012991.html) to a recent inquiry on the RabbitMQ mailing list, I learned that both channels and queues are allocated an Erlang process. A bit of searching and I found a useful [paper](http://www.erlang.org/euc/08/euc_smp.pdf)[PDF] on the early SMP support in Erlang R12B, circa 2008. The diagrams show a single run queue from which all schedulers pull the next process to run.

 By R13B, each scheduler had a [dedicated](http://www.erlang.org/documentation/doc-5.7/doc/highlights.html) run queue, vastly decreasing lock contention. Additionally, scheduling algorithms, and [configuration thereof](http://www.erlang.org/doc/man/erlang.html#system_flag-2), were designed specifically to take advantage of the variety of SMP architectures. RabbitMQ is running on R14B01, and so it should have the latest in SMP optimizations, particularly with respect to [NUMA](http://en.wikipedia.org/wiki/Non-Uniform_Memory_Access), which is how both Intel and AMD implement their SMP architectures.

 Linux is also NUMA-aware, and contains scheduling algorithms that try to pair the core that a process or thread will use with the NUMA node where its memory is allocated. Likewise, it tries to allocate memory on the same NUMA node as the process or thread that is requesting it. This was a topic area we were already familiar with, but in terms of [database applications](http://jcole.us/blog/archives/2010/09/28/mysql-swap-insanity-and-the-numa-architecture/) that consume most of system RAM. That clearly was not the case here, as RabbitMQ barely consumed 500MB under the stress test, and the memory is allocated on demand, and so was spread evenly across all NUMA nodes.

 So with hardware that benchmarked well, using recent releases of the Linux kernel and Erlang VM, and an application that used a small fraction of available RAM, RabbitMQ performed abysmally slow. What could possibly cause such behavior?

 The final piece of the puzzle lay in the nature of RabbitMQ itself. Though Erlang may try to pair a process with a node-bound scheduler, and Linux allocate memory on the same node as that scheduler, that's of little use in practice. When a message is read from a connection (itself a process) on a channel (also a process), the route of that message must be looked up in an mnesia-backed global table to determine which queue(s) the message should be copied to. Bits are allocated and written to for that queue (yet another process), and then any consumer of that queue - a channel - must read the bits before sending them out. In short, there is a near-0 chance that the bits necessary to fulfill a single publish-route-consume will be processed by the same scheduler, and a just-slightly-greater-than-0 chance that it will be processed by a scheduler on the same NUMA node. Even if the code is optimized to only copy messages as references, numerous reads and writes must acquire an exclusive lock on a NUMA nodes memory bus.

 So what's the difference between Intel and AMD NUMA implementations?

 ```
 leviathan:~$ numactl -H
 available: 2 nodes (0-1)
 node 0 cpus: 0 2 4 6 8 10 12 14 16 18 20 22
 node 0 size: 65525 MB
 node 0 free: 59013 MB
 node 1 cpus: 1 3 5 7 9 11 13 15 17 19 21 23
 node 1 size: 65535 MB
 node 1 free: 59787 MB
 node distances:
 node 0 1
 0: 10 20
 1: 20 10

 artemis:~$ numactl -H
 available: 4 nodes (0-3)
 node 0 cpus: 0 2 4 6 8 10
 node 0 size: 2047 MB
 node 0 free: 1621 MB
 node 1 cpus: 12 14 16 18 20 22
 node 1 size: 2044 MB
 node 1 free: 1758 MB
 node 2 cpus: 13 15 17 19 21 23
 node 2 size: 2048 MB
 node 2 free: 1806 MB
 node 3 cpus: 1 3 5 7 9 11
 node 3 size: 2047 MB
 node 3 free: 1874 MB
 node distances:
 node 0 1 2 3
 0: 10 20 20 20
 1: 20 10 20 20
 2: 20 20 10 20
 3: 20 20 20 10
```

 The AMD cores are split across four nodes, whereas the Intel cores only use two. In the case where a process uses all cores equally, there is a 50% probability of a memory operation being local on a Xeon processor, but only a 25% probability on an Opteron!

 Starting RabbitMQ on just 2 nodes, I instantly gained nearly 30% improvement, using half the available processing power, and kernel time dropped to a far more normal 20-30% per core. I experimented with this for a few hours, and found that 3 nodes, with memory interleave across all 4 nodes, was the optimal configuration. But what of the Erlang scheduler?

 ```
 artemis:~$ erl
 Erlang R14B01 (erts-5.8.2) [source] [64-bit] [smp:24:24] [rq:24] [async-threads:0] [hipe] [kernel-poll:false]

 Eshell V5.8.2 (abort with ^G)
 1> erlang:system_info(scheduler_bind_type).
 thread_no_node_processor_spread
```

 Erlang is smart enough to recognize that this is a NUMA system, but the scant documentation implies that the default scheduler type is best suited to to Hyper-Threading architectures. As it turns out though, all of the scheduler types that are documented as designed for NUMA were slower than the simple `processor_spread` scheduler, which out-performed the NUMA schedulers by almost 30%. And what of the number of schedulers and [request queues](http://stackoverflow.com/questions/1182025/what-do-the-erlang-emulator-info-statements-mean)? Though they're configured for 24 cores, experiments show that the default number of 24 is best, even given only 18 cores of execution. I can't speak to why exactly either of these two settings are best, but I can entertain any number of educated guesses.

 The last question that remained was, if we're to run with 3 out of 4 NUMA nodes, which ones do we choose? It seemed logical to pick the ones that weren't connected directly to the network card, the only other bit of hardware which we were trying to push as many bits through as possible.

 ```
 artemis:~$ lspci -tv
 -[0000:00]-+-00.0 ATI Technologies Inc RD890 Northbridge only dual slot (2x16) PCI-e GFX Hydra part
 +-04.0-[0000:04]--+-00.0 Broadcom Corporation NetXtreme II BCM5709 Gigabit Ethernet
 | \-00.1 Broadcom Corporation NetXtreme II BCM5709 Gigabit Ethernet
 +-06.0-[0000:05]--+-00.0 Broadcom Corporation NetXtreme II BCM5709 Gigabit Ethernet
 | \-00.1 Broadcom Corporation NetXtreme II BCM5709 Gigabit Ethernet
 ......................

 artemis:~$ ifconfig
 eth1 Link encap:Ethernet HWaddr aa:aa:aa:aa:aa:aa
 inet addr:111.111.111.111 Bcast:111.111.111.111 Mask:255.255.255.255
 inet6 addr: ffff::ffff:ffff:ffff:ffff/64 Scope:Link
 UP BROADCAST RUNNING MULTICAST MTU:1500 Metric:1
 RX packets:71583284 errors:0 dropped:0 overruns:0 frame:0
 TX packets:134508244 errors:0 dropped:0 overruns:0 carrier:0
 collisions:0 txqueuelen:1000
 RX bytes:13852822249 (13.8 GB) TX bytes:23156900853 (23.1 GB)
 Interrupt:45 Memory:f4000000-f4012800

 artemis:~$ cat /sys/bus/pci/devices/0000\:04\:00.1/irq
 45

 artemis:~$ cat /sys/bus/pci/devices/0000\:04\:00.1/numa_node
 0
```

 It's unclear how much of a difference that makes, but when RabbitMQ is under full load, a few of the cores on node 0 show 5-30% kernel usage, a mixture of network card and memory traffic.

 Our final configuration looks something like this. Your installation will have these stanzas in various places depending on the distribution and how your administrator configured the runtime scripts. Note that we turned off [async threads](http://www.erlang-solutions.com/thesis/tcp_optimisation/tcp_optimisation.html). We didn't observe any benefit of enabling them, and it was unclear if they degraded performance.

```
 SERVER_ERL_ARGS="+K true +sbtps +P 10485760"
 exec setuidgid rabbitmq numactl --cpunodebind=!0 /usr/local/sbin/rabbitmq-server
```

 The final result? Using only 18 AMD cores of execution, artemis achieved 93% of the performance of leviathans 24 Intel cores. Given that Linux calculated a 22% performance difference, we'll call that a win. Who can complain about two hosts capable of 40,000 messages each vs. a single host capable of 43,000?

 What can we learn from this? Firstly, know the hardware you're buying. No matter how this played out, the Intel chips benchmarked faster, and we should have stuck with those when purchasing our RabbitMQ hosts. Second, the physical layout of the data path and the nature of your application together determine the bounds of your capacity. _Any_ multithreaded application configured to use all of your cores, where the memory access pattern is not localized to a single thread, will exhibit _non-linear_ performance inversely proportional to the number of NUMA nodes those threads run on.
