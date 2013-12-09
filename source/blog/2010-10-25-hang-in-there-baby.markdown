---
title: Hang In There Baby
author: David Czarnecki
---
![](uploads/2010/10/Hang-in-There-baby-Inspiration_0E75780C.jpg)

 How long should you keep a git fork around?

 Here's the flow: I forked [Amistad](http://github.com/raw1z/amistad), a library for friendships management in Rails 3, to add blocking friends support. I wrote the code, tests, and updated documentation. I generated a pull request for my changes. The author of the library merged those changes into the master branch for Amistad.

 **So, how long should I keep my git fork around? **

 After writing this post, I'm going to remove the fork because the changes have been integrated into the master branch. I assume that's a reasonable thing to do as there's no divergence between my copy and master. And I don't want anyone to search for my branch, find it, use it, and then later have issues that a) need to be fixed or b) want to contribute more functionality. I want all of that to happen in the library's master branch.

 Is that reasonable? Or is there a period of time I should keep my fork around for? Am I overthinking this? I'd just like to know if there's a better workflow or standard that the community has adopted in this regard.
