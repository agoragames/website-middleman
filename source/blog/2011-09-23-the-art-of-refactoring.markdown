---
title: The Art of Refactoring
author: Jason LaPorte
---
[GameBattles](http://gamebattles.majorleaguegaming.com/) is one of our most popular sites, with an active user base in the millions. While we've dealt with sites in that scale before, this particular case has been no walk in the park. While we're a Rails shop, the fact that the site is written in PHP actually has nothing to due with the difficulties we've encountered. The real problems are that the codebase is almost a decade old, has been developed by dozens of developers over that time, has grown organically with a clear roadmap defined only recently, and has almost never been refactored.

 So, at various intervals over the last year, I (and others) have been digging into the site and trying to clean up what we can. It seemed that the process of what weve been doing is interesting, but talking about it at any length has been something I've hesitated to do, as I don't like talking about something without quantifiable statistics. But, the fact of the matter is, programming is an art, not a science, and anyone who says different is selling something. And the real trick with refactoring is that it doesn't meet any immediate business goals: it's purpose is entirely human, as it entirely exists to make a clean and sane working environment. All of the tangible business gains (security, performance, developer velocity, etc.) are all secondary, and so unless your managers "get it," it can be a hard thing to argue for.

 In our case, it's no secret that GameBattles' stability was going downhill, and so we needed to do something. And the only way for us to be able to audit for problems was to make the codebase manageable.



 Let me give you a sense of where we started: the code was in [version control](http://en.wikipedia.org/wiki/Revision_control), but only in the technical sense of the word; in reality, [SVN](http://en.wikipedia.org/wiki/Apache_Subversion) was being used more as an excessively complicated [rsync](http://en.wikipedia.org/wiki/Rsync)—it was a means to transport code from one developer machine to many web servers. The repository was over two gigabytes in size, about a third of which was PHP code, and the remainder being static assets. (And this is in addition to static assets housed elsewhere, such as on our CDN.) There were at least four PHP frameworks and three CMSs. Some of the code was object-oriented PHP5, but plotting a class diagram would have required at least four dimensions. If you think you've seen spaghetti code, think again: walking into this mess was like walking into the alien hive.

 [ ![](/uploads/2011/09/ripley-nest.jpg "ripley-nest") ](/uploads/2011/09/ripley-nest.jpg)

 There is no magic in refactoring. When the scale is monumental, you should fully expect nothing other than a long, tedious trek. On any journey, though, you'll need a guide. Here are some of the rules of thumb that I've been going by:
-

Always, _always_ start with the low-hanging fruit. Your task is both difficult and boring. Don't make it any harder than it already has to be.

-

Similarly, start with broad strokes. Try to find where you'll experience the biggest gains first, and don't work on things with small returns until you're reasonably sure there's nothing bigger.

-

However, working on anything is better than working on nothing, so don't dither. Be decisive.

-

Make lists. I, personally, keep three: _alive_, _dead_, and _unsettled_, each referring to files in the codebase. Alive files are those known to be (at least partially) necessary to the core functionality of the site. Dead files are those known to be not referenced by anything alive. Unsettled files are those you just don't know enough about. Never fail to keep these lists up to date, even though you'll be changing them almost constantly. Yes, it's tedious, but it's necessary.

-

Use common sense. Trust your feelings. If something seems important, it probably is. If something seems useless, it probably is. If the files havn't been updated in over two years, they're very likely dead.

-

Sometimes you're lucky and you can nuke entire files. Sometimes you're not and you have to perform surgery on files to remove the parts that don't need to be there. Don't be afraid to dive in, but remember: don't get in over your head. If you need to make a lot of changes for a small gain, move on to somewhere else for now. You can always come back later.

-

If you're not on a UNIX system, get on one. Your best friends in this process are _ [find](http://en.wikipedia.org/wiki/Find_(Unix))_ and _ [grep](http://en.wikipedia.org/wiki/Grep)_, and I can't even imagine where you'd begin without them. Find is a tool that lets you scan for files on disk based off of a number of parameters—name, type, last updated time, etc. Grep, of course, lets you search the contents of files. You can chain them together, too: I have probably typed find . -type f -name '\*.php' | xargs grep 'search term' more times than I can count—that snippet will search all PHP files in (or below) the current directory and tell you which ones contain the search term. (You can also just use grep -R 'search term' .—which does nearly same thing—if you don't have a lot of binary files that will take up a lot of search time.) This is particularly handy for seeing if a class or database table is referenced somewhere.

-

In fact, the above is true pretty much universally. If you're not an expert with _find_ and _grep_, and how to use them together, become one. There are [many](http://linux.die.net/man/1/find) [good](http://find.unixpin.com/) [resources](http://linux.die.net/man/1/grep) on how to use them.

-

Looking at the database is a great heuristic for what's important and what's not. Recent versions of [MySQL](http://mysql.com/) (which is what we use for GameBattles' backend) actually have a lot of useful metadata hiding in the [information_schema.TABLES](http://dev.mysql.com/doc/refman/5.0/en/tables-table.html) table—things like how large a table is (both in rows, and bytes), when it was last written to, and so on. If you find tables that haven't been updated in a year, then they're probably not used, and any files that reference them probably aren't either. Additionally, if you find tables that are written to but never read from, they're dead. Delete the references and then delete the table.

-

Make backups of everything. Date them. Have a rollback plan _in writing_ for when you delete something a little overzealously, since your brain is going to be far too fried when you're in the thick of it to do anything other than follow instructions.

-

Once you've gotten rid of something, deploy it immediately. Not only will you find if you broke the world while what you did is still fresh in your mind, but it's also remarkably cathartic to put some closure on what you just accomplished. And you will need the positive reinforcement.

I cannot emphasize the human factor of the above notes enough. The entire point of refactoring is maintaining your sanity. Don't sacrifice it in the process.

 While the labor is toilsome, the rewards are unparalleled. GameBattles codebase is currently an eighty-megabyte [Git](http://en.wikipedia.org/wiki/Git_(software)) repository, less than four percent of the size of what we started with. The number of potential security holes has dropped like a rock. Our uptime has gone from less than two " [nines](http://en.wikipedia.org/wiki/Nines_(engineering))" to almost four, and is continuing to improve. Our developers are moving faster than ever. Our users are happier. And, most importantly, I havn't lost my mind. (Yet.)
