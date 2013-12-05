---
title: Cucumber and Behavior Driven Infrastructure Validation
author: David Czarnecki
---
Did you ever think to use Cucumber to write scenarios to validate your infrastructure? Here's a short guide to help you get started.

 I'm going to keep this intentionally short because I don't want to steal the thunder away from our systems team, but I did get a fair number of pings inquiring about this after tweeting about it, so it's worth getting the word out.

 **Start a new infrastructure validation project**

 Your Gemfile should reference the gems for rake and cucumber at a minimum. The Rakefile can be the minimal Cucumber-ified to get started.

 {% gist 1011361 %}

 **Write your Cucumber features and scenarios for the parts of the infrastructure you want to validate**

 Examples of this may be "aliveness" of servers by pinging them or making sure processes are running. For example, with MySQL:

 {% gist 1011369 %}

 You'll need to back those scenario step definitions up with the appropriate code. I'm going to leave that out of this post for now.

 **Tag your scenarios appropriately**

 You should tag your scenarios in the manner that makes sense for your organization and in the way that you'll be running them and responding to them. For example, you may want to run @critical scenarios from cron every 5 minutes (or some appropriate interval) and make sure that if these fail, someone gets more than an e-mail. You may want to run @rise_and_shine scenarios at 6 AM after other system tasks have run, for example, to validate log rotation.

 **KISS me baby**

 Keep It Simple Stupid. If you just want to use this for sanity checks, that's cool. You might not need to go full scale [Nagios](http://www.nagios.org/) and [cucumber-nagios](http://auxesis.github.com/cucumber-nagios/) right away. Integrate this into your existing infrastructure and monitoring processes in the way that it makes the most sense.

 Hopefully this has been helpful to you. I'll keep pushing the systems team here to get the bloggity blog blog posts about this coming. If you want to follow those guys, be sure to follow [@ironwallaby](http://twitter.com/ironwallaby), [@dahui0401](http://twitter.com/dahui0401) and [@gwaldo](http://twitter.com/gwaldo).

 You can find more hilarity over on my Twitter account, [@CzarneckiD](http://twitter.com/czarneckid).
