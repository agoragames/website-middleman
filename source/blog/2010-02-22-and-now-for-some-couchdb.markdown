---
title: And now for some couchdb
author: Jason LaPorte
---
I had occasion tonight to give a quick demo of CouchDB.  This is so simple its almost not worth blogging about, but hey, good software is **_supposed_** to be simple.

 **Install**
 On your Mac:

```
 sudo port install couchdb
 sudo launchctl load -w /Library/LaunchDaemons/org.apache.couchdb.plist
```

 On Ubuntu:

```
 sudo apt-get install couchdb
```

 You're done; now to play.

 **Futon Admin Interface**
 This allows you to create a DB, create records, etc.

1. Open http://localhost:5984/_utils/
2. ...
3. Prosper

**Using our old friend _curl_**

```
 curl -X PUT http://localhost:5984/mlg/ #create a db
 curl -X GET http://localhost:5984/mlg/ #get a whole bunch of info about the db
 curl -X POST http://localhost:5984/mlg/ -H "Content-Type:application/json" -d '{"body": "Here is a paragraph"}' #create a record
```
