---
title: Going All The Way With factory_girl and rails3-generators
author: David Czarnecki
---
I responded to a few tweets from [Barrett Clark](http://twitter.com/barrettclark) about [factory_girl](https://github.com/thoughtbot/factory_girl) noting that you can get a lot more functionality out of factory_girl than just replacing fixtures. However, let's keep things simple to start and just replace fixtures with factory_girl in a simple Rails 3 application.

 I want to replace fixtures in my new Rails 3 projects with factories. One of the best ways of doing that is to start a new Rails 3 project. Let's do that.

 {% gist 710407 %}

 To add factory_girl functionality, as well as functionality for factory_girl generators, we need to pull in a few gems into our Gemfile.

 {% gist 710412 %}

 Run "bundle install" to install the gems. Now let us add a scaffold for a person with first_name and last_name attributes.

 {% gist 710417 %}

 BOOM! We specified a fixture replacement when generating our scaffold using "-r factory_girl". You will also notice that the scaffold generated a people factory in test/factories/people.rb.

 {% gist 710424 %}

 That factory looks remarkably similar to a fixture, eh? Great, we are ready to run rake and deploy this application to Heroku.

 {% gist 710427 %}

 Uh oh. Our functional test for the people controller is still living in fixtureville. So, we need to change that test's setup method to use a factory, not a fixture.

 {% gist 710439 %}

 And if we run our tests again, SUCCESS!

 {% gist 710441 %}

 If factory_girl and rails3-generators are tiring you out, [you can always fake it](http://blog.agoragames.com/2010/04/09/as-it-turns-out-faking-it-is-ok/). There is also an ASCIIcast that also describes [Generators in Rails 3](http://asciicasts.com/episodes/216-generators-in-rails-3). You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).
