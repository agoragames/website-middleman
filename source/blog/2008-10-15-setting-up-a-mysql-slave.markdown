---
title: Setting up a MySQL Slave
author: Jason LaPorte
---
Sometimes, things go wrong.

 Sometimes, things go horribly, horribly wrong, and there's nothing you can do to stop the slow-motion train wreck unfolding before your very eyes. (Like that one senior prom where you spilled your dinner all over your date's dress. On the upside, you didn't need that $200 anyway.) When things go that awry, there's no way to fix it. (She never did return your phone calls, did she?) The only thing you can do with a mistake like that is to make sure it never, ever happens again.



 For most of the sites we produce, we use MySQL as a backend. While it's extremely rare for the MySQL server to catastrophically fail, it happens, and the more MySQL servers you have, the more likely it is to happen at least once. To keep this from causing problems for us, we replicate our databases (that is, maintain a live copy of them). This provides us with two benefits:

1. If the MySQL master (primary database) blows up, melts down, or gets eaten by vermin, we can "promote" the slave database (the clone) to fulfill the master's role while we figure out what happened and how to fix it, keeping the site up and preventing any data from being lost.
2. Since the MySQL slave isn't used for anything other than covering our backsides, we can take it offline periodically to archive all the data in the database without impacting anything. (This is important when your site has literally four million users pouring statistics into it all day, every day, and doing a live backup **will** slow things down.) Archives are good in case you want to do statistical analysis on your data or in case you accidentally delete everything in the database after working a twelve hour day trying to figure out how vermin ate your master database. (Both of these have happened before. Sort of.)

So, let me walk you through setting up a database slave from scratch.

 I am starting with two identical machines that are running identical instances of MySQL. The first of these, Dragon, is going to be the master. The second of these, Unicorn, is going to be the slave. (So I name my servers after mythical beasts. What's wrong with that?) I am assuming a reasonable level of knowledge with the UNIX shell. If you lack familiarity, you really should spend some time learning. It will make you a better programmer, system administrator, friend, spouse, and human being.

 **1.** First, you should have the following items set in your MySQL configuration (/etc/mysql/my.cnf). If you don't, add them: they can go anywhere under the [mysqld] heading.

```bash
 server-id = 1
 log-bin = /var/lib/mysql/binlog/mysql-bin
 expire_logs_days = 1
 max_binlog_size = 100M
 relay_log = /var/lib/mysql/binlog/mysqld-relay-bin
 relay_log_index = /var/lib/mysql/binlog/mysqld-relay-bin.index
```

 The server-id should be some unique number, not shared with any other machine on your network. Replication occurs by copying around binary log files; you should set expire_logs_days so that you don't end up with a huge pileup of data clogging up your disk drives (as they will eventually eat up your hard disk). We set binary logs to expire after 1 day, since our disks have a tendency to fill up on us quickly (for example, one of our Guitar Hero master databases has a 6GB binary log directory, even though it expires data after a single day!) Be advised that if you are worried about your slaves falling more than a day behind, you should keep logs around for a greater duration. (However, from our experience, if your slaves fall more than a day behind, you have bigger problems.) Finally, you can put datadir, relay\_log, and relay\_log\_index wherever you please; above are just where we use. (Make sure, however, that they exist and are writable by the mysql user!)

 You should restart the server after changing the settings. On Debian and Ubuntu, you can do this via "/etc/init.d/mysql restart".

 **2.** Your slave should have the same options defined as above in its MySQL configuration. The server-id option, however, **must** be different from the master (in our case, setting it to "2" will do). All the other options can be whatever you please.

 Also restart this server when it's set as you like.

 **3.** You should grant permission for the slave to read data from the master. This can be done from the MySQL console on the master (mysql -h dragon -u root). Assuming the user name "foo" and the password "bar":

```bash
 mysql> GRANT REPLICATION SLAVE ON \*.\* TO 'foo'@'unicorn' IDENTIFIED BY 'bar';
```

 You can, of course, restrict which databases and tables you grant permissions with. We don't in this particular case.

 **4.** You now need to dump all of the data on the master, copy it over to the slave, and import it there; this is necessary even if your databases are empty, as it will initialize the slave regardless.

 On the master (this will require your MySQL root password):

```bash
 mysqldump -uroot -p --all-databases --single-transaction --master-data=1 | gzip >master.sql.gz
```

 If you don't have a root password (which is generally a bad idea, but fine if your MySQL server is on a private network), you should omit the `-p` above.

 You can copy this file over to the slave server using `scp`:

```bash
 scp master.sql.gz unicorn:
```

 Finally, import the dump on the slave:

```bash
 zcat master.sql.gz | mysql -uroot
```

**5.** Tell the slave to mirror the master.

```bash
 mysql> CHANGE MASTER TO MASTER_HOST='dragon', MASTER_USER='foo', MASTER_PASSWORD='bar';
```

**6.** Start the slave!

```bash
 mysql> START SLAVE;
```
 You can now monitor the progress of your slave using `SHOW SLAVE STATUS`. (If you use a `\G` instead of a semicolon to terminate the line, it will print out the data in a much more readable format.)

```bash
 mysql> SHOW SLAVE STATUS\G
```

 There could be a number of errors, which are beyond the scope of fixing here. (In my case, we ran into issues with binary logs and the binary log index files.) These can generally be troubleshooted (troubleshot?) by reading the output of syslog (`tail -f /var/log/syslog`) and fixing the problem one piece at a time; it helps to have a lot of UNIX experience, though.) If all goes well, though, `SHOW SLAVE STATUS` will have lines something like the following:

```
Slave_IO_State: Waiting for master to send event
    Master_Host: dragon
           Master_Port: 3306
      Slave_IO_Running: Yes
    Slave_SQL_Running: Yes
 Seconds_Behind_Master: 12887
```

 This indicates that the slave is running and in the process of catching up to the master, and in time will be synchronized with it.

 And, that's (hopefully!) all there is to it! Now, with your new slave, you can go forth and conquer the world! (Or, less ambitiously, cover your backside when you accidentally delete something.)

 _Obligatory CTO Note: Make sure you keep, and regularly verify your daily backups too!_
