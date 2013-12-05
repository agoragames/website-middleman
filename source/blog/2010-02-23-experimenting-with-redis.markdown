---
title: Experimenting with Redis
author: David Czarnecki
---
Yesterday I started looking at ways to do inter-application communication. In a number of projects we've done here at Agora Games, we've used queues to make that happen. [Redis](http://code.google.com/p/redis/) has been on my radar for awhile now, but yesterday I drove my Chevy to the levee and guess what? The levee is NOT dry people. I mean, who drinks rye anyway these days? Old people.



 Right, [Redis](http://code.google.com/p/redis/).

 "Redis is an advanced key-value store. It is similar to memcached but the dataset is not volatile, and values can be strings, exactly like in memcached, but also lists, sets, and ordered sets. All this data types can be manipulated with atomic operations to push/pop elements, add/remove elements, perform server side union, intersection, difference between sets, and so forth. Redis supports different kind of sorting abilities."

 I was particularly interested in the support in Redis for lists, which would allow me to have one application push stuff into the datastore and allow for another application to pull stuff from the datastore. A datastore that could operate as a queue? I guess this is as close as we're going to get to flying cars in 2010. Redis is also supposed to be wicked fast and there are a number of libraries available in your programming language of choice with which to communicate with Redis.

 Redis setup was trivial and "just worked".

 After starting the Redis server, I could just prototype in script/console.

 Here we go:

```ruby
>> redis_queue = Redis.new
=> #<Redis:0x222df9c @thread_safe=nil, @logger=nil, @password=nil, @timeout=5, @db=0, @sock=nil, @host="127.0.0.1", @port=6379>
>> redis_queue.push_tail 'strings', 'string 1'
=> "OK"
>> redis_queue.push_tail 'strings', 'string 2'
>> "OK"
>> redis_queue.list_length('strings')
=> 2
>> redis_queue.list_range('strings', 0, -1)
=> ["string 1", "string 2"]
>> some_string = redis_queue.pop_head('strings')
=> "string 1"
>> r.list_range('strings', 0, -1)
=> ["string 2"]
>> r.list_length('strings')
=> 1
>> quit
```

 [There are quite a few commands that make Redis even more awesome, but for now I'm sold](http://code.google.com/p/redis/wiki/CommandReference). (If using an entire sentence as a link is wrong then I don't want to be right)

 Also, I know of [Resque](http://github.com/defunkt/resque#readme), "a Redis-backed library for creating background jobs, placing those jobs on multiple queues, and processing them later." If I ever feel like driving the Mercedes Benz of flying cars, I'll use it.
