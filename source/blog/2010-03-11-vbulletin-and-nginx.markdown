---
title: vBulletin and NGINX
author: Jason LaPorte
---
It's no secret that Agorian systems folk favor [NGINX](http://nginx.org/) for our web serving needs. We've written about it a lot before. Therefore, it should be no surprise that we end up making a lot of things designed to work on [Apache](http://httpd.apache.org/) work on NGINX. (We've also written about that before, come to think of it...)

 One example is [vBulletin](http://www.vbulletin.com/). A number of Agora's sites are powered by the forum software, which comes with rewriting rules for Apache's [mod_rewrite](http://httpd.apache.org/docs/2.0/mod/mod_rewrite.html) and [IIS](http://www.iis.net/)... but not NGINX.

 So, if you're interested in setting up vBulletin behind NGINX (and are using the advanced URL rewriting, like we are), you can find a sample configuration for doing so  [here](http://files.agoragames.com/jason/vb-nginx.txt).

 Let us know if you have any questions!
