---
title: Advanced Page Caching Hacks in NGINX
author: Jason LaPorte
---
Those of you in the Rails community who use NGINX may have come across [this](http://brainspl.at/nginx.conf.txt) before: Ezra Zygmuntowicz's NGINX config. It bears some similarity to the ones we use at Agora. Specifically, the section relating to serving page-cached files. The relevant lines (pulled from one of our configs) looks like this:

```
 if (-f $request_filename.html) { rewrite (.\*) $1.html break; }
 if (-f $request_filename/index.html) { rewrite (.\*) $1/index.html break; }
 if (!-f $request_filename) { proxy_pass http://some-proxy; }
```

 This generally works well, for simple cases. Unfortunately, we've run into some more complex ones where it didn't cut it. I'll outline two of those cases below and show what we did to fix it.



 The first problem came up when we were page-caching both HTML and XML files (that is, there might be a slots/show/47.html and a slots/show/47.xml. (You can't do this by default in Rails. We had to patch it.) The problem was that when you request /slots/show/47, the NGINX config only checks for and serves the HTML file, even when what you really wanted was XML. Of course, checking for the XML file gives the reverse problem: if you're in a web browser, you get XML instead of pretty HTML. Not so hot.

 My solution was to assume that the user wants XML unless their browser says otherwise (via the HTTP Accepts: header), in which case we check for HTML first instead. If we can't find the relevant file, we try with the other extension (in case we guessed wrong), and finally we kick the request to the proxy if we can't satisfy it. Thus, it looks like this:

```
# figure out the order we should search the cache
 set $preferred_format xml;
 set $secondary_format html;

 if ($http_accept ~\* text/html) {
 set $preferred_format html;
 set $secondary_format xml;
 }

 # check the cache for cached files
 if (-f $request_filename.$preferred_format) {
 rewrite (.\*) $1.$preferred_format break;
 }

 if (-f $request_filename/index.$preferred_format) {
 rewrite (.\*) $1/index.$preferred_format break;
 }

 if (-f $request_filename.$secondary_format) {
 rewrite (.\*) $1.$secondary_format break;
 }

 if (-f $request_filename/index.$secondary_format) {
 rewrite (.\*) $1/index.$secondary_format break;
 }

 # if the file doesn't exist, let the application sort everything out
 if (!-f $request_filename) { proxy_pass http://some-proxy; }
```

 The second case was a bit more subtle, but is similar in theory: one of our sites uses proper REST (that is, we support the HTTP GET, PUT, DELETE, etc. methods). When a user performed a GET request, the page gets cached; if they perform a DELETE sometime after that, NGINX (which is not configured to handle REST by default) simply returns the cached file happily instead of forwarding the DELETE request to the application. (As you can imagine, tracking down the source of this problem was not the easiest thing in the world.)

 The solution in this case was to disable page caching for GET requests. Unfortunately, NGINX's support for if statements isn't so hot, so we had to do something fairly hacky to get it to work. (For the record, while I've not been enthused with the if statements, I tend to like NGINX in most other areas, so a couple silly warts like this are excusable for me.)

```
# Look for "/foo.zmog" unless we're asking for a GET request, in which case
 # we look for "/foo.xml". Since "/foo.zmog" will never exist, this means
 # that we will only check for pagecached files on a GET request. (Yes, this
 # is totally ass-backwards. NGINX is awesome except in this case.)
 set $cache_suffix "zmog";
 if ($request_method = GET) {
 set $cache_suffix "xml";
 }

 # Caching rewrites
 if (-f $request_filename.$cache_suffix) {
 rewrite (.\*) $1.$cache_suffix break;
 }

 if (-f $request_filename/index.$cache_suffix) {
 rewrite (.\*) $1/index.$cache_suffix break;
 }

 # More metrics logging for cached files
 if (!-f $request_filename) { proxy_pass http://switchblade_proxy; }
```

 As you can see, sometimes, making NGINX play nice requires some lateral thinking, but you can generally always get it to do what you need to.
