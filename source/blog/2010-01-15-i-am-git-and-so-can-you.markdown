---
title: I Am Git (And So Can You!)
author: David Czarnecki
---
It's amazing how a few months can change your mindset around the version control system you use. Ever since I joined Agora Games in May 2008, we have used Subversion (SVN). Subversion is a fine version control system. We have one new project using Subversion and we will probably have a few legacy projects that will always use Subversion. However, last year, one of our project teams made the switch to Git and ever since then, new projects have been using Git.



 Looking at CruiseControl, here's the breakdown of Subversion and Git projects:

 Subversion: 4

 Git: 7

 Here is what I found personally about my Git transition experience.

- If you look at the simple examples or cursory blog post introductions of using Git as a version control system, you're probably not going to switch. I didn't find those examples or Git blog posts enlightening at all. I just thought to myself, "Great, Git can track changes to files just like Subversion, so why should I switch?".
- Git is something I can use independent of a service like GitHub locally to implement version control on projects that might never make it off of my machine.
- Git can be taken to the extreme where every "change" can be separated from the main branch of development and then merged at a later point. At Agora, we've taken a more balanced approach where major features go into a new branch and then are reviewed and merged back into the main branch, after which the new branch can be safely removed (e.g. replacing an authentication system).
- Although tools like [SmartGit](http://www.syntevo.com/smartgit/index.html) exist, I needed to get comfortable by using Git from the command-line.
- There are a lot of Git commands and capabilities I haven't used yet, and that's OK.
- I love the idea of the Git stash, where you can scurry away local changes and revert to a clean working directory, but then recover those changes later.

Git is just something you need to try. I'm no expert in Git (yet). Git's barrier to entry feels very minimal when compared to other version control systems.

 P.S. I realize this blog post falls under the "cursory blog post introductions of using Git as a version control system" category. Whatever.

 :)
