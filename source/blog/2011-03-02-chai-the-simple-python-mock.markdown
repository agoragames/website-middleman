---
title: Chai, the simple Python mock
author: David Czarnecki
---
Here at Agora we take testing seriously, insisting that full test coverage always be part of a deliverable and adjusting our schedules accordingly. We are historically a [Rails](http://blog.agoragames.com/category/engineering/ruby-engineering/) shop, but for a few years we have been developing an [extensive](http://blog.agoragames.com/2010/06/28/lifting-the-tail-inside-agora-skunk-works/) Python code base and infrastructure to power our in-game offerings.

 We've been using [Mox](http://code.google.com/p/pymox/) as our mock testing solution since 2009, and though it has met all of our functional requirements, we've longed for the simplicity and power of Ruby's [Mocha](http://mocha.rubyforge.org/) framework. This past Friday we held our 3rd Hack-A-Thon, and [Vitaly Babiy](https://github.com/vbabiy) and [I](https://github.com/awestendorf) developed [Chai](https://github.com/agoragames/chai/), a mocking framework patterned after Mocha.

 {% gist 848107 %}

 You can find the latest source and documentation at [GitHub](https://github.com/agoragames/chai/), or install from [pypi](http://pypi.python.org/pypi/chai). The current release is 0.1.0 and we're looking for [feedback](https://github.com/agoragames/chai/issues). We're adding lots of features and improving the API, so [check back](https://github.com/agoragames/chai/) frequently.
