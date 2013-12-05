---
title: RailsConf Wrap Up
author: Jason LaPorte
---
Well, we're back from Vegas! And have been, for a couple weeks... I've been meaning to put up some follow-up resources for my talk (_PWN Your Infrastructure: Behind Call of Duty: World at War_), but there was just so much work to do when I got back... such is the life of a system administrator!

 That said, I've got some free moments, so I'm putting up some reference materials.



 Anyway, for those who didn't see it, my talk was about the cloud infrastructure we built to power the [Call of Duty stats site](http://callofduty.com/), and the tools we built to support that. The slides from the talk are available [here](http://files.agoragames.com/jason/railsconf09/), though they probably don't mean too much without the audio behind them.

 The puzzle pieces I talked about were:

- [Virtualization](http://en.wikipedia.org/wiki/Cloud_computing), which allowed us to not have to worry about hardware failures (and gave us a lot of flexibility unrelated to scaling, such as being able to instantly clone a test environment, do some testing, and shut it back down, for virtually no cost). [Terremark](http://www.terremark.com/) is our awesome hosting provider.
- [NFS](http://en.wikipedia.org/wiki/Network_File_System_(protocol)), which allowed us to do away with complicated tools like [Capistrano](http://www.capify.org/) and avoid managing server installations separately. It's been around for 25 years, so it's stable, and it's also dead simple. Unfortunately, it is not suitable for tasks requiring heavy IO or a very large number of files, so it must be used with care.
- [Monit](http://mmonit.com/monit/), which allowed us to monitor our hosts and automatically fix certain problems (such as application failures) without requiring human intervention. As mentioned in the slides, if you want to pull XML from Monit (which we do to aggregate data from all of our hosts), the URL or doing so is "/_status?format=xml". _This behavior is not documented._
- Overlord, a simple internal tool that distributes server configuration and aggregates monitoring information from each Monit instance. Overlord is currently proprietary, but we're considering releasing it once it's ready (read: once it's properly documented). But it's really simple. It basically says what files should be on which servers (all of which are just simple text files), and they're placed there on boot. Any files put into a particular directory are run as scripts. After that, it's just a big cron job to pull XML from all of our servers and make pretty graphs.
- [RRDTool](http://oss.oetiker.ch/rrdtool/), which has many uses, but specifically makes the aforementioned pretty graphs. These are vital to determine trends and validate results. Also, they're really pretty. Double also, RRDTool is extremely well constructed and totally awesome.
- Using shell scripts everywhere. Thanks to using NFS, Monit, and Overlord, our distribution needs are already taken care of, so we can do a **lot** via simple shell scripts, which makes our infrastructure self-documenting and easy to work with. The simplest example of this is that we switched to deploying our applications with shell scripts, instead of using Capistrano or other network tools.

The end result is a scalable system that, while it still has a few warts we're working through, is very simple, self-documenting, and easy for even a non-sys-admin to diagnose and solve problems on--there's very little magic here, just some elegant abstractions.

 Some people were interested in getting some more information on our deploy scripts, so I've made them [available online](http://files.agoragames.com/jason/deploy/). They come in two parts: "core.sh" defines the core set of functionality, for logging, rollbacks, and some basic "here's how you deploy Rails 101" functions. "deploy.sh" actually performs the deploy itself, and is the script that should be executed.

 All told, we had a blast, and are looking forward to future RailsConfs!
