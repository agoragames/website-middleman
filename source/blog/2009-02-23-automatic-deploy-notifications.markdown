---
title: Automatic Deploy Notifications
author: Ola Mork
---
When we make a deploy to our staging or production environments there are about 5 people who **need** to know and about 25 who **want** to know. Often someone is forgotten or the email doesn't go out at all and we get a phone call (which no one likes).

 The solution? Capistrano recipes to the rescue!


```ruby
before 'deploy', 'deploy:notify'
```

 No matter what happens, if we're deploying people are going to know about it.

 Here's that task:

  ```ruby
namespace :deploy do
  desc "sends a notification email letting everyone know we're deploying"
  task :notify do
    deployment_name = application.to_s.gsub(/(-.*)?/, '').upcase
    stage_name = stage.to_s.upcase
    action_mailer_with_temporary_delivery_method do
      mail = TMail::Mail.new
      mail.subject = "Super Fantastic Project Pending Deploy [#{deployment_name} #{stage}]"
      mail.to      = "superproject-deploy@lists.yourcompany.com"
      mail.from    = ActionMailer::Base.smtp_settings[:user_name]
      mail.date    = Time.now
      mail.body    = ActionMailer::Utils.normalize_new_lines(%Q(
Hello everyone,

We're making a deploy to the #{stage} environment. The #{stage} site may (or may not) be
unavailable for a few minutes sometime within the next 30 minutes (depending on how long
it takes to upload the changes).

This message is automated.

---------------------- debugging information ----------------------
#{variables}
))
      ActionMailer::Base.deliver(mail)
      # puts mail.body
    end
  end
end
```

 Now, what's going on here? First, apologies to DHH but I'm not smart enough to figure out how to make the Rails email system work so we just use TMail directly. Which is fine, but we use ARMailer which puts all of our email in a queue and it gets delivered by a cron job every 5 minutes or so. This usually works pretty well but in this case we have two problems though. The first is this is run on the deployer's machine, which may not have access to the database where it needs to queue up the email. Plus, when we deploy we disable the crons and we don't turn them back on until we're satisfied everything is working. If we used ARMailer for this particular email, the site may be down and no one would know; defeats the purpose of the notification.

 action_mailer_with_temporary_delivery_method addresses this problem:

```ruby
def action_mailer_with_temporary_delivery_method
  existing_delivery_method = ActionMailer::Base.delivery_method
  existing_smtp_settings = ActionMailer::Base.smtp_settings
  begin
    ActionMailer::Base.delivery_method = :smtp
    ActionMailer::Base.smtp_settings = {
      :address => "smtp.gmail.com",
      :port => "587",
      :domain => "your.domain.com",
      :authentication => :plain,
      :user_name => "do-not-reply@your.domain.com",
      :password => "PASSword"
    }
    yield
  ensure
    ActionMailer::Base.delivery_method = existing_delivery_method
    ActionMailer::Base.smtp_settings = existing_smtp_settings
  end
end
```

`action_mailer_with_temporary_delivery_method` temporarily sets up ActionMailer to use SMTP (with gmail) to send out our notification. When we're done, it sets it back to whatever it was set to before.

 We've hurdled the actual message delivery, but how can we make that notification message itself more useful to the internal group? We do two things. The first is to sort out exactly what we're deploying and where we're deploying it to:

```ruby
  deployment_name = application.to_s.gsub(/(-.*)?/, '').upcase
  stage_name      = stage.to_s.upcase
```

 application and stage are set in our regular deploy script with:

```ruby
  set :application, 'superproject-staging'
```

  `:stage`  is more complicated but essentially the same (in this example it would be 'staging')

 The second pieces is  `variables` . Capistrano 2.3 has an instance variable available to all tasks named  `@variables` . We were just inspecting that for a while but it has a lot of procs for determining some of the values. Now we do this:

```ruby
def variables
  result = []
  @variables.reject { |k,v| k.to_s.downcase.eql?('password') }.each_pair do |key, value|
    # since we're going to be printing this out, we don't want to see garbage like
    # "#"
value = value.is_a?(Proc) ? value.call : value
value = value.is_a?(Array) ? value.join(", ") : value
result
```

 Which gives you some better output:

```
---------------------- debugging information ----------------------
 application : superproject-staging
 available_stages : staging, production, qa
 cron_file : config/cron/staging_cron.conf
 cron_role : utility
 cron_role_only_clause :
 current_dir : current
 current_path : /home/www-data/superproject-staging/current
 current_release : /home/www-data/superproject-staging/releases/20090220155729
 current_revision : 32024
 default_environment :
 default_run_options : ptytrue
 deploy_to : /home/www-data/superproject-staging
 deploy_via : checkout
 keep_releases : 7
 latest_release : /home/www-data/superproject-staging/releases/20090220162352
 latest_revision : 32024
 logger : #<Capistrano::Logger:0x1214e30>
 memcache_extra_options :
 memcache_memory : 64
 memcache_pid_file : /home/www-data/superproject-staging/shared/log/memcache.pid
 memcache_port : 20109
 memcache_role : app
 memcache_user : root
 migrate_plugin_role : db
 migrate_plugin_role_only_clause : primarytrue
 mongrel_address : 0.0.0.0
 mongrel_environment : staging
 mongrel_instances : 8
 .
 .
 .
 .
 etc
```

 Prettier examples are available at [pastie](http://pastie.org/395233). Drop that in `config/recipes/notification.rb` and in your normal `config/deploy.rb` include this:

```
load 'config/recipes/notification
```
