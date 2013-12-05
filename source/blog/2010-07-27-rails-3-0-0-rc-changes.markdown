---
title: Rails 3.0.0.rc changes
author: David Czarnecki
---
Rails 3.0.0 now has a [release candidate](http://weblog.rubyonrails.org/2010/7/26/rails-3-0-release-candidate). These are the changes I made to a new application I am working on to clear up any deprecation warnings.



 **Gemfile**

 gem 'rails', '3.0.0.rc'
 gem 'haml', '3.0.14'

 Obviously you have to tell your application to use the 3.0.0.rc. Also, it seems as if haml 3.0.13, which we were previously using, had some incompatible changes with Rails 3.0.0.rc

 **Rakefile**

 Change:

 Rails::Application.load_tasks

 to:

 YourApplicationName::Application.load_tasks

 **config/environments/test.rb**

 Add:

 config.active_support.deprecation = :stderr

 **config/routes.rb**

 Change:

 YourApplicationName::Application.routes.draw do |map|

 to:

 YourApplicationName::Application.routes.draw do

 Rails 3 routing in great detail: [The Lowdown on Routes in Rails 3](http://www.engineyard.com/blog/2010/the-lowdown-on-routes-in-rails-3/).
