---
title: Meta Leaderboards
author: David Czarnecki
---
Traditionally, leaderboards rank players using one criteria, e.g. XP, kills, etc. What if you wanted to retrieve information from a leaderboard that combined more than one criteria? I'm going to show you how to do that.

 To be honest, I don't necessarily have a definite use case for this functionality, but I thought it might be useful. So, here goes nothing.

 Let's say you've got a game and its multiplayer mode can be played across 5 maps. We'll also simplify things and say that we're only ranking players on each map on XP gained when finishing the map. If you want to generate a leaderboard of players ranked by XP who have played in any of the maps, you would need to perform a merge of each of the leaderboards for the 5 maps. If you want to generate a leaderboard of players ranked by XP who have played in each of the maps, you would need to perform an intersection of each of the leaderboards for the 5 maps.

 This functionality is now present in the [Ruby leaderboard gem](https://github.com/agoragames/leaderboard) released today.

 You can use the merge_leaderboards(...) call to merge the current leaderboard with any other leaderboards into a new leaderboard.

 {% gist 843517 %}

 You can use the intersect_leaderboards(...) call to intersect the current leaderboard with any other leaderboards into a new leaderboard.

 {% gist 843527 %}

 Hopefully you'll find this functionality useful.

 You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).
