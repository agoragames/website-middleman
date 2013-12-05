---
title: Resque and Resque Unit in Rails 3
author: David Czarnecki
---
Do you need to create background jobs, place those jobs on multiple queues, and process them later? And do you want to test your queue appropriately? Are you using Rails 3?

 If your answer to those questions is yes, then you're probably already looking at and using [Resque](http://github.com/defunkt/resque) and [Resque Unit](http://github.com/justinweiss/resque_unit). I really just want to cover the nice part about using these libraries in Rails 3. Let's cover the basic setup.

`Gemfile`

```ruby
 # Redis/resque

 gem 'resque', '1.8.2'
 gem 'redis', '2.0.12'
 gem 'redis-namespace', '0.10.0'

 group :test do
 gem 'factory_girl_rails', '1.0'
 gem 'mocha', '0.9.8'
 gem 'resque_unit', '0.2.6'
 end
```

`config/initializers/resque.rb`

```ruby
 require 'resque'

 redis_config = YAML.load_file("#{Rails.root}/config/redis.yml")
 Resque.redis = redis_config[Rails.env]
 Resque.redis.namespace = "resque:company:namespace"
```

`config/redis.yml`

```ruby
 development: localhost:6379
 test: localhost:6379
 staging: localhost:6379
 production: localhost:6379
```

 Here's the kicker. As we're defining resque_unit in the "test" group in our Gemfile, it's going to "provide a mock Resque for testing Rails code that depends on Resque". Now we can make assertions in our tests about data
 in Resque without having to have Resque running. Pretty simple right?

 P.S. The answer to that last question is "yes".

 P.P.S. My code in the Gemfile does have indentation, the code formatter on our blog sucks.
