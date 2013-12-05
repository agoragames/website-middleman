---
title: New Hydra Beta Features - April &amp; May 2013
author: Elliott Haase
---
[ ![](https://s3.amazonaws.com/uploads.hipchat.com/9155/22229/sna33ycdymz2l2a/header.png) ](https://s3.amazonaws.com/uploads.hipchat.com/9155/22229/sna33ycdymz2l2a/header.png)

April was another busy month for the Hydra team and the Hydra closed beta. We accomplished another set of significant milestones that moves us even closer to launching the Hydra closed beta to the public later this year.

 Below is an overview of the new features we released during April and the first week of May. Take a quick read, and then head to the Hydra dashboard and give everything a test run. Make sure you let us know your thoughts on the [Beta Support Forum](http://support.agoragames.com/discussions/hydra-mobile-closed-beta-general-discussion) as your feedback is extremely valuable.
## User Account Enhancements

[ ![](https://s3.amazonaws.com/uploads.hipchat.com/9155/22229/e6tg6nsptproj53/user%20account%20enhancements.png) ](https://s3.amazonaws.com/uploads.hipchat.com/9155/22229/e6tg6nsptproj53/user%20account%20enhancements.png)

One of our largest enhancements this month was specific to our user account system. We officially moved from a purely global user account system to an environment specific user account system with our maintenance on May 8th. We made these changes based on beta user feedback, alongside a list of user account enhancements that we felt necessary to deploy after having the Hydra closed beta running for a few months now.

 We expect to have development teams of all kinds using Hydra, and we feel its more important to provide developer tools to easily control the user accounts created by their titles, instead of having a purely global Hydra account system that requires all developers to fall in line with one specific setup. These changes help us achieve that.

 To read a full overview of the changes and to better understand our thought process, please read our official [ announcement post](http://support.agoragames.com/discussions/hydra-mobile-announcements-forum/36-58-hydra-beta-global-account-changes-1000am-et-please-read).
## Dashboard Analytics

[ ![](https://s3.amazonaws.com/uploads.hipchat.com/9155/22229/myhmvdvtdzn372b/dashboard%20analytics.png) ](https://s3.amazonaws.com/uploads.hipchat.com/9155/22229/myhmvdvtdzn372b/dashboard%20analytics.png)

The 1st iteration of project analytics was released to the Hydra closed beta dashboard in April. The goal of our 1st iteration was to provide tracking of the most essential project statistics (active users, profile activity, match activity, and other basic feature activity). While these features are still running through basic QA currently, we have laid the foundation and you can begin working with these analytics now.

 We have enabled a basic view of per-project-environment analytics that you can access via the "Statistics" link when working within any of your project environments. Additionally, from the statistics page you can select specific stats that you want visible on your environment dashboard (allowing for quick and easy viewing of those stats you view most important for your project).

 Active user stats play a significant role in our Hydra pricing plans. On your main Hydra dashboard page we've also added active user stats so you can easily view the current usage numbers for all of your projects.

 We have a lot more to add to our analytics offering, so please make sure you let us know your thoughts on what's most important to you!
## Data Export

[ ![](https://s3.amazonaws.com/uploads.hipchat.com/9155/22229/wv0jot5rkfdo86q/exports.png) ](https://s3.amazonaws.com/uploads.hipchat.com/9155/22229/wv0jot5rkfdo86q/exports.png)

Early in April we released data export functionality to the Hydra closed beta dashboard. You can now export all of your Hydra data to an Amazon S3 account. All you need to do is provide your AWS access key and a secret key (that allows Hydra to create and populate new Buckets) and we take care of the rest. You can create an export once every 24 hours, and you can see the status of your most recent export right on the Hydra closed beta dashboard.
## Everything else
In addition to the top level features above, we released a number of additional updates that we've detailed below:

 **1. Facebook User Account Login** - The hard work here is done, as we have fully integrated our user account system with the available Facebook API. We haven't officially released it to our beta users yet as we are closing up QA and SDK updates right now. We'll be working to make this functionality available as soon as we can.

 **2. Automatic Leaderboard & Achievement rebuilds** - Easily add in new leaderboards and achievements as far after your project launch as you want. When you create a new leaderboard or achievement after your project has launched (and you already have a number of users with existing profile stats), Hydra will automatically rebuild and populate those leaderboards and achievements with existing user profile data for you.

 **3. Pricing/Payment Processing** - We've completed the 1st iteration of our payment processing functionality which directly ties into our [Hydra pricing plans](https://hydra.agoragames.com/pricing). We're using [Stripe](https://stripe.com/) for payment processing integration, and when we launch the Hydra beta to the public later this year you'll be able to manage your per-project pricing plans right on the dashboard. It's our goal to keep payment processing as simple and straightforward as possible.

 **4. Improved "Getting Started" Guide** - We've greatly improved the basic user workflow for all new beta users signing onto the Hydra dashboard for the first time. When new users sign on they'll quickly create their first project, and then walk-through the most essential steps to get Hydra up and running (with the dashboard providing information and tips along the way).
## Still to come
Here is a list of the features that are currently under development, and that you'll be able to get your hands on soon:

 **Hydra C++ SDK**

 **Environment cloning functionality**

 **Friends - **Facebook friend import

 **Chat/Presence - **First iteration of match/lobby chat functionality



 Feel free to post questions on any of these features in our [Beta Support Forum](http://support.agoragames.com/discussions/hydra-mobile-closed-beta-general-discussion), and continue to put our platform to the test. Thanks a ton!
## - The Hydra Team
