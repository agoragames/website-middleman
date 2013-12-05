---
title: Grabbing the Rabbit by the Horns
author: Aaron Westendorf
---
RabbitMQ is a very powerful tool, especially when deployed in a cluster. Among RabbitMQ's more useful features is rabbitmqctl, the command line tool which can be used to query a node and list its exchanges, queues, connections, number of consumers, memory usage and more.



The application, and cluster deployment in general, is hamstrung by Erlang's standard approach to cookies. The cookie, typically .erlang.cookie in the HOME directory of an application, must have only user read permissions. For a Linux RabbitMQ install, that would look like this:

```
bofh@rabbit_host1:~$ ls -al /var/lib/rabbitmq/
total 333
drwxr-xr-x 3 rabbitmq rabbitmq 160 2010-07-12 17:49 .
drwxr-xr-x 37 root root 1008 2010-07-02 14:29 ..
-r-------- 1 rabbitmq rabbitmq 20 2010-05-04 20:44 .erlang.cookie
drwxr-xr-x 3 rabbitmq rabbitmq 72 2010-05-04 20:49 mnesia
-rw-r--r-- 1 rabbitmq rabbitmq 27 2010-07-12 17:49 pids
```

Any variation on these permissions and Erlang will refuse to start. The permissions requirement is embedded into Erlang itself, making it more or less impossible to work around. This creates the following problems:

- You must copy this file (or its contents) to all hosts in the cluster
- All users of rabbitmqctl must run it as sudo
- All monitoring tools must also run as root or have sudo capability
- You must have the cookie file present on the host running rabbitmqctl

Given how powerful rabbitmqctl is, you will likely still want to limit access to it, but this can be readily accomplished with standard Unix permissions. By expanding who can use it and where, your system administrator will be thrilled to reduce need for sudo access and your customers will be happy with the additional tools you can deploy to monitor your cluster and its clients to ensure that all is well, 24/7.

Thankfully, RabbitMQ's scripts accept a lot of environment variables which can be passed into the Erlang runtime, and Erlang kindly provides a way to bypass the cookie file through a command line literal. The scripts are all located in the scripts directory inside your RabbitMQ installation.

```
bofh@rabbit_host:~$ ls -ald `erl -eval 'io:format("~s~n", [code:lib_dir()])' -s init stop -noshell`/rabbitmq-server\*/scripts
drwxr-xr-x 2 root root 520 2010-07-21 14:47 /usr/local/lib/erlang/lib/rabbitmq-server-1.7.0/scripts
drwxr-xr-x 2 root root 520 2010-07-21 16:15 /usr/local/lib/erlang/lib/rabbitmq-server-1.7.2/scripts
```

The three standard scripts, rabbitmq-server, rabbitmq-multi and rabbitmqctl all source an environment script, rabbitmq-env, which in turn will source the file /etc/rabbitmq/rabbitmq.conf if it exists. This is the file that you can edit to take control of your RabbitMQ cluster.

```
SERVER_START_ARGS="+K true +A300 +P512000 -setcookie NOMNOMNOMYUMYUM -kernel inet_default_listen_options [{nodelay,true},{sndbuf,32768},{recbuf,32768}]"
MULTI_START_ARGS="-setcookie NOMNOMNOMYUMYUM"
CTL_ERL_ARGS="-setcookie NOMNOMNOMYUMYUM"
```

The value of each environment variable will be passed verbatim to the Erlang runtime. The `SERVER_START_ARGS` are passed to each node started by rabbitmq-multi, and directly affect the performance of a RabbitMQ instance. In this example, we have increased the number of native threads available to Erlang and allowed it to spin up numerous (Erlang) processes. We have also instructed the kernel to increase its TCP buffer sizes and disable Nagle's algorithm.

You can now run rabbitmqctl without sudo on any host which has this same configuration deployed. This solution still requires that you synchronize /etc/rabbitmq across your cluster, though there are many ways of solving that problem.

We have taken this a step further and enabled rabbitmqctl on any host in our network. All of our core software is deployed from source to /usr/local over NFS. We have deployed the rabbitmq.conf file there too, and have a small shell script wrapping rabbitmqctl.

```
#!/bin/bash
ERL_PATH=`erl -eval 'io:format("~s~n", [code:lib_dir()])' -s init stop -noshell`
LATEST_VERSION=`ls $ERL_PATH | grep rabbitmq | sort | tail -1`
RABBIT_PATH="$ERL_PATH/$LATEST_VERSION"

set -f
[ -f /usr/local/etc/rabbitmq/rabbitmq.conf ] && . /usr/local/etc/rabbitmq/rabbitmq.conf
export CTL_ERL_ARGS
HOME=/var/lib/rabbitmq $RABBIT_PATH/scripts/rabbitmqctl $@
```

We can now connect to and monitor any RabbitMQ node from any host on our network

```
bofh@gateway:~$ rabbitmqctl -n rabbit@rabbit_host1 status
Status of node rabbit@rabbit_host1 ...
[{running_applications,[{rabbit,"RabbitMQ","1.7.2"},
{mnesia,"MNESIA CXC 138 12","4.4.10"},
{os_mon,"CPO CXC 138 46","2.2.2"},
{sasl,"SASL CXC 138 11","2.1.6"},
{stdlib,"ERTS CXC 138 10","1.16.2"},
{kernel,"ERTS CXC 138 10","2.13.2"}]},
{nodes,[rabbit@rabbit_host1,rabbit@rabbit_host2]},
{running_nodes,[rabbit@rabbit_host1,rabbit@rabbit_host2]}]
...done.
```
