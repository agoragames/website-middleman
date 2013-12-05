---
title: Getting started with data_fabric
author: David Czarnecki
---
The [data_fabric](http://github.com/mperham/data_fabric) gem "provides flexible database connection switching for ActiveRecord". If you're not concerned with database sharding, you might want to skip this blog post. Or not. Either way, I'm not going to be offended.

I have a requirement that certain data in an application that I'm developing will probably have to be sharded because, if you'll excuse my English, there will a "shit ton" of data. This only affects one model out of the few models I have in the application. I don't have a requirement that the data will be replicated (which is another feature supported in `data_fabric`), so I'm not going into that here. In any event, here is a rundown of how I got started developing and testing with `data_fabric`.

 - Configure the `data_fabric` gem in your `config/environment.rb` file.

```ruby
config.gem 'data_fabric'
```

 - In your model(s), decide on which column or how the data is going to be shared.

```ruby
data_fabric :replicated => false, :shard_by => :initial_code
```

 In this case, inital_code is a method that looks at a piece of the model's data and gives me the correct shard.

 - Setup the database shards in your `config/database.yml` file. I actually setup only one shard for development and testing environments to make things easier. I'm just including the one for the test environment here. You can read on the `data_fabric` site about the naming convention for sharded database connections.

```yaml
test:
adapter: mysql
encoding: utf8
reconnect: false
database: myapp_test
pool: 5
username: root
password:

# This is the database shard
initial_code_testenv_test:
adapter: mysql
encoding: utf8
reconnect: false
database: myapp_test_testenv
pool: 5
username: root
password:
```

 - In `config/initializers/my_app_model.rb`, I actually stub out the initial_code method to return a single value for the development and test environments. This is merely convenience so I don't have to include every single database shard for development and testing.

```ruby
require 'mocha'

if 'development'.eql?(RAILS_ENV)
  PromotionCode.stubs(:initial_code).returns('devenv')
end

if 'test'.eql?(RAILS_ENV)
  PromotionCode.stubs(:initial_code).returns('testenv')
end
```

- I copied part of the Rakefile from the `data_fabric` gem to actually be able to migrate the database for the sharded database connections. This was definitely missing from the `data_fabric` README.

```ruby
require 'fileutils'
include FileUtils::Verbose

namespace :db do
  task :migrate do
    require 'erb'
    require 'logger'
    require 'active_record'

    reference = YAML::load(ERB.new(IO.read("config/database.yml")).result)
    env = RAILS_ENV = ENV['RAILS_ENV'] || 'development'

    ActiveRecord::Base.logger = Logger.new(STDOUT)
    ActiveRecord::Base.logger.level = Logger::WARN
    ActiveRecord::Base.configurations = reference.dup
    old_config = reference[env]
    reference.each_key do |name|
      next unless name.include? env
      next if name.include? 'slave' # Replicated databases should not be touched directly

      puts "Migrating #{name}"
      ActiveRecord::Base.clear_active_connections!
      ActiveRecord::Base.configurations[env] = reference[name]
      ActiveRecord::Base.establish_connection RAILS_ENV
      ActiveRecord::Migration.verbose = ENV["VERBOSE"] ? ENV["VERBOSE"] == "true" : true
      ActiveRecord::Migrator.migrate("db/migrate/", ENV["VERSION"] ? ENV["VERSION"].to_i : nil)
    end
  end
end
```

 - In my test classes that use the sharded model, I have setup and teardown methods that activate and deactivate the shard.

```ruby
def setup
  DataFabric.activate_shard(:initial_code => 'testenv')
end

def teardown
  MyAppModel.delete_all
  DataFabric.deactivate_shard(:initial_code => 'testenv')
end
```

 I did find that I needed to delete all the objects in the database for the sharded model. I'm still digging into why that's the case. My ActiveRecord_fu isn't that strong I guess.

 All in all, sharding is relatively easy with data_fabric. Pimping, however, "ain't easy." But that's for another blog post I guess.
