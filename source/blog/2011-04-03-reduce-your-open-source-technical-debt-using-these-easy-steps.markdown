---
title: Reduce Your Open Source Technical Debt Using These Easy Steps!
author: David Czarnecki
---
Do you know what all those GitHub projects you've got forked to your personal GitHub account are? [Technical debt](http://en.wikipedia.org/wiki/Technical_debt). Follow these easy steps to enjoy a debt-free open source lifestyle.

 1. Watch a project, don't fork it.

 Your GitHub news feed is your friend and you're already using a news aggregator right? Watching a project will ensure you're kept up-to-date on project happenings (commits, issues, pull requests, etc.) without having to fork the code.

 2. If you fork a project, contribute something back to the project.

 I did this awhile back with a project called soulmate. It got mention on Hacker News, I checked it out, saw there were no tests, over 300 watchers, and felt charitable. I forked the project and [contributed my updates to show an integration test and start and stop Redis automatically when running the tests](https://github.com/seatgeek/soulmate/commit/a596eb5b45738bfad5ec8228c8c2c53220aec12d).

 Once the project integrated my changes, I deleted my fork. Why? I was never going to do anything with soulmate, so why keep the fork around? If the project owner comes back to you and requests changes to your pull request, make them and move on. Delete your fork unless you're going to contribute more to the project. If you are going to contribute more to the project, follow step #3 below.

 3. If you fork a project, configure a remote branch to track upstream project changes.

 When you fork a project on GitHub, a remote branch for tracking is not automatically created for you. By doing this, you can stay in-sync with the main project's codebase.

 {% gist 900703 %}

I am proud to say that I am living a debt free lifestyle on my [GitHub account](https://github.com/czarneckid). The 3 forked projects I have up there now, all have open pull requests to their respective project's main codebase. Once those pull requests are accepted or rejected, I will delete my forks unless I am going to contribute more to the project.

You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).
