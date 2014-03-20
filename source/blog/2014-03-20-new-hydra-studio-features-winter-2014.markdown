---
title: New Hydra Studio Features
author: Sam Toews
---

![](http://i821.photobucket.com/albums/zz136/agoragames/Hydra_zpse71a8af5.jpg)

It has been a few months since our last Hydra Studio Features post. This is in part because the Hydra Studio Team has been hard at work developing a lot of new features, all of which are available to our users now! 
 
Below is an overview of the new features that have been released. Please take a moment to review, and then head to the Hydra Studio dashboard and give everything a test run. Make sure to share your thoughts on the [Beta Support Forum](http://support.agoragames.com/) as your feedback is extremely valuable.

---

#### **Username/Password Auth** ####

One of our major enhancements was the expansion of our Authentication System. Made available late fall, Hydra Studio now supports a variety of authentication schemes to fit your game's needs. 

* **UUID** - Given a unique identifier, Hydra will map it to a game account
* **Facebook** - Given a valid Facebook auth token, Hydra will map it to a game account
* **Anonymous** - A one time, pass-through, scheme which will return a valid auth token for a new account every time it is used
* **Hydra** -  A username/password account per the environment of your API key
* **Windows Live** - Given a valid Windows Live auth token, Hydra will map it to a game account
* **Google** - Given a valid Google auth token, Hydra will map it to a game account
* **Steam** - Given a valid, hex encoded, encrypted app ticket for a user of your Steam game, Hydra will map it to a game account
* **Custom** - Tells Hydra to use an existing authentication system. Given a token that is accepted by your custom authentication url, Hydra will map it to a game account. If a game account does not exist for this token, Hydra will crete a new game account and associate it with the account in your system. 
 
Additionally, we now provide a way for user to recover an account in case they cannot access it by any other authentication method. However, this requires an email being set on their account. If there is no email set, their account cannot be recovered. 

Technical notes may be found in the [Authentication Documentation page](https://hydra.agoragames.com/documentation/authentication.html). 

---

#### **Realtime Networking** ####

Early February, we deployed a number of important infrastructure improvements to Hydra Studio. These enhancements included an update to a new Realtime protocol. Our platform now provides the following:

* Added support for UDP realtime connection - full reliable/unreliable support
* Added support for multiple realtime connections for the same account
* Realtime Connected and Disconnected events now pass the protocol of the underlying connection that was connected or disconnected

More detailed information may be found in the [Realtime Networking Documentation page](https://hydra.agoragames.com/documentation/realtime.html).

---

#### **REST API** ####

We recently added REST API documentation to our Hydra Studio [Game Integration Docs](https://hydra.agoragames.com/documentation/). The Guide provides a general overview of the Hydra REST API, a Getting Started section for those beginning the process, and a [REST Endpoint Reference](https://hydra.agoragames.com/documentation/rest/reference.html). 

For an example of how Hydra REST API may be used, visit our [Demo site](http://hydra-rest-api-demo.herokuapp.com/). 

---

#### **AgoraSaurus** ####

![](http://i821.photobucket.com/albums/zz136/agoragames/ScreenShot2014-03-16at60626PM_zps4a8fe404.png)

Meet AgoraSaurus, the official mascot of Agora Games, now starring in his very own continuous run mobile game. Available for download on [Google Play](https://play.google.com/store/apps/details?id=com.agoragames.agorasaurus), AgoraSaurus is an in-house developed, sample application of a Hydra Studio integrated game.

In-game features include:

* User account creation and login
* Top 10 global leaderboard
* Achievement listing and live pop-up notification

Coming soon, we will be adding player-vs-player challenges, an iOS app, and providing source code. 

---

#### **Everything Else** ####

In addition to the top level features above, we released a number of smaller updates during the last few months.

* **Matchmaking service** - Added ability to cancel pending matchmaking requests, cancel events
* **Achievements** - Added methods to load progress for one achievement
* **Matches service** - Added match expiration warning
* **Notifications** - Broadcast messaging over push notifications
* **Better error reporting**

---

#### **Still To Come** ####

Here is a list of the features that are currently under development, or will be in the near future, and that you will be able to get your hands on soon.

* **Cloud/Title Storage** - Provides secured access to stored user content
* **Clans** - Allows for multiple players to be voluntarily grouped together for social and competitive online experiences
* **Xbox One & PS4 Support** - C++ SDK support for next-gen consoles
* **User-Generated Content** - Provides secure, cross-device storage of player information, content, game saves and other data

Those who want to stay informed of the very latest developments are encouraged to follow our [Hydra Studio Announcements Forum](http://support.agoragames.com/discussions) and the [Agora Games Blog](http://www.agoragames.com/blog/).

If you have questions, comments, or suggestions, please post them in our [Beta Support Forum](http://support.agoragames.com/discussions/hydra-mobile-closed-beta-general-discussion), and continue to put our platform to the test. Thanks a ton!

**- The Hydra Team**
