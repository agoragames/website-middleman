---
title: Lightweight concurrency with Ruby and Eventmachine
author: Steven Davidovitz
---
[Eventmachine](http://rubyeventmachine.com "Eventmachine") describes itself as a "fast, simple event-processing library for Ruby programs." Included in it is a module called Deferrable that allows easy and lightweight concurrency. Deferrable makes it simple to spawn a blocking or long running operation, push it to the background, and on completion execute any number of code blocks (callbacks).

Below, I've written a sample application that uses the Deferrable class and Eventmachine's event loop to parallelize HTTP API calls to [whoismyrepresentative.com](http://whoismyrepresentative.com "whoismyrepresentative.com").

{% gist 734988 %}

As each request is created it placed in a pool with all other requests which are then spawned and executed after a call to Request.run. As the GET calls come back they are checked for an error message and based upon that the appropriate callbacks attached at the creation of the request are called. In this case, if the call succeeds each representative for that zip code is printed out along with a phone number. If it fails, the error message is printed. As the output below shows, the calls are done completely in parallel and immediately after they return the callbacks are executed.

{% gist 734989 %}

As the number of requests increases, so does the performance benefit of using this model. Example timings for 25 requests done serially and in parallel are below.

{% gist 735018 %}
