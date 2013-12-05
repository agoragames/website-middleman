---
title: Setting Up a Rails 3 Development Environment
author: David Czarnecki
---
Getting started with Rails 3 development is a very straightforward process, granted you have the prerequisite version of Ruby installed on your system. [Ruby Version Manager](http://rvm.beginrescueend.com) (RVM) is a utility that makes it very easy and painless to switch between Ruby versions while maintaining your system's stock Ruby installation. RVM not only enables you to switch between Ruby versions, but also maintains distinct gem sets specific to each of those versions which is very helpful when testing out new Rails environments.



 Before we jump into setup, first a bit about our pre-Rails3 environment:

- Mac OS X 10.5.8
- ruby 1.8.6 (2009-06-08 patchlevel 369) [universal-darwin9.0] (stock)
- RubyGems 1.3.7
- Various older versions of Rails (2.3.8, 2.3.5, 2.3.4, 2.3.2, 2.2.2, 2.1.1, 2.1.0, 2.0.2, 1.2.6, 1.2.3)

We will be installing the latest release of Rails which, as of this writing, is Rails 3 beta4.
 We will also complete setup using the latest version of Ruby 1.9.
 The minimal version of Ruby 1.9 required for this Rails release is 1.9.2.
 To complete setup with Ruby 1.8.7, consult the [Rails 3 release notes](http://guides.rails.info/3_0_release_notes.html#rails-3-requires-at-least-ruby-187) for the minimal version requirements.

 The basic installation steps are as follows:
1. Install RVM (Ruby Version Manger)
2. Install Ruby 1.9.2
3. Install Rails3 beta4
4. Profit!

To install, issue the following commands in a terminal window:
1. `bash < <( curl http://rvm.beginrescueend.com/releases/rvm-install-head )`
  - This is the preferred RVM installation method as described in the [RVM installation instructions](http://rvm.beginrescueend.com/rvm/install/).

2. `rvm install 1.9.2-head`
3. `rvm 1.9.2-head`
4. `gem install rails --pre`

Installation of the rails gem should also install it's respective dependencies:
[05:16:50][tquackenbush@TQuackenbush ~]$ gem list

 \*\*\* LOCAL GEMS \*\*\*
 never
 abstract (1.0.0)
 actionmailer (3.0.0.beta4)
 actionpack (3.0.0.beta4)
 activemodel (3.0.0.beta4)
 activerecord (3.0.0.beta4)
 activeresource (3.0.0.beta4)
 activesupport (3.0.0.beta4)
 arel (0.4.0)
 builder (2.1.2)
 bundler (0.9.26)
 erubis (2.6.5)
 i18n (0.4.1)
 mail (2.2.5)
 mime-types (1.16)
 polyglot (0.3.1)
 rack (1.1.0)
 rack-mount (0.6.4)
 rack-test (0.5.4)
 rails (3.0.0.beta4)
 railties (3.0.0.beta4)
 rake (0.8.7)
 rdoc (2.5.8)
 thor (0.13.6)
 treetop (1.4.8)
 tzinfo (0.3.22)
 To test out your new installation, try creating a new bare bones Rails 3 application like so:
1. `rails new test_app`
2. `cd test_app`
3. `bundle install`
  - Bundler is the new default dependency manager in Rails 3, and will install any missing gems required by the project.
- In my case, this was 'sqlite3-ruby (1.3.0)'

4. `rails server`

As in Rails 2, this should launch a WEBrick server instance listening on localhost port 3000 with output similar to:
=> Booting WEBrick
 => Rails 3.0.0.beta4 application starting in development on http://0.0.0.0:3000
 => Call with -d to detach
 => Ctrl-C to shutdown server
 [2010-06-23 16:54:06] INFO WEBrick 1.3.1
 [2010-06-23 16:54:06] INFO ruby 1.9.2 (2010-06-22) [i386-darwin9.8.0]
 [2010-06-23 16:54:06] INFO WEBrick::HTTPServer#start: pid=6529 port=3000
 And that's it! You're all ready to go with Rails 3!

 **Update: June 25th, 2010** (David Czarnecki)

 I ran into an issue on one system where rvm and Ruby 1.9.2 were correctly installed on the system, but Rails 3 would not install. The installation would go as follows.
 >
machine-name:~ dczarnecki$ gem install rails --pre
 WARNING:  RubyGems 1.2+ index not found for:

 RubyGems will revert to legacy indexes degrading performance.
I blew away the ~/.gemrc file and Rails 3 installed successfully. YMMV.

 **Update: June 29th, 2010** (Joshua Childs)
 Ran into two issues with with dependencies while getting setup on my Ubuntu workstation.

 First was while problem I ran into was while following the installation steps.

 [source language='bash']
 # Command:
 josh@jagar-tharn:~$ rvm install 1.9.2-head

 # Response:
 fail: bison is not available in your path. Please ensure it exists before compiling from head.

 # Solution:
 sudo apt-get install bison
```

 And the second problem I ran into was while using bundle to setup my dependencies. My workstation did not have sqlite3 installed.

 [source language='bash']
 # Command:
 josh@jagar-tharn:~/projects/test_app$ bundle install

 # Response:
 ...
 Using rails (3.0.0.beta4) from bundler gems
 Installing sqlite3-ruby (1.3.0) from rubygems repository at http://rubygems.org/ with native extensions /home/josh/.rvm/rubies/ruby-1.9.2-head/lib/ruby/1.9.1/rubygems/ext/builder.rb:46: warning: Insecure world writable dir /usr/local/libevent/ in PATH, mode 040777
 /home/josh/.rvm/rubies/ruby-1.9.2-head/lib/ruby/1.9.1/rubygems/installer.rb:483:in `rescue in block in build_extensions': ERROR: Failed to build gem native extension. (Gem::Installer::ExtensionBuildError)

 /home/josh/.rvm/rubies/ruby-1.9.2-head/bin/ruby extconf.rb
 checking for sqlite3.h... no
 sqlite3.h is missing. Try 'port install sqlite3 +universal' or 'yum install sqlite3-devel'
 \*\*\* extconf.rb failed \*\*\*
 Could not create Makefile due to some reason, probably lack of
 necessary libraries and/or headers. Check the mkmf.log file for more
 details. You may need configuration options.

 Provided configuration options:
 --with-opt-dir
 --without-opt-dir
 --with-opt-include
 --without-opt-include=${opt-dir}/include
 --with-opt-lib
 --without-opt-lib=${opt-dir}/lib
 --with-make-prog
 --without-make-prog
 --srcdir=.
 --curdir
 --ruby=/home/josh/.rvm/rubies/ruby-1.9.2-head/bin/ruby
 --with-sqlite3-dir
 --without-sqlite3-dir
 --with-sqlite3-include
 --without-sqlite3-include=${sqlite3-dir}/include
 --with-sqlite3-lib
 --without-sqlite3-lib=${sqlite3-dir}/lib
 ...

 # Solution:
 josh@jagar-tharn:~/projects/test_app$ sudo apt-get install sqlite3
 josh@jagar-tharn:~/projects/test_app$ sudo apt-get install libsqlite3-dev
```
