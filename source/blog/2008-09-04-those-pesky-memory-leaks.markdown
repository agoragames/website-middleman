---
title: Those Pesky Memory Leaks
author: Jason LaPorte
---
First (technical) post!

 AgoraGames has been doing community sites for several years now, which means that some of them are pretty old and some of them have particularly unruly codebases, especially one such site. This site (which shall remain nameless to protect the guilty) ran perfectly fine at launch, but over the course of a year-and-a-half has slowly gone from speed-demon to slug-stuck-in-molasses.



 _(I apologize for the lack of accompanying images, etc. as I worked through this... next time, I'll keep posterity in mind as I work through an interesting problem!)_

 I'm the System Administrator here, so it's my job to make sure that everything stays running smoothly from the OS's standpoint; thanks to our religious use of [monit](http://www.tildeslash.com/monit/), the cause of the site's slowness was pretty obvious: the mongrels running the site would balloon to consuming a gigabyte of memory within minutes, forcing monit to kill-and-restart the servers. This is a Bad Thing (TM).

 Finding and fixing memory leaks in Rails isn't the easiest task in the world (as other bloggers have been apt to mention), but in this case, the path to fixing it was pretty straightforward.

 First task was to set up a separate bank of mongrels for the forums: since the site is so old, it's the only part of the site that gets much traffic these days. I told NGINX to proxy all requests starting with /forums to those. It worked just fine, and the forums were immediately quite quick. From looking at monit, it was pretty apparent that the forum mongrels didn't have the memory leak, since they ran without problems.

 So, to start digging into the main portion of the site, I booted up a local server in production mode and [curl](http://curl.haxx.se/)ed the homepage. It took a whopping 222 seconds (and, from looking at [top](http://en.wikipedia.org/wiki/Top_(Unix)), consumed 800MB of memory!). Looking at the debug logs, virtually all of that time was spend doing two queries: loading forum posts with associations, and loading tournaments with associations. Sounds a bit sketchy, no?

 The home page's controller was laid out very logically, so mapping the SQL queries in the log to method invokations in the controller was simple. There were two methods that were killing us, and they both looked something like this:

```ruby
class ForumPost < ActiveRecord::Base
 ...
 def self.most_recent
  find(:first, :order => "forum_posts.created_at desc",
 :include => [:account, :forum_topic, :forum])
 end
 ...
 end
 ```

 Apparently, the find is loading up the (tens of thousands) of forum posts, _with all the associated objects!_ Ruby doesn't play nice when you have thousands of object in memory, and loading up hundreds of thousands of objects really makes things go south. Also makes sense why it didn't become a problem for a while -- it's no big deal to load 100 object into memory (during testing and launch); but after a year and the site's forum starts to fill...

 But why? Isn't this doing a :first? Shouldn't it only be loading _one_ object with associations? My guess is that Rails is loading all objects (with their associations) into an array and shifting off the first element. This isn't smart behavior, but would explain what we're seeing. (It's also worth noting that this is using a fairly old version of Rails; I believe this silliness is fixed in more recent versions.)

 Fixing this was actually trivial. Slap a :limit => 1 on there, or replace the :include with a :join. (Or, in the particular case above, remove the :include entirely. It's not being used for anything relevant.)

 I [grep](http://en.wikipedia.org/wiki/Grep)ped the codebase for any other :includes, and fixed the ones that were broken. The site blazes along now and doesn't leak, just like it did in its glory days.

 Moral of the story: **don't use includes lightly**. Make sure you know what your finds are actually doing. In our case, it translated into memory leaks, but it could just as easily translate into high database load, which is just as bad.
