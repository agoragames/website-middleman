---
title: Speed Up Testing With Spork
author: David Czarnecki
---
If you TATFT, embrace red-green-refactor, or you just want to speed up execution of your test suite, you might want to take a look at [Spork](https://github.com/timcharper/spork). It will fork a test server for you that pre-loads your environment allowing you to run individual tests or your entire test suite without the startup cost of the loading the environment for each test or test suite run.

 Here's a quick setup guide for testunit with [spork-testunit](https://github.com/timcharper/spork-testunit), but if you're using RSpec, then it should "just work".

 1. Add the following to your project's Gemfile.

 ```ruby
 group :test, :development do
   gem 'spork'
   gem 'spork-testunit'
 end
 ```

 2. Run "bundle install" to install the gems.

 3. Run "spork testunit --bootstrap" to bootstrap your test/test_helper.rb file.

 4. Move your current test_helper "stuff" into the Spork.prefork block.

 5. Start spork in a terminal in your project directory.

 6. Run your full test suite in a another terminal in your project directory, "testdrb -Itest \*\*/\*.rb". It should run without any environment startup "cost". You can run individual tests, just the unit tests, just the functional tests, etc. in a similar fashion.

It seems like the 0.9.0.rc5 version of Spork is the one that handles underlying code changes correctly so you don't have to restart spork each time you change controller or model code.

You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).
