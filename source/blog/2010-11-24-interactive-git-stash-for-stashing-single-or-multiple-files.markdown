---
title: Interactive Git Stash For Stashing Single or Multiple Files
author: David Czarnecki
---
**TL;DR** git stash save --patch

 From the git docs, "With --patch, you can interactively select hunks from in the diff between HEAD and the working tree to be stashed."



 This past week, I came across a situation where I wanted to stash a couple of working files in a git repository, pull in some changes, and then apply the stash. However, I couldn't immediately see the forest for the trees or some other stupid metaphor. Basically it was just a case where I had to RTFM for git stash. In the gist below, I go through a simple example of stashing 2 out of 3 files, making some changes to the repository, and then applying the changes of the 2 stashed files.

 {% gist 714660 %}

 I hope you found this example useful. I know that it's some git-fu I'll be using more often.

 You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).
