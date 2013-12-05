---
title: 'How to do Open Source: A Case Study in 1 Issue and 6 Pull Requests'
author: David Czarnecki
---
I wanted to highlight a recent set of contributions from [Simon Zimmerman](https://github.com/simonz05) to our [leaderboard-python](https://github.com/agoragames/leaderboard-python) that, in my opinion, reflect how to effectively participate in open source projects. The pull requests are as follows:

1. [StrictRedis not considered when passing connection argument to Leaderboard](https://github.com/agoragames/leaderboard-python/issues/4)
2. [don't deepcopy options](https://github.com/agoragames/leaderboard-python/pull/5) (branch: performance)
3. [ASC sorted page_for was broken due to a spelling error](https://github.com/agoragames/leaderboard-python/pull/6) (branch: page_for-fix)
4. [leaders() should return an empty list in case of an empty result set.](https://github.com/agoragames/leaderboard-python/pull/7) (branch: leaders-return-type)
5. [remove unused calculation in leaders_in method.](https://github.com/agoragames/leaderboard-python/pull/8) (branch: unused-calculation)
6. [proposal: consider using named key word arguments instead of \*\*options](https://github.com/agoragames/leaderboard-python/pull/9) (branch: options)
7. [add members_only option.](https://github.com/agoragames/leaderboard-python/pull/10) (branch: members_only-option)

Aside from the first issue, which is a very clear and concise explanation of where an underlying and undocumented check in the library could trip up potential users of the library, all of the pull requests follow the same pattern:

- Meaningful title
- Separate branch with a meaningful branch name per pull request
- Small, focused and tested pull request that could be evaluated independently
- Clearly identify a proposal pull request before embarking on code changes that may go against the convention or direction of the project

How does all of this help me as a library maintainer? Well, meaningful titles in a pull request or issue help me to mentally narrow down the extent of the change(s) or the code I might be looking at without having to actually look at the code. To quote George Costanza from Seinfeld, "I like stuff you don't have to think about too much." Meaningful titles go a long way to making that happen. Separate branches are nice because I can evaluate the change(s) in the code independently of other feature changes. It also indicates that the contributor took the time to actually read the "contributing to this project" section in the README. None of the pull requests were more than a few lines of code and the ones that added or changed functionality included tests. That always helps since I'm more likely to integrate a pull request immediately if I can pull the feature branch, run the tests and know that the library won't break in strange and unusual ways. And finally, it's nice to propose larger feature changes that may affect the entire library in a small spike and to gauge interest from the library maintainer(s). It saves everyone a lot of time if it's functionality that isn't desired given conventions or direction of the project.
