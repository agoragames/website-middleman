---
title: 'Lifting the Tail: Inside Agora Skunk Works'
author: Aaron Westendorf
---

We've been hard at work for over a year developing the next generation of game integration technology here at Agora, and over the next few months we'll be releasing some of the code that we've developed, discussing some of the challenges we face and how we're using all the new technology to build the best gaming experience around.


To start, a brief explanation of the challenges we face.  As you might imagine, we deal with a lot of data.  The volume is only increasing, and with our friends at MLG, we expect significantly more of it.  Along with the volume of data, it also comes to us in many different forms and protocols; sometimes it's pushed to us, and sometimes we have to go fetch it.  We have to respond to any number of business decisions made by developers and publishers, adapt to developers' needs in a manner which does not negatively impact their schedule, and be a consistent and reliable partner to all our clients.  We have to deliver comprehensive documentation to both game and website developers, and our business relationships are aided by a consistent offering.
 

In the past, each game's services would be its own Rails application.  We built a suite of re-usable components, but for each title we would have to re-write a lot of boiler-plate code and set up an entirely new suite of servers, complete with application hosts, web and caching proxies, databases and so on.  As our data throughput grew, we found that we needed to add additional components to our stack, such as Sparrow, to turn synchronous workloads into asynchronous ones.  Each project required extensive monitoring and reporting, an interactive console for viewing production data and testing staging code.
 

We were very successful, but found the business costs too high and that we were missing several features that were important to our long term strategy of being the best in the industry at game integration.  Our experience with a virtualized hosting environment opened our eyes to the possibilities of turning our data processing and web services loose on a commoditized, shared platform.
 

With a general set of requirements in hand, we set forth, and what we came away with has been incubating, gestating and flowering into a powerful toolset that has met all our expectations, and then some.
 

Our first task was to choose the core set of technologies and the basic processing scheme that we would be using.  After an exhaustive search, lots of hacking and whiteboard scribblings, we settled on the following key features:
 
- Python for all application code
- [AMQP](http://www.amqp.org), via [RabbitMQ](http://www.rabbitmq.com), for all inter-process communication
- MySQL, Tokyo Tyrant and memcache for data storage services
- Protocol translators to bridge external traffic to AMQP via a simple binary protocol
- libevent for as many as IO operation as possible

![](uploads/2010/06/lifting_the_tail.png "lifting the tail")
 

We chose Python from the suitable dyanmic languages primarily for its memory management and speed.  We were shifting to a single-threaded multi-process environment where memory costs are high and performance paramount, and Python has an extensive pedigree in this area.  We did choose to sacrifice some memory by adhering to a single-threaded model in order to keep the application stack simple and use the kernel for all context switching.
 

AMQP's routing scheme gives us powerful tools to shard and aggregate traffic across our cluster.  We chose RabbitMQ because of its Erlang heritage, its performance, reliability, clustering capabilities and commercial support.  By splitting up each game's services into discrete packages which can each run numerous instances, we can readily divide traffic across a cluster of RabbitMQ hosts and attach listeners for monitoring, diagnostics and metrics.  The dotted-notation of AMQP's topic exchanges allow for routing traffic between titles, environments, services and even specific commands.
 

To get the most out of the kernel and reduce latency, we use [libevent](http://monkey.org/~provos/libevent/) for all of our AMQP traffic and in our protocol translators.  We extensively patched the [py-amqplib](http://barryp.org/software/py-amqplib/) to work within this asynchronous environment.  This fork has been in production use for some time now but is slated for a ground-up re-write and release into the wild.
 

We considered many other database solutions, but at the time that we had to make our decision, felt that Tokyo Tyrant was the best NoSQL database to introduce into our stack because of its sparse table capabilities, high performance, low resource usage and simple setup.  We're very excited with all the new development that is taking place in this field, and will be writing more about our experience with these tools over the coming years.
 

What we ended up with has met all of the goals that we set out to achieve.  We have successfully abstracted scaling, monitoring, protocol presentation and metric aggregation, allowing us to focus entirely on delivering functionality to our customers.  Now that our customers include MLG, this means that we'll be rolling out some of the biggest and baddest applications in the gaming community, with confidence and reliability.
