---
title: Cookie Monster
author: David Czarnecki
---
I thought if you didn't use Rails sessions, that Rails wouldn't create a session cookie?

 [ ![](/uploads/2010/09/cookie-monster3-7769871237963363-300x290.jpg "cookie-monster3-7769871237963363") ](/uploads/2010/09/cookie-monster3-7769871237963363.jpg)

 In any event, one of our engineers had put together a simple Rack middleware for destroying cookies.

 You can find the [code for cookie_monster.rb as a Gist on GitHub](http://gist.github.com/592330).

 If this helps you, great. I'd also like to understand why a session cookie gets created? It seems like it's happening in the bowels of Rails. This is a Rails 2.3.8 application by-the-dubz.
