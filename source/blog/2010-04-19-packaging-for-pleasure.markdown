---
title: Packaging For Pleasure
author: David Czarnecki
---
Let me be more explicit and say I'm going to be talking about Rails application packaging. Sorry, I needed a good post title for the lulz and the page views.

There are a few rake tasks that I've been using more and more now that all of our applications are running in a shared, virtual enviroment. They are:

- rake -T     # -T, --tasks [PATTERN]            Display the tasks (matching optional PATTERN) with descriptions, then exit.

Everyone should know and use this task at least once in their Rails-development life.

 - rake rails:freeze:gems   # Lock this application to the current gems (by unpacking them into vendor/rails)
 - rake gems:unpack   # Unpacks all required gems into vendor/gems.
 - rake gems:unpack:dependencies   # Unpacks all required gems and their dependencies into vendor/gems.

So, once I've created my project with "rails [project name]", then next thing I do is "rake rails:freeze:gems" to freeze the Rails gems. I'll enumerate the application's dependencies in the environment.rb file and then run "rake gems:unpack" to make sure those dependencies exist with the application. Example:

```ruby
config.gem 'will_paginate', :version => '2.3.11', :source => 'http://gemcutter.org'
config.gem 'factory_girl', :version => '1.2.4', :source => 'http://gemcutter.org'
config.gem 'fakeweb', :version => '1.2.8', :source => 'http://gemcutter.org'
```

Why do I like this approach? In a shared environment, it means we don't have to have our systems folks install any dependencies for our application to run making the application self-contained. This is mostly fine for gems that don't have an explicit native component. Also, in being explicit about versions of the gems that an application is using, we do not run the risk of chasing a moving target. Again, in a shared environment, if someone updates a gem on the system, it's probably not an issue until the one time it is and you're being called at 3 AM that the application is down because of a gem incompatibility change.

That's it. Any other packaging dos and don't?
