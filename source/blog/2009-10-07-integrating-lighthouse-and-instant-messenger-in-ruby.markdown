---
title: Integrating Lighthouse and Instant Messenger in Ruby
author: David Czarnecki
---
The [Introduction to the Lighthouse API](http://lighthouseapp.com/api/introduction) mentions something you might do with the Lighthouse API is "Accessing and creating tickets through your Instant Messenger client.". How easy is it to do this? Surprisingly easy.



 You will need to download and install the [Lighthouse API](http://github.com/Caged/lighthouse-api) gem and the [Net::TOC](http://net-toc.rubyforge.org/doc/classes/Net/TOC.html) gem.

 Run this in an irb session.

```ruby

 require 'net/toc'
 require 'lighthouse'
 require 'sanitize'
 include Lighthouse

 Lighthouse.account = 'shaft'
 Lighthouse.token = 'hesonebadmotherfushutyourmouth'

 Net::TOC.new("someaimaccount", "someaimpassword") do |msg, buddy|
 project = Project.find(Sanitize.clean(msg).to_i)
 buddy.send_im("Here is some information about your project: #{project.name}")
 end

```

 You should then be able to add 'someaimaccount' to your AIM buddy list and send a project ID and have it return the project name.

 And boom goes the dynamite!

 You'll of course need to change the Lighthouse account and token as appropriate (or use username and password for logging in). msg is a little weird and although it's a string, it's HTML, so you need to strip out any tags before doing anything. And of course you'd want to add in some way of parsing the input from the user into some DSL (Domain Specific Language) for interacting with your fancy new Lighthouse AIM bot.

 Happy hacking!
