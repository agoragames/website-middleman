---
title: Bzr to Git Migration
author: An Engineer
---
When I joined Agora, one of the first things I did was talk up [git](http://git-scm.com) and how it'll cure cancer, AIDS, and solve world peace. All at once. What that means for me is I've basically been tasked with the job of migrating anything that's not git to git.

 For some things these kinds of migration are first class citizens. Conveniently SVN, our old VCS is one of those. One of my new migrations was, less conveniently, [Bazaar](http://bazaar.canonical.com/). Now we have nothing against Bazaar at Agora. I mean my main personal open source project, [Exaile](http://exaile.org/), uses Bazaar. But we agreed we would rather only have one VCS in house.

 After looking around and trying some fancy tools that didn't work (read: tailor), I stumbled on a really quick solution that seems like it does everything necessary. Both Git and Bazaar (via plugins) support the fast-import/export format. I'm not sure about the mystic ways of how this format works but I do know it made my Bazaar repository a Git repository, and that makes me pleased.

## Getting the bzr plugin
The first step would be to get the fast-import plugin for Bazaar from the launchpad mirror.
```
 mkdir -p ~/.bazaar/plugins
 cd ~/.bazaar/plugins
 bzr clone lp:bzr-fastimport fastimport
```
 You can make sure it installed properly using a `bzr fast-export --help` and ensure that it doesn't complain.
## Copy the repository
Now that we have all the tools, time to copy it over
```
 mkdir ~/project.git
 cd ~/project.git
 git init
 bzr fast-export --plain ~/path/to/bzr/branch | git fast-import
 git checkout master # only needed for a non-bare repository, like I made above
```

 Wait a little while (or a long while if you're testing the above code on a netbook for some reason like me). And that should be it.

 I'm not sure how well this works with multiple Bazaar branches. There may be some crazy `--flags` on each side to make it work but running the code I put above on a full repo makes fast-export complain that I'm not pointing it to a valid branch. Please give us your comments if you know how to do this :).

 **Update:** Found out it was .bazaar not .bzr. My bad.
