---
title: Introducing Haigha
author: Aaron Westendorf
---
We're pleased to announce the official release of haigha, our Python AMQP client library.



 Haigha is the culmination of over 2 years of development. We've used RabbitMQ since we launched our [game services platform](http://blog.agoragames.com/blog/2010/06/28/lifting-the-tail-inside-agora-skunk-works/) and immediately fell in love with it and the power that AMQP afforded us. At the time that we began development, py-amqplib was the dominant client library. It fully-supported the 0.8.1 protocol features we made use of, but because it was blocking, fell short of our desire for an asynchronous, highly-scalable messaging layer on which to build our services. At the time, only [txAMQP](https://launchpad.net/txamqp) supported asynchronous IO and we had ruled out Twisted for a variety of reasons. Pika, the official Python client maintained by RabbitMQ, had yet to be [born](https://github.com/pika/pika/commit/d514dce7daf10cfc727cca9095ef0d114f9e4592).

 With the py-amqplib source in hand, we deployed it directly into our stack and started heavily modifying it to integrate [pyevent](http://code.google.com/p/pyevent/). By mid-2009 we had a stable and fast fork of py-amqplib and were able to scale our HTTP<>AMQP bridge to tens of thousands of concurrent connections. As these things are wont to go, once we had met our needs, and our schedules demanded focus on client deliverables, our fork languished, unknown to the world and quietly shuffling gigabytes of data across our network.

 Throughout 2010 we continually expressed a desire to release what we had done to the community at large, feeling that others could also benefit from a fast asynchronous AMQP client for their Python applications. Pika was maturing rapidly and interest was clearly growing for building the kind of applications that AMQP can support. We held out releasing anything, as the changes we had made to support event-driven IO had brought to light many problems in the layout of py-amqlib, and our fork was based on an older version of the code, before a major refactor. We felt that a ground-up re-write, with a clean and efficient architecture, was the right way to contribute back to the community and improve our own code base.

 In the dark pre-dawn hours of Friday 24 September 2010, haigha was [born](https://github.com/agoragames/haigha/commit/2a4f63ddc08140f4078c396d32021256ad55762d) during the 2nd Agora Games hack-a-thon. By the [end](https://github.com/agoragames/haigha/commit/36aad0cca6686d871fe0c8923eb460de743b2504) of the day we had a working demo with architectural details in place, and continued to develop features for the next few weeks before once again putting it on hold in favor of money-making enterprises.

 After a restful New Year vacation, we spent several weeks completing haigha, profiling and optimizing it, and integrating it into our game services stack. The transition was seamless, about the best anyone could ask given that a major component we rely upon was completely re-written and deployed against a major upgrade to RabbitMQ, as we transitioned from the 1.7 series to the 2.2 series and the 0.9.1 protocol.

 We still felt it poor form to release without comprehensive unit tests, and momentum was building to throw away [pymox](http://code.google.com/p/pymox/) in favor of a new [Mocha](http://mocha.rubyforge.org/)-inspired mocking library. In another pre-dawn fit of hack-a-thon inspiration, we launched [Chai](https://github.com/agoragames/chai). With the right tool for the job in hand, we set about completing our unit test suite.

 Once again, [client deliverables](http://www.themortalkombat.com/) conspired to keep our code from finally seeing the light of day, but after the big crunch, we punched through a [quietly-publicized](http://blog.agoragames.com/blog/2011/05/19/the-haigha-preview/) [preview release](http://lists.rabbitmq.com/pipermail/rabbitmq-discuss/2011-May/012861.html).

 After a few more weeks baking in the oven, we've nearly completed code coverage, fixed many bugs, and generally cleaned house. We feel that haigha is now ready for the masses, and we're proud to put it out there for the rest of the community to use. We look forward to your [feedback](https://github.com/agoragames/haigha/issues). You can find the source on [github](https://github.com/agoragames/haigha) and packages on [pypi](http://pypi.python.org/pypi/haigha).
