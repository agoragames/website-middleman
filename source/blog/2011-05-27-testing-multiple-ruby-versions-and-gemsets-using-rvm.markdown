---
title: Testing Multiple Ruby Versions and Gemsets Using RVM
author: David Czarnecki
---
I think it might be all the time I'm devoting to L.A. Noire which caused me to want to research how to test multiple Ruby versions and gemsets using RVM, but that's besides the point. Here's how I went about it.

 I've been testing this with 2 gems I maintain, [tasty](https://github.com/czarneckid/tasty) - a Ruby gem for interacting with the del.icio.us service and [leaderboard](https://github.com/agoragames/leaderboard) - Leaderboards backed by Redis in Ruby. I'll use tasty as the example for this blog post.

 The .rvmrc file for the tasty gem looks like:

 {% gist 996225 %}

 In the Rakefile for the tasty gem I have the following:

 {% gist 996230 %}

 If I run rake, I get the following output, correctly showing that rake uses the tasty_gem gemset for each version of Ruby.

 {% gist 996224 %}

 I also used "_gem" in the gemset names. Is that overkill? I was just trying to not conflict with say a project you might have called "tasty" with it's own tasty gemset.

 You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).
