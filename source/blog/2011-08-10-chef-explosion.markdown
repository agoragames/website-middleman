---
title: Chef Explosion
author: Waldo Grunenwald
---
Here at MLG, we use a product from Opscode called Chef to manage our server environments. Chef allows us to reliably manage our infrastructure by providing us with the ability to write code that describes how a server should be configured. While not perfect, it has served us well.



 Chef leverages CouchDB for it's datastore. CouchDB is "NoSQL" database product, similar in concept to MongoDB. CouchDB provides a lot of features and usability, but as a tradeoff for versioning, speed, and convenience it sacrifices disk space. In OpsCode's documentation, they do helpfully point out in the ["CouchDB Administration for Chef Server" page](http://wiki.opscode.com/display/chef/CouchDB+Administration+for+Chef+Server) that you should periodically run a Compaction. Basically what this does is remove some of the older versions of documents.

 Following their advice, we set it up as a weekly cron (in our Cron cookbook, naturally), and so it looks like this:

```ruby
cron 'Compact Chef DB' do
  user 'nobody'
  weekday '1'
  hour '4'
  minute '0'
  command 'curl -X POST http://localhost:5984/chef/_compact'
end
```

 which results in a crontab entry that looks like this:

```
# Chef Name: Compact Chef DB
 0 4 \* \* 1 curl -X POST http://localhost:5984/chef/_compact
```

 One fine summer morning I came in one morning to several thousand emails saying "Chef Run Failed." This, as you may understand, severely degraded my opinion of the morning.

 Cue the Swedish Chef crying "Bork Bork Bork!"

 After I determined that a full disk was the problem and deleting an old unneeded backup file to get some headroom, I found that the biggest contributor was the /var/lib/couchdb/0.10.0/.chef_design directory.

```
root@chefserver:/var/lib/couchdb/0.10.0/.chef_design# ls -lh
 total 96G
 -rw-rw-r-- 1 couchdb couchdb 30M 2011-07-21 18:26 07ccb0c12664d1f1ca746003182b521a.view
 -rw-r--r-- 1 couchdb couchdb 1.7G 2011-05-11 12:03 178087e2a7c06ff437482555acf60bab.view
 -rw-rw-r-- 1 couchdb couchdb 8.5G 2011-07-22 08:24 18757f7428c465dd0504ac3d5d7ce577.view
 -rw-rw-r-- 1 couchdb couchdb 8.9G 2011-07-22 08:24 367772ed026257ff1f88a1011576c9c3.view
 -rw-rw-r-- 1 couchdb couchdb 6.6M 2011-07-21 15:52 3970d32b6acb424bb4d19684bdf9aff1.view
 -rw-r--r-- 1 couchdb couchdb 8.6M 2011-07-22 08:11 91188e3c7d61bdf079eee6ca719be05c.view
 -rw-rw-r-- 1 couchdb couchdb 6.0G 2011-03-16 16:44 9f39fce5f578a23cc8cad7b3fe9b8ce9.view
 -rw-r--r-- 1 couchdb couchdb 1.4G 2011-07-22 08:24 af280ad217f6edca6276d1d1bcbc069d.view
 -rw-rw-r-- 1 couchdb couchdb 19G 2011-05-11 12:00 b96879fe1377e2b91f228109f3aac384.view
 -rw-rw-r-- 1 couchdb couchdb 565K 2011-07-20 09:31 be708387555557a5b4886292346da6bb.view
 -rw-rw-r-- 1 couchdb couchdb 3.0M 2011-07-20 11:27 d381d1f4b207dc3d9624720a7e88f881.view
 -rw-r--r-- 1 couchdb couchdb 51G 2011-07-22 08:20 fe06cf9119d23dd7fec2492b79e7ebef.view
```

 I was surprised that there was so much disk use, since we had been running the Chef Compactions, and expected this kind of thing to be taken care of. Wondering if it was throwing some kind of error that we weren't seeing (since it's running as a cron), I ran it manually:

```
root@chefserver:~# curl -H "Content-Type: application/json" -X POST http://localhost:5984/chef/_view_cleanup
 {"ok":true}
```

 Which yielded:

```
root@chefserver:/var/lib/couchdb/0.10.0/.chef_design# ls -lh
 total 70G
 -rw-rw-r-- 1 couchdb couchdb 30M 2011-07-22 08:43 07ccb0c12664d1f1ca746003182b521a.view
 -rw-rw-r-- 1 couchdb couchdb 8.5G 2011-07-22 08:43 18757f7428c465dd0504ac3d5d7ce577.view
 -rw-rw-r-- 1 couchdb couchdb 8.9G 2011-07-22 08:43 367772ed026257ff1f88a1011576c9c3.view
 -rw-rw-r-- 1 couchdb couchdb 6.6M 2011-07-22 08:43 3970d32b6acb424bb4d19684bdf9aff1.view
 -rw-r--r-- 1 couchdb couchdb 51 2011-07-22 08:42 7bbcbf585caef33abc0733282f40a22a.view
 -rw-r--r-- 1 couchdb couchdb 8.6M 2011-07-22 08:43 91188e3c7d61bdf079eee6ca719be05c.view
 -rw-r--r-- 1 couchdb couchdb 1.4G 2011-07-22 08:42 af280ad217f6edca6276d1d1bcbc069d.view
 -rw-rw-r-- 1 couchdb couchdb 573K 2011-07-22 08:43 be708387555557a5b4886292346da6bb.view
 -rw-rw-r-- 1 couchdb couchdb 3.0M 2011-07-22 08:43 d381d1f4b207dc3d9624720a7e88f881.view
 -rw-r--r-- 1 couchdb couchdb 51G 2011-07-22 08:26 fe06cf9119d23dd7fec2492b79e7ebef.view
```

 Well, that was a significant but only partial win. Why do I still have 70GB in .view files?

 What Opscode hasn't told us about is that CouchDB has a thing called "Views", and these can - over time - come to take up space. A lot of space. (CouchDB views are the "primary tool used for querying and reporting on CouchDB documents" according to the [CouchDB Wiki](http://wiki.apache.org/couchdb/Introduction_to_CouchDB_views).) Opscode also hadn't mentioned that CouchDB says that these, too, need to be compacted.

 The good folks on the internet, notably the CouchDB docs and a question on StackOverflow ["CouchDB .view file growing out of control"](http://stackoverflow.com/q/3498856/428779).

 Among our findings we came upon this link to the [Compaction page in the CouchDB Documentation](http://wiki.apache.org/couchdb/Compaction/#View_compaction).

 My compatriot Jeff Hagadorn and I were both looking into identifing the design view names, and he beat me to the solution:

```
bash -c \'for x in checksums clients cookbooks data_bags environments id_map nodes roles sandboxes users; do curl -H "Content-Type: application/json" -X POST http://localhost:5984/chef/_compact/$x ; done\'
```

 (I had found a posting on the couchdbkit Google Group describing a script a user had written to solve this very problem [here](https://groups.google.com/group/couchdbkit/browse_thread/thread/4bddc28c630d73e0?pli=1), if you prefer a Python-based solution which doesn't require you to know your view names.)

 After doing that, our disk was in a much healthier state, and our chef-db-compact recipe now looks like this:

```
cron 'Compact Chef DB' do
  user 'nobody'
  weekday '1'
  hour '4'
  minute '0'
  command 'curl -X POST http://localhost:5984/chef/_compact'
end

 cron 'Compact Chef Views' do
   user 'nobody'
   weekday '1'
   hour '5'
   minutes '0'
   command 'bash -c \'for x in checksums clients cookbooks data_bags environments id_map nodes roles sandboxes users; do curl -H "Content-Type: application/json" -X POST http://localhost:5984/chef/_compact/$x ; done\''
 end
```

 which produces a crontab that looks like this:

```
# Chef Name: Compact Chef DB
 0 4 \* \* 1 curl -X POST http://localhost:5984/chef/_compact
 # Chef Name: Compact Chef Views
 0 5 \* \* 1 bash -c 'for x in checksums clients cookbooks data_bags environments id_map nodes roles sandboxes users; do curl -H "Content-Type: application/json" -X POST http://localhost:5984/chef/_compact/$x ; done'
```

 Now, you may suggest that we mount this location on a separate disk. The answer is that we had. /var/lib/couchdb is a separate 100GB physical disk. The problem was that /var/log is on the / partition, and that is only a 7GB disk. Once the views had filled their disk, the couchdb and chef logfiles had swelled with errors, and even mighty logrotate could only held them off for so long.

 Bear in mind that there was no impact to Production during this event; the only outcome was that new changes would not have been able to be pushed out via Chef, and a couple of filled inboxes. Nevertheless, this highlighted some of our flaws. The most important of which is that our monitoring of the server was imperfect, and we missed the alerts that the CouchDB disk was filling. Had we not missed those alerts we could have diagnosed this before it was a problem.

 As an aside, in addition to just alerting when disk reaches a certain capacity, you should also watch for sudden increases in utilization. If a particular disk normally runs at 20% capacity, but overnight a logfile swells the disk to 73%, it won't trigger your "75% Full" alert, but there is very likely a problem. One way to solve this is to record a "previous percentage" and compare that to the "current percentage" and alert in the event that there is a sudden increase.

 (NOTE: Server Names have been changed to protect the guilty.)

 UPDATE: I'm notified by the Senior Systems Admin at Opscode that they have added these compactions to the [chef-server recipe](https://github.com/opscode/cookbooks/blob/master/chef-server/recipes/default.rb). Their implementation is quite a bit different than ours, but no matter.

 Harold "Waldo" Grunenwald
 Systems Engineer
 @gwaldo
