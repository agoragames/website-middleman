---
title: Capistrano and Campfire After-Deploy Hook For The Lulz
author: David Czarnecki
---
We recently started using [capistrano-mountaintop](https://github.com/technicalpickles/capistrano-mountaintop) to announce when deploys to our environments are taking place. This morning, [@andkjar](https://twitter.com/andkjar) noted that it'd be nice to see if the deploy was successful or not since it pastes the deploy log and it's long enough that you might not see whether or not the deploy was successful. This simple addition to deploy.rb checks the deploy log for success or failure and pastes an appropriate image into our Campfire room.

 {% gist 929219 %}

 Success results in:

 ![](uploads/2011/04/Screen-shot-2011-04-19-at-2.44.39-PM-300x292.png "Deploy Successful")

 Failure results in:

 ![](uploads/2011/04/Screen-shot-2011-04-19-at-2.44.51-PM-300x292.png "Deploy Failure")

 You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).
