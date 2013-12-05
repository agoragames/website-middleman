---
title: 'Hydra Services Series: Profiles'
author: Mike Jodon
---
Have you ever thought to yourself "Self, I wish there was a way for me to read about each service that Agora Games was working on so, I could get a better idea of cool ways to integrate Hydra into MY game". Well wish no more. Over the next couple of weeks, I'll be putting up posts which outline each individual service that is offered under our Hydra product.

 "But [Mike Jodon](https://twitter.com/MikeJodon), I'm a mobile developer, what can I have to read?" Fear not. All of the services that I cover in this series will be, or currently are, being developed for release in our mobile SDKs! So iOS, Android, Unity mobile, you will all eventually have these great tools too! Check out hydra.agoragames.com if you want more information about Hydra mobile, or to sign up for the beta program!

 Let's get started!

 **Profile Service:**

 The profile service is the most key feature that a game can have for its users. Users love to see their stats for a game that they are playing. They love seeing how they match up against other players, and they love being able to have other players in that game see how good they are doing. A lot of what makes gaming fun (whether it's casual or hardcore), is the element of competition. Whether you're playing Mortal Kombat, Call of Duty, or Farmville, you want your stats to be better than everyone else playing that game.

 So what is a profile? How have other clients used the service before, and what else can you do with the service? All of these are answered in this post.

 The profile service stores lifetime stats for each user who is online while playing your game. This is where all player specific data will be stored. If your game tracks a stat and stores it within the Hydra profile service, then Hydra can empower you to make other awesome features happen (based on that important profile data). The Profile service helps power a lot of other awesome features, which will also be described below.

 So what's usually stored in the Profile for a user? Well that depends what your game is sending, but typically there are some things that we see from almost all titles using Hydra:

- Basic player identifiers, such as their XBL, PSN, Steam name, GFWL name or whatever platform you're using. You'll also find the player name and platform account id if the platform supports that
- Lifetime profile stats, like kills, time played, XP, level/rank, or literally ANY OTHER stat you have in your game
- Load out information, which is something that is specified by the game. Some games have special load outs like "commando" or "ace pilot" or if you're making a racing game, it could save that car load out the player is using.

 

 Again, if it's in your game and it's being sent to hydra, it'll be in that specific player's profile for use by your team. Everything depends on what you game is sending. There's almost limitless possibilities to what the Profile service can do.

  
* * *
 

 "Hey Mike, this is all good stuff. What other services can the profile service help power?" Great question! Let's take a look below.

 Data from the profile service can be user to power, or help power, the following services, depending on your game structure and data setups:
- Feed Service
- Challenge Service
- Leaderboards
- Statistics Service
- Notifications Service
- Clan Services
- Tournament Service
- User Generated Content
- Global Feed Service
- Inventory Service

Each one of these services will get a write up similar to this one, which will explain exactly what they are and how they've been used in the past. Stay tuned for that!

 "Can you give some awesome examples of how the profile service was used in previous titles?" Great question! I'm going to show you a bunch of examples now! Again, EVERYTHING I'm about to show you was built using the Hydra Profile service.

  
* * *
**Saints Row: The Third - Released for XBOX360, PS3 and PC**
Saints Row's sandbox style gameplay made it a perfect fit for Hydra integration. Having a game where you could literally play forever and rack up stats, made the profile service a great feature for the community. While playing, you're always getting money, always racking up kills, and always doing something insane. The Profile service here was used to track both single player and multi-player stats. 

[ ![](/uploads/2012/11/Screen-Shot-2012-11-06-at-2.39.47-PM2-300x257.png) ](/uploads/2012/11/Screen-Shot-2012-11-06-at-2.39.47-PM2.png) Saints Row really blew out their profiles on the community website. If there was a stat that a user wanted to see, it was more than likely on their profile. Users were even able to compare their stats to anyone else that was linked to the website, which is a feature that most users want today.

 Saints Row also made it so you knew where you stacked up against the rest of the community. They let you know the community average, and which percentile you are in for each stat in the Game Performance center.

**Mortal Kombat - Released for XBOX360 and PS3**
 You can't call yourself a gamer if you haven't played Mortal Kombat. Everyone remembers the first arcade machines showing up in their local arcades and video rental stores. In 2011, the latest version of this timeless franchise  was released to the masses with much acclaim. With so many fighters in game, and more released on DLC, it was an honor to have this title's stats being powered by Hydra. 

[ ![](/uploads/2012/11/Screen-Shot-2012-11-12-at-2.23.38-PM1-300x272.png) ](/uploads/2012/11/Screen-Shot-2012-11-12-at-2.23.38-PM1.png)Mortal Kombat used the profile service to achieve a really granular type of profile for its users. There where stats based on a player's over-all career in the game, as well as stats to show a user's "best" at some key stats.

 One of the more granular uses of the stats was to show wins by each character that you as a player have used. They then took that and broke it out by 1 on 1, 2 on 2, and co-op matches. I don't think I've seen this done with any other fighting game's stats, so it was nice to see something so new and detailed.
As you can see, the Profile Service has powered some of the largest titles and franchises in gaming history. If you want to check out some of the other titles we've worked with, check it [our portfolio here](http://www.agoragames.com/portfolio/).  If we can help these games be successes, just imagine what we can do for you! If you're interested in using Hydra, [go here and leave us your email](http://hydra.agoragames.com/) and we'll contact you!
