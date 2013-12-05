---
title: Creating high score tables (leaderboards) using Redis
author: David Czarnecki
---
To my other colleagues at Agora Games, I have one word: FIRST!

 Now that I've got that out of my system, down to the business at hand. I've read a number of articles on [Redis](http://redis.io/) that mention how it could be used for high score tables (leaderboards), but I didn't see any examples that would walk you through exactly how to do that. Time to rectify that since it's 2011 and we still don't have flying cars ... so ,,|, future.

**UPDATE: Please use the [original post for any comments/feedback](../2011/01/01/creating-high-score-tables-leaderboards-using-redis/). This post is a placeholder.**

**UPDATE:** All of this has been packaged up in the [leaderboard gem on GitHub](https://github.com/agoragames/leaderboard).



 Leaderboards are a small, but important part of the engineering we do at Agora Games. As such, [when not riding the short bus](http://twitter.com/CzarneckiD/status/21081627241226241), I'm looking for ways to improve leaderboard generation for various situations. So, here's how I might approach creating leaderboards using Redis.

 I offer the following gist. Here's the jist of the gist:

 * The following was prototyped using the redis CLI. You can obviously port the logic to your favorite language binding for Redis, \*cough\* Ruby \*cough\*.

 * You will be using the [Sorted Set](http://redis.io/commands#sorted_set) commands in Redis.

 * You will need to be running at least Redis 2.1.6 to use the ZREVRANGEBYSCORE method.

 * Add players to the HIGHSCORES "table" using the ZADD method.

 * Print out the players (with a given page size) from the HIGHSCORES "table" using the ZREVRANGEBYSCORE method to show scores from highest to lowest.

 * There is some bookkeeping code that you would do at the application level in terms of tracking what page you are on, dividing the total # of leaderboard entries into pages for a given page size, etc.

 * Create an "Around Me" leaderboard with scores of individuals above and below an individual player using a combination of the ZREVRANK and ZREVRANGEBYSCORE methods.

 * Again, there is some bookkeeping code that you would do at the application level in terms of tracking how many players above or below to show and taking into account offsets.

 * The data that you store for a given player could be richer than just the player name or player ID. This is probably a larger design consideration if you are considering the "Around Me" leaderboard situation.

 {% gist 762065 %}

**UPDATE: 1/3/2011:** I updated the gist to do the "Around Me" leaderboard in 2 calls.

 You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).
