---
title: Making WebDAV and NGINX Play Nice Together
author: Jason LaPorte
---
NGINX supports WebDAV, but its support is incomplete. Here's how we made a quick PHP hack to allow us to use WebDAV without having to proxy to another web server.

 [WebDAV](http://en.wikipedia.org/wiki/WebDAV) is a pretty awesome method of maintaining a shared data repository: it's simple, secure (or, at least, easily secured), and supported out of the box by just about everything across multiple platforms. The problem with it is that finding a decent WebDAV server is pretty hard: [Apache](http://httpd.apache.org/) and [LightTPD](http://www.lighttpd.net/) each provide WebDAV (to varying levels of support), but I had a very hard time finding other reputable-looking servers, and adding either of those two web servers into what is otherwise an [NGINX](http://nginx.net/)-only web server architecture isn't very clean. (Personally, I hate maintaining Apache and LightTPD, as they are both CPU and memory hogs, Apache especially.)

 NGINX "supports" WebDAV by means of a module, but this support is incomplete: it only handles the WebDAV methods PUT, DELETE, MKCOL, COPY, and MOVE, and leaves the necessary OPTIONS and PROPFIND (and the optional LOCK, UNLOCK, and PROPPATCH) methods unimplemented. This basically translates to being able to read and write files on disk, but being unable to do an "ls" or "dir" to see what files are available. Obviously, this is insufficient, so I created some magic to allow us to use a WebDAV repository with a technology stack we already have in place (namely, NGINX and PHP FCGI).

 Looking around the internet for similar things, I find that [we're not the only ones trying to do this,](http://notes.xiaoka.com/2008/04/13/git-repository-over-http-webdav-with-nginx/) and came across a [Perl CGI script](http://plan9.aichi-u.ac.jp/netlib/webappls/webdav.cgi) that is/can be used in a similar fashion. Unfortunately, NGINX doesn't play very nice with CGI (as opposed to FCGI, which works great with it), and I felt like I needed some semblance of performance out of this script, so I wasn't going to fire up a Perl process for every request (which is how CGI works). Instead, I wrote up a similar script in PHP. (In case you're not familiar with how FCGI works, it instead runs a daemon, which simply returns a response to each given request without having to run new processes. This cuts out a lot of overhead and allows for much better performance.)

 The idea is this: we have NGINX put up it's WebDAV support, and for every method that NGINX doesn't know how to respond to, we proxy the request to a PHP script that can handle it on NGINX's behalf. Making a simple FCGI script in PHP is not especially complicated. The original skeleton of it looked like this:

```php
<?php

 $request_method = $ENV_['REQUEST_METHOD']

 switch ($request_method) {
 case 'PROPFIND':
 # Code to handle PROPFIND goes here.
 break;

 case 'OPTIONS':
 # Code to handle OPTIONS goes here.
 break;

 default:
 header ('HTTP/1.1 400 Bad Request');
 break;
 }

 ?>
 ```

 We are given the request method via an environment variable from NGINX. Depending on the method given, we have to handle it in its own special way. If we get a method we don't understand, we merely return an HTTP error. Simple!

 In fact, implementing the PROPFIND and OPTIONS methods wasn't especially difficult, aside from the fact that reading the [WebDAV RFC](http://www.ietf.org/rfc/rfc2518.txt) is mind-numbingly tedious. (The OPTIONS method simply spits out a couple static headers, while PROPFIND returns an XML document of a directory listing. You can see my final implementation here. Be aware I didn't bother to fully support WebDAV: I merely implemented the simplest possible subset of the WebDAV functionality.)

 So, I hooked it up end to end. The NGINX configuration to do so looked something like this:

```
server {
 server_name <hostname>;
 listen 80;

 root <document root>;

 dav_methods PUT DELETE MKCOL COPY MOVE;
 dav_access group:rw all:r;
 create_full_put_path on;

 include /etc/nginx/fastcgi_params;
 fastcgi_param SCRIPT_FILENAME /var/www/webdav-extensions.php;
 fastcgi_param DEPTH $http_depth;

 location / {
 if ($request_method ~ ^(PROPFIND|OPTIONS)$) {
 fastcgi_pass localhost:9000;
 break;
 }
 }
 }
```

 The document root (and everything in it!) was chowned "www-data:www-data", which is the user that NGINX runs as. Make sure the directory _above_ your document root is owned by root, so that people using WebDAV aren't allowed to mess with the document root itself.

 You will note that we're running a PHP FCGI process (which we spawn with the LightTPD-supplied "spawn-fcgi" program) on localhost, on port 9000. Make sure you firewall whatever port you run your FCGI process on, or else you'll have a great, big security hole in your network.

 Also bear in mind that you can't use a vanilla Debian NGINX (or, whatever UNIX flavor you prefer), as it doesn't support WebDAV out-of-the-box. You will need to custom compile it with the "--with-http_dav_module" flag passed to "./configure". It's not complicated, but compiling NGINX is beyond the scope of this article.

 I tested it with a [UNIX client I had handy](http://www.webdav.org/cadaver/), and things worked pretty well. I could look around the directories, put and retrieve files, move things around, etc. Success!

 ...well, not quite. I then tried firing up a Windows client. I could put and get files just fine, but it would error out when I tried to do anything relating to directories. Spending an hour or so poking around in the NGINX access logs and the NGINX WebDAV module's source code and I came to realize that the Windows WebDAV client didn't follow the HTTP spec: when specifying a directory in HTTP, you must follow it with a slash (e.g. "http://example.com/directory/", and not "http://example.com/directory"). Web browsers automatically account for these errors, which is why we never think about this sort of thing. However, NGINX's WebDAV support requires the HTTP-compliant behavior (trailing slashes and all), and thus rejects the request. This is mostly easy to fix in NGINX:

```
server {
 # ...

 location / {
 # ...

 if (-d $request_filename) { rewrite ^(.*[^/])$ $1/ break; }
 if ($request_method = MKCOL) { rewrite ^(.*[^/])$ $1/ break; }
 }
 }
```

 This says that if the file exists and is a directory, add a trailing slash to the request if it doesn't already exist. We do similarly for MKCOL (that is, create directory) requests, since we can't check for the directory (since we havn't created it yet!).

 This solved the problem of creating and deleting directories in Windows! But there was still another problem lurking beneath the surface: the COPY and MOVE methods. See, it was the same problem as above (a lack of a trailing slash), but the destination of the COPY or MOVE is specified in the HTTP "Destination" header. While we can retrieve headers in NGINX (since they are made available in variables, such as "$http_destination"), NGINX provides no way to modify them.

 I first attemped to mangle the headers in NGINX and use a proxy request to NGINX itself to solve this problem. Predictably, I was unable to do so, and even if I had succeeded, the fix would have been positively maddening. So, I took the easy way out and added support for the COPY and MOVE methods into my PHP script, leaving NGINX to handle only PUT, DELETE, and MKCOL (in addition to the raw GET, HEAD, etc. methods). Again, simple, but tedious. Once I implemented it and got it tested, though, it worked perfectly on all platforms I tested it on.

 Performance looks great, but that doesn't surprise me, considering that the IO-heavy methods (GET and PUT) are implemented in NGINX. The methods I support (OPTIONS, PROPFIND, COPY, and MOVE) are all very simple and transient, meaning that when we do have to drop to PHP, we don't have to do so for very long.

 The final NGINX setup (which included HTTP Basic Authentication and SSL, for security), looked like this:

```
server {
 server_name <hostname>;
 listen 443;

 root <document root>;

 ssl on;
 ssl_certificate <ssl certificate>;
 ssl_certificate_key <ssl private key>;

 auth_basic <authentication realm>;
 auth_basic_user_file <password file>;

 dav_methods PUT DELETE MKCOL;
 dav_access group:rw all:r;
 create_full_put_path on;

 autoindex on;
 autoindex_exact_size off;

 # Variables necessary for proper execution of the PHP script used below.
 include /etc/nginx/fastcgi_params;
 fastcgi_param SCRIPT_FILENAME /var/www/webdav-extensions.php;
 fastcgi_param DEPTH $http_depth;
 fastcgi_param HOST $host;
 fastcgi_param DESTINATION $http_destination;
 fastcgi_param OVERWRITE $http_overwrite;

 location / {
 # NGINX WebDAV support is incomplete and somewhat too strict. We handle
 # a few WebDAV methods manually in a PHP script to fill out the cracks.
 if ($request_method ~ ^(PROPFIND|OPTIONS|COPY|MOVE)$) {
 fastcgi_pass localhost:9000;
 break;
 }

 # NGINX WebDAV requires trailing slashes on directories, yet certain
 # common WebDAV clients don't support them. Do rewrites to fix it,
 if (-d $request_filename) { rewrite ^(.*[^/])$ $1/ break; }
 if ($request_method = MKCOL) { rewrite ^(.*[^/])$ $1/ break; }
 }
 }
```

 The final PHP script is [here](http://files.agoragames.com/jason/webdav-extensions.php.txt). (It's not 100% WebDAV complient. Or even close. But it seems to cover all the common cases, as we havn't had any trouble with it yet.)

 What's especially awesome is that, if you just want quick read-only access, you can hit the WebDAV URL in a web browser and surf around that way (thanks to the NGINX "autoindex" module). You can also mount this (in just about any OS, including the built-in Mac OS X, Windows, and Ubuntu clients) for drag-and-drop access to the share, just like it was a local disk.

 I have some vague notions to extend it to handle SVN and GIT (as we currently proxy to Apache for HTTP access to those). Seeing as how the logic is so simple, it would probably be trivial to patch the NGINX WebDAV module with these changes as well. Those are blog posts for another day, though.
