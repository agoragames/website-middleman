---
title: To Version or Not To Version Your Gems in Gemfiles
author: David Czarnecki
---
I don't like moving targets. I'm a software developer, not a sharpshooter. So why don't more people version all of their gems in a Gemfile?

 Here is a sample Gemfile for a Rails 3 application I was looking at yesterday.

 {% gist 721842 %}

 The gems for Rails and thin have been versioned. Why aren't the gems for will_paginate, nokogiri, and haml versioned? I consider un-versioned gems moving targets. Why? You're going to get the latest version of a gem. The developer doesn't know (or necessarily care) you depend on XXX functionality in version 1.0.23 of their gem. And so what if in version 2.0.0 of their gem, they make incompatible changes that break your application? I consider versioned gems a virtual "stake in the ground". To the best of my abilities, with rigorous testing of course, I know that given these specific versions of gems, my application performs as expected.

 What's your opinion?

 **UPDATE:**

 Good point from my co-worker, Blake, who says that bundle will install the lastest version of a gem and then lock the version in your Gemfile.lock file on the first go-round. It could still be an issue if you do a "bundle update" locally or in your deployment process.

 You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).
