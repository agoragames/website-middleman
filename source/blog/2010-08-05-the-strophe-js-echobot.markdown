---
title: The Strophe.js Echobot
author: Armando DiCianno
---
I'm toying around with in-browser XMPP in order to publish information to our users in real time.  To start, I wanted to get the strophe.js echobot demo working.  I found the posted steps a bit lacking, and thus I present a more detailed procedure for how to get nginx+ejabberd+strophe.js up and running on Ubuntu 10.04 Workstation.  When we're finished, we'll test using Firefox and Empathy.

Note: The process should be the same for a Ubuntu server, though you'll have to futz with hostnames and test using your workstation or something like irssi+bitlbee.

**Installation**

1. Install nginx and ejabberd

```
foo@bar$ sudo apt-get install ejabberd nginx curl
```

2. Download strophe.js

```
foo@bar$ curl - http://code.stanziq.com/strophe/strophejs/releases/strophejs-1.0.1.tar.gz
```

**Verify your machine config**

1. Verify you have an entry in your /etc/hosts file for localhost, it should look something like this (yes, silly, but lately for some reason I keep running into people who modify this incorrectly):

```
#/etc/hosts
127.0.0.1 localhost
```

**Configuring ejabberd**

1. Setup account admin account

```
foo@bar$ sudo ejabberdctl register admin localhost admin
```

2. Edit /etc/ejabberd/ejabberd.cf and make the following changes.

In the admin user section, add the username "admin" so that it looks like this:

```
%% ejabberd.cfg
%% Admin user
{acl, admin, {user, "admin", "localhost"}}.
```

In the modules section add mod_http bind to the list of loadable modules:

```
%% ejabberd.cfg
%%
{modules,
[
...
{mod_http_bind, []},
...
]
}.
```

3. Restart ejabberd

```
foo@bar$ sudo /etc/init.d/ejabberd restart
```

4. Verify ejabberd is working by browsing to http://localhost:5280/http-bind

**Configuring nginx**

1. Create /etc/nginx/sites-available/strophe and include the following:

```
#nginx.conf
server {
listen 8080;
server_name localhost;

location /http-bind {
proxy_buffering off;
tcp_nodelay on;
keepalive_timeout 55;
proxy_pass http://localhost:5280;
}

location / {
# This is where you place your strophejs sample.
root /var/www/strophe;
}
}
```

Note: If for whatever reason the new configuration conflicts with an existing one, you can probably get by if you change the port number.  I used 8080 so that this won't conflict with the default config.

2. Symlink the config to the sites-enabled folder
```
foo@bar$ sudo ln -s /etc/nginx/sites-available/strophe strophe
```

3. Be a good little sysadmin and check your work.

```
foo@bar$ sudo nginx -t
the configuration file /etc/nginx/nginx.conf syntax is ok
configuration file /etc/nginx/nginx.conf test is successful
```

4. If it passes, restart nginx

```
foo@bar$ sudo /etc/init.d/nginx restart
```

**Setup strophe.js**

1. From the directory where you downloaded strophe
```
foo@bar$ tar -xzvf strophejs-1.0.1.tar.gz
foo@bar$ sudo mv strophejs-1.0.1 /var/www/strophe
```

2. Modify /var/www/strophe/exampl/echobot.js
```javascript
// echobot.js
var BOSH_SERVICE = 'http://localhost:8080/http-bind'
```

Test!

1. Open Firefox and go to: [http://localhost:8080/examples/echobot.html](http://localhost:8080/examples/echobot.html)

2. Enter the following:

JID: admin@localhost
Password: admin

3. Click connect, it will show message like this.
Strophe is connecting.
Strophe is connected.
ECHOBOT: Send a message to admin@localhost.local/4199388567126350847984920 to talk to me.

4. Open Empathy and create a new Jabber account.

Login: admin@localhost
Pass: admin

5. Initiate a new chat with the contact id shown in the web browser, in my case: admin@localhost.local/4199388567126350847984920

6. Type a message, and it will appear in the browser.

Done!
