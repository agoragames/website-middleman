---
title: Follow The Leader - Leaderboards with Ruby/Redis
author: David Czarnecki1
---
Leaderboard: A board showing the ranking of leaders in a competition.

 Do you need to create leaderboards for your application? Do you use [Redis](http://redis.io/)? Do you use [Ruby](http://www.ruby-lang.org/en/)? If you've answered yes to any or all of these questions, you might want to take a look at the [leaderboard gem](https://github.com/agoragames/leaderboard) I am releasing today.

 At Agora Games, one of the things we think a lot about is leaderboards. As they're a small, but important part of the work we do, I’m looking for ways to improve leaderboard generation for various situations. This effort was really the logical next step to my blog post, [Creating high score tables (leaderboards) using Redis](http://blog.agoragames.com/2011/01/01/creating-high-score-tables-leaderboards-using-redis/). All of the information you'd probably be interested in as a developer in terms of working with the gem can be found on the [leaderboard gem](https://github.com/agoragames/leaderboard) page. Here's a quick rundown of some of the gem's capabilities:

 * Attach to a new or existing leaderboard

 * Add and remove members from a leaderboard

 * Return information about a leaderboard such as total members, total pages

 * Return information about a member in the leaderboard such as their rank or score

 * Update score information about a member in the leaderboard

 * Retrieve the leaders from a leaderboard with ability to page within the leaderboard

 * Retrieve the leaders around a given member in a leaderboard, also known as an "Around Me" leaderboard

 * Retrieve information for an arbitrary list of members in a leaderboard, e.g. How do my friends compare against me?

I believe that this covers most of the interaction you might have with a leaderboard. But, if not, this code is open source, so feel free to contribute to its development.

You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).
