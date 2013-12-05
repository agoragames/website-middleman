---
title: Legacy Code Stink
author: Eric Torrey
---
Applications go through various stages of development.  The shining moments for an application are usually in the early stages.  There isn't much complexity, there is plenty of time left until 'launch day', and developers are usually relaxed when coding.  Eventually every application suffers from poor feature requests, bad design, and rushed code.  The beautiful grassy plain of peace your application used to be is turned into a bustling city.



 Boston is a city in Massachusetts that was founded a whole buncha years ago.  Back in the day, the guys pushing wagons around, and mules laden with baggage didn't care about paths that they plodded into the ground.  All they cared about was getting their goods to where ever they needed to be.  If there was a ginormous rock in the way, they could just path around it.  After a while, cars started getting pretty cool.  Cars need roads, so all the roads were built right on top of those paths.

 [ ![](/uploads/2008/11/boston.jpg) ](/uploads/2008/11/boston.jpg)

 At that time, it was easier to just build a road on top of the path.  No one knew the windy mess of wagon-path converted roads would cause tons of lost tourists and traffic accidents today.  It might have been better to just nuke the ginormous rock out of the way, and make the road straight.  Unfortunately, that ginormous rock is some type of historical monument now, so it's not possible anymore.

 Anything is possible in software (with limit to it's own scope), the only constraint is time.  Time is the key element here, it's something you can't get back.  Every decision that is made in software has an effect on how long something else will take.  Every second saved by hacking around something today, is going to cost you two seconds tomorrow.

 "Tomorrow is so far away though, and I need this to work now."  When the pressure is on, and time is short, this is a common approach to decision making.  It's in these essential minutes during an applications life span, that hacks start to leak into every crevice.  To make things worse, instead of refactoring the hacks out, time is spent building more new features.  Eventually those crevices become a major fault line, and it causes changes to the code base to take three times as long.  By this time, new developers have no chance of contributing, and the existing developers hate working on the application because everything they do causes an earthquake.

 A major problem with software development is the existing solution.

 Things change, standards form, upgrades happen.  The best idea you ever had yesterday, can probably be done better today.  Don't let your legacy code stink take over, get rid of it, refactor it, and upgrade it.  There is always a better way to approach a problem in software and in most every case the quickest solution is the worst solution.
