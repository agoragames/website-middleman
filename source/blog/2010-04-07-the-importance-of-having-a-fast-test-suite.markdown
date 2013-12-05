---
title: The Importance of Having a (Fast) Test Suite
author: David Czarnecki
---
Speed is the name of the game. Or is it?

 I was adding another project to our Continuous Integration (CI) server that runs the test suite for a project after code is checked in and started noticing the time it takes to build certain projects. A few interesting statistics for you to noodle on.

 Average build time: ~32 seconds

 Max build time: 1 hour and 48 minutes

 There are approximately 18 projects that get built through CI and many other projects that have not been setup for CI.

 What does this tell us? Testing is not an impediment to development because it takes too long to run tests. As most test suites run in less than a minute, not running the test suite is not an option for our developers. And if you don't, CI sends an e-mail to the team letting everyone know you broke the build. And since our post-commit hooks for SVN and git notify our Campfire room each time code is committed, chances are you're going to get an earful in Campfire telling you to fix the build because your last commit broke the build.

 ![chet_weird_science](/uploads/2010/04/Picture-17.png "chet_weird_science")

 I'm glad nearly all of our projects have test suites that run quickly, but I also have a practical view on test suites. **Above all, if nothing else, I want a test suite to exist.** I want it to be there so that when I'm adding code to the repository, the test suite is looking at me asking for more.

 ![More tests please!](/uploads/2010/04/Picture-16.png "More tests please!")

 About that project that takes 1 hour and 48 minutes to build? Right. Guitar Hero. It's a BIG project. It's over 3 years old. There is a LOT of code. We test A LOT of systems, e.g. accounts, clans, tournaments, leaderboards, game configurations, game integration processing, etc. I'm OK with it taking that long to run the test suite. We have development practices that we follow for running sub-sections of the test suite when we touch the application to test our new code.

 To summarize:

- Ensure your projects have a test suite
- Run a Continuous Integration (CI) server for your projects for when developers forget to run the test suite before committing code
- Ensure your projects have a test suite
- Ensure your projects have a test suite
- Ensure your projects have a test suite
- Make sure developers know how to run part of the test suite for long-running test suites
- Ensure your projects have a test suite
