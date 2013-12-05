---
title: Watching Trees
author: Jason LaPorte
---
As a SysAdmin, my job more-or-less exists by knowing miscellaneous arcana that most software engineers aren't aware of.

 When a particular co-worker here at Agora has a problem with his Linux machine, I provide advice and show him how to fix it. Some months after he had joined Agora, I discovered that after each troubleshooting session, he copy-and-pastes the entire text terminal log into a text file that he keeps on his desktop. He has dozens of transcripts at this point; I bet if I were to look through it, it would read something like the Tao te Ching or Bhagavad Gita, only concerning UNIX instead of right living.

 (Of course, there's not much of a difference between UNIX and right living, but that's a topic for another day.)

 In the spirit of allowing you to build your own little collection, here is a simple trick that came in handy to me yesterday.

 Last night, the cron jobs powering one of our managed sites stopped running. I had stopped them, cleaned up, and restarted them, but I wanted to watch the system and see if they had started running again so I could monitor that they were doing their job.

 UNIX has a well-known command called " [top](http://linux.die.net/man/1/top)," which shows superlative processes running on your system: which ones are consuming the most CPU time, which ones are consuming the most RAM, which ones have been running the longest, and so on. It's a very useful tool, but if you're trying to track down processes over time that don't necessarily consume very many resources, then it's not the tool you're looking for.

 However, our Linux distribution (and, indeed, most others) provide a useful graphical tool for mapping the current state of the system: " [pstree](http://linux.die.net/man/1/pstree)." This command will give you a list of processes (much like the " [ps](http://linux.die.net/man/1/ps)" command), except that instead of generating a list, it will draw a little tree showing the state of the system. This is perfect for seeing exactly what is going on: which daemons are running, who is on the system and what they're executing, and so on. However, it doesn't show you what is happening over time; it merely lists what is happening at this moment.

 However, our Linux distribution (and, indeed, most others) provides yet another useful tool: " [watch](http://linux.die.net/man/1/watch)." It runs a program every 2 seconds (by default) and displays the result to your screen. This allows you to make a ghetto clock by writing something like "watch [date](http://linux.die.net/man/1/date);" in our case, we could make a ghetto graphical "top" by writing the simple "watch pstree." You can now watch your virtual trees rustle in the wind.

 It kept us on top of the cron job, and things were back to normal in no time.

 For more information, RTFM. :)
