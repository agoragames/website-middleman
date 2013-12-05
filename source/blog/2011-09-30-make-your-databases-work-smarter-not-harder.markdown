---
title: Make Your Databases Work Smarter, Not Harder
author: Jason LaPorte
---
When optimizing code, you [profile](http://en.wikipedia.org/wiki/Profiling_(computer_programming)) it, find out where it's spending most of it's time, and figure out how to make it spend less time there. As a sysadmin, I tend to wear a lot of hats, but the one I wear the most by far is the [DBA](http://en.wikipedia.org/wiki/Database_administrator) hat--I spend far more time hacking on [MySQL](http://www.mysql.com/) optimizations than any particular other thing I do. So, in order to make myself more efficient, if I can find a way to streamline the time I spend with MySQL, I can reap the biggest benefits.

 It turns out doing so isn't so hard. Here are some tricks I've learned.



 Now, the reason I spend so much time with MySQL is that it's a prime cause for bottlenecks in our applications. Those bottlenecks tend to fall into three categories:

1. The queries cause tables to lock, halting further queries until the first completes.

2. The queries are improperly indexed, requiring queries to examine or sort the entire table when they don't have to.

3. The queries act on more data than the system can adequately manage at once.

There are different solutions to each of the above problems. I'll walk through a few of them, but before I do, let me start with the lowest-hanging fruit that is common to all three: [upgrade to the latest version of MySQL](http://dev.mysql.com/doc/refman/5.5/en/upgrading.html), and then upgrade to [Percona Server](http://www.percona.com/software/percona-server/). Percona Server is a drop-in replacement for MySQL than has [tighter optimization](http://www.percona.com/software/percona-server/benchmarks/) and better monitoring features. And when I say drop-in replacement, I really mean _drop-in replacement_: installing it is literally trivial. We've done so on both Ubuntu 10.04 Server and RHEL 5, and the process in both cases was backup your data (just in case), remove the MySQL Server package, and then install the Percona Server package. That's it. All of your client libraries will continue to work, you can still use handy performance tools like [MySQL Tuner](https://github.com/rackerhacker/MySQLTuner-perl) and [MyTop](http://jeremy.zawodny.com/mysql/mytop/), you can even continue replicating to your non-Percona slaves (which you should also upgrade, of course). It grants you instant benefits for virtually no investment.

 After that, we can't know what process to take to optimize a query without knowing what queries need to be optimized. We at Agora use several tools for tracking them down. The main tools we use are:

1. [Munin](http://munin-monitoring.org/), which is trending software: it tracks statistics over time and plots them onto a graph. While we're not 100% happy with Munin, it's issues are easy enough to work around (should you be at the scale that requires working around them), and there's nothing simpler for getting up and running quickly. This can query MySQL's statistics counters and plot them, so you can see all manner of data on how your server is behaving: from memory usage, to breakdowns of query types, to number of slow queries, to disk access patterns, and so on.

2. The [MySQL slow query log](http://dev.mysql.com/doc/refman/5.5/en/slow-query-log.html), which simply logs any queries that took longer to execute than some (easily configured) threshold.

3. The [EXPLAIN SELECT](http://dev.mysql.com/doc/refman/5.5/en/explain.html) query will identify how MySQL interprets a given query, allowing you to identify how expensive your queries are, and how well-utilized your indices are. (EXPLAIN is very powerful, but also confusing. I recommend looking it up on Google. [Here](http://weevilgenius.net/2010/09/mysql-explain-reference/) is an explanation in further detail.)

4. The [MySQL SHOW PROCESSLIST](http://dev.mysql.com/doc/refman/5.5/en/show-processlist.html) query, which can help identify locking queries while they're running. One notable benefit of Percona is that it is much better about showing the current state of a query, and how many rows are being acted upon, than MySQL, which makes it easier to track down what the problematic part of a query is.

5. MySQL Tuner is a little Perl script that helps identify common causes on a MySQL Server by running [SHOW VARIABLES](http://dev.mysql.com/doc/refman/5.5/en/show-variables.html) and comparing the output to several heuristics. While this isn't as useful when you have a lot of experience tuning MySQL's variables, it's enormously useful if you havn't.

Our usual process is to identify when we hit performance issues with Munin, check the slow query log at those times to identify problem queries, and then use EXPLAIN, SHOW PROCESSLIST, and MySQL Tuner (and/or looking directly at SHOW VARIABLES, if you know what you're doing) to help identify _why_ the queries are problematic.

 While I'd love to break down every possible symptom I've seen and how it can be fixed, that could easily fill a book. (And, in fact, a quick search on Amazon reveals that it already does.) So, you're just going to have to use your intuition (and Google) to track it down yourself. The most important quality is having an inquisitive nature. If you see that something's wrong, instead of looking for a magic word that fixes it, try to understand what's going on _behind_ the visible symptoms, or try to understand _why_ the magic word works.

 Let me walk through common solutions to the three above types of problems to get you started.

 Let's suppose that you're finding, via SHOW PROCESSLIST, that a number of processes are piling up due to a locked query. What would you do to fix that? I would first start by looking at the table's engine (most easily seen by [SHOW CREATE TABLE](http://dev.mysql.com/doc/refman/5.5/en/show-create-table.html)). If the table is [MyISAM](http://dev.mysql.com/doc/refman/5.5/en/myisam-storage-engine.html), try converting it to [InnoDB](http://dev.mysql.com/doc/refman/5.5/en/innodb-storage-engine.html). InnoDB has a lot more overhead, but in exchange it never locks a whole table at once; so while individual queries will require more time, they won't preclude other queries from running. Let's suppose that your tables are already InnoDB, or that for some reason they can't be (for example, you're relying on [FULLTEXT](http://dev.mysql.com/doc/refman/5.5/en/fulltext-search.html) indices, which InnoDB does not support). The next thing I'd check is to ensure your various [server tuning variables](http://dev.mysql.com/doc/refman/5.5/en/server-parameters.html) are adequately sized. This is a very complex topic with lots of things to fiddle with, but I recommend running MySQL Tuner as a starting point. Common problems are setting the MyISAM key buffer or the InnoDB buffer pool too small, causing your database to swap. If you've already checked that, then your problem may be the efficiency of your indices.

 You can identify how your indices are being used by running EXPLAIN to see how the query is being executed. If it's doing a full table scan, creating a temporary table, or performing a filesort, you should either create a new index or restructure the query. Additionally, be aware that indices add overhead: whenever the table is modified, each index needs to be updated as well. Oftentimes the overhead in doing so can cause locks, especially on expensive indices (such as indices on a large number of columns, on large text columns, or any FULLTEXT indices). You may need to evaluate how the table is being accessed and remove any unnecessary indices, so there's less overhead needed. For example, we had a number of FULLTEXT indices on Gamebattles that were causing a large number of table locks in order to keep them updated. We ended up moving to [Sphinx](http://sphinxsearch.com/) for FULLTEXT indexing and removing the indices in MySQL.

 Finally, the greatest bane of MySQL is hitting disk. If you ever have to swap memory to disk ever, then your database performance will drop like a rock. If Munin or MySQL Tuner indicate that your disk usage is too high, look at increasing your buffer sizes. If you've maxed your system's physical RAM, then you should buy more. If you have adequate RAM but your disks are still too slow, buy faster disks. When in doubt, [spring for SSDs](http://www.livestream.com/oreillyconfs/video?clipId=pla_3beec3a2-54f5-4a19-8aaf-35a839b6ecaa).

 While this is a pretty quick overview of how to approach debugging inefficiencies in your databases, I hope that you'll find it helpful. If you're interested in more detailed reviews of any particular point (as there's an almost bottomless amount of practical wisdom to be acquired when dealing with MySQL), feel free to let me know via the comments.
