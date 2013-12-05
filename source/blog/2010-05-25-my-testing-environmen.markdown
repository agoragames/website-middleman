---
title: My Rails dev environment
author: Brian Corrigan
---
I love reading about the way people set up their development environments. I recently started working on a new project at work and had to set everything up from scratch. Here's my setup.

First, install some gems.

```
# On all systems
sudo gem install ZenTest
sudo gem install redgreen
sudo gem install autotest-rails
sudo gem install shoulda
sudo gem install factory_girl

# Only on my OSX machine
sudo gem install autotest-growl
sudo gem install autotest-fsevent

# Only on my Ubuntu machine
sudo gem install test_notifier
sudo apt-get install libnotify-bin
```

Next, I setup my ~/.autotest file:

```ruby
#!/bin/ruby
require 'redgreen/autotest'
require 'autotest/timestamp'
require "autotest/restart"

#Only Ubuntu
require "test_notifier/autotest"

#Only OSX
require "autotest/growl"
require 'autotest/fsevent'

# All machines
Autotest.add_hook :initialize do |autotest|
  %w{.git .svn .hg .DS_Store ._\* vendor tmp log doc}.each do |exception|
    autotest.add_exception(exception)
  end
end
```

Also, I really like git instaweb. I sent it to G, our brilliant (ex)intern and he likes it too. To start it I use:

```
git instaweb -d webrick --start
```

You can automate this by adding the following to your ~/.gitconfig:

```
[instaweb]
httpd=webrick
```

You can also add a port option (port=8000) if you want.

Also, to stop instaweb, from the git repo that you started instaweb from run:

```
git instaweb stop
```

Finally, I tend to branch a lot and store them server-side. I like tracking branches to automatically push/pull changes to a branch from a remote repository. All this really does is add a few lines to your .gitconfig, but hey, who doesn't like a shortcut.

```
git branch --track branch remote
```

Last but not least, the Cheat gem is awesome. It's like man, but distilled to the things you'll actually use. (It's actually where I read about instaweb) Use it!

```
sudo gem install cheat
```

So in general, that's the interesting bits of my environment. How about yours?
