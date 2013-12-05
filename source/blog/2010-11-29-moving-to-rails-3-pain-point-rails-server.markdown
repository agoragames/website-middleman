---
title: 'Moving to Rails 3 Pain Point: rails server'
excerpt: Helpful shell functions to avoid running the new rails commands on an old
  rails project.
author: David Czarnecki
---
**Update:** _I have posted a [better solution](http://blog.agoragames.com/2010/11/30/a-better-way-to-avoid-a-project-named-server/)!_

 Working with rails 2 and 3 projects back and forth, day to day has been pretty painless thanks to [rvm](http://rvm.beginrescueend.com/) and [.rvmrc files](http://rvm.beginrescueend.com/workflow/rvmrc/). That is with the exception of accidentally running `rails server` on a rails 2 project. I do this all the time and it results in generating a new rails project called server rather then starting the rails server, my actual intention. It's almost as frustrating when running `script/server` on a rails 3 project but at least it doesn't spit out a bunch of useless files. Incidentally, all of the built in rails command (i.e. generate, console, ...) set the same trap. To avoid falling prey, I have created a bunch of shell functions which I would like to share with everyone in case they would like to be privy as well.

 The shell code is included in the gist below. I load these functions into my .bashrc file (actually my .zshrc file). Once they are are available just get in the habit of running `rails-server` or `rails-generate` or `rails-whatever` and the correct command will always be issued. Also, if anyone knows a better solution, do share!

 As one final note, I run `rails-server` so often that I have is aliased to `s` . If you would like to do the same add `alias s=rails-server` to your .bashrc file.

 {% gist  720619 %}
