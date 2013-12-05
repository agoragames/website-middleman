---
title: Scaling Ruby and Rails Part 1
author: David Czarnecki
---
I wish scaling applications and systems these days consisted solely of " [Just Add Scaling!](http://olabini.com/blog/2008/05/just-add-scaling/)". But you know what? It's not. I also forget where I read it, but the quote went something like, "Programming languages don't scale, architectures scale." Scaling is driven by proper iterative design, implementation and testing.

In a series of blog posts I want to cover how we have approached scaling out various parts of our Ruby and Rails infrastructure here at Agora Games using real-world examples on very high-traffic sites such as the Guitar Hero and Call of Duty community sites.

Here I'll cover the "Deep Dive". I originally came from BigCo. and there we used a concept called the "Deep Dive", which involved taking a specific requirement in combination with an approach or technology and following a thread of execution that would take you through the entire technology stack, or a "deep dive" through the system. At the end you would either prove or disprove the technology or approach. But it was done in the context of a real set of requirements.

The following is the e-mail (project/features names changed to protect the innocent ... the important concept here is the Deep Dive, not the project/features) I sent around to our engineering team in September of last year after doing a Deep Dive on a queue system.

 _________________

> From: David Czarnecki

 To: Engineering

 Clearly Defined Requirement(s)

 Ultimately, to do a deep dive correctly, you need clearly defined requirements to evaluate your technology or approach against. In the case of PROJECT X, with the use of a queue, we had the following:

 Setup queue
 Decide event(s)
 Send to queue
 Aggregate from/to queue
 Put into message creation
 Send back to the app

 Narrowing the Field

 I spent a day looking at various queue packages in Ruby and other languages to understand:

 Features - What features do we get out of the package?
 API - How easy is it to setup/create/interact with the queue from actual code?
 Aliveness - Is this an ongoing effort or was it thrown on RubyForge and ultimately abandoned?
 Community - Where is this package being used? How many developers or contributors commit to the project?
 Language - Are we expanding our technology stack by introducing a queue written in one language with an interface in another language?

 Pork, aka The Other Other Requirements

 And don't forget about the other "unspoken" requirements.

 Ease of setup
 Speed
 Failsafe
 Scaling

 At the end of the day, whichever package is picked, you want some guarantee that the package you've chosen is "good" or at least "good enough". But what if the Guarantee Fairy's a crazy glue sniffer? Next thing you know there's change missing from your dresser and your daughter's knocked up. I've seen it a hundred times. Although you've got a set of requirements that define how you're going to use a technology or approach operationally, there are still requirements that need to be addressed, even if there isn't anything formally specified.

 Let's Get Ready To Rumble

 I chose Sparrow and Rabbit/AMQP since these passed the "ease of setup" requirements with flying colors.

 [http://code.google.com/p/sparrow/](http://code.google.com/p/sparrow/) - Pure Ruby

 [http://hopper.squarespace.com/blog/2008/7/22/simple-amqp-library-for-ruby.html](http://hopper.squarespace.com/blog/2008/7/22/simple-amqp-library-for-ruby.html)

 Erlang Queue Server/Ruby interface to Queue

 Next up it was time to prove out the feasibility of the two technologies looking at the "soft" requirements in the context of the "hard" requirements. This meant setting up the two systems to:

 Setup queue
 Send event(s) to queue
 Aggregate from/to queue

 The other "hard" requirements would be addressed based on the outcome of this initial sanity check.

 2 Queues Enter, 1 Queue Leaves ... Wait, what?

 Although I wanted to use this to prove out "FEATURE X", I also wanted to address its use in "FEATURE Y". "FEATURE Y" involves converting a song file into an MP3. So I setup a test to evaluate the two systems which was:

```ruby
1k, 8k, 16k, 32k, 64k messages do
  25.times do
    10000 messages do
      publish message to queue
      read message from queue
    end
  end
end
```

 In other words, publish 10000 messages to the queue (in one process) and read those messages from the queue (in another process), noting how long it took to publish and read. Do this 25 times to get a min/max/average time for each of the different message sizes.

 I have attached the spreadsheet of the results which show: the larger the message, the longer it takes to publish and read from the queue. However, it also shows that Sparrow could handle the 64k messages while Rabbit/AMQP could not. Sparrow got slower to process those 10000 64k items from the queue, but it never failed as with Rabbit/AMQP. Ultimately, the deep dive was not about fixing a broken AMQP adapter.

 The Devil is in the Details

 One benefit of using Sparrow is that persistence is built into the server. If you take down Sparrow and there are messages on the queue, it will write those out to an SQLite3 database. Ultimately this lead me to look at the size of the field it was using for queue data which would need to be patched from its current 255 characters.

 Conclusion

 So, I've now got a queue server that I feel comfortable setting up and using and that can probably handle the load of data we're going to throw at it come launch. The queue server/queues were integrated into PROJECT X in the context of the "FEATURE X" to prove its feasibility in addressing that feature in a future sprint.

 And one more thing ...

 There are tests for the various bits that make up "FEATURE X". I'm most happy with the integration test which fires up a Sparrow server, fires up a foo, creates a bar, runs the aggregator, and checks to see that a baz was created for the account (oh and then cleaning up the queue server and the subscriber). 14 LOC, but there's a lot of code that it exercises behind the scenes. And yes, it passes :)
_________________

 So, there you go. Hopefully you have enough information to do your own Deep Dive.

 Ultimately for FEATURE X and FEATURE Y, Sparrow more than met our needs. Advances and changes to AMQP and its associated libraries have been made which I'm sure make it a more than viable candidate. At the time however, with just getting the system to work for a day to prove out the Deep Dive, it just didn't meet our needs. Again, the point of this blog post is to talk about the Deep Dive in the larger context of its use in Scaling Ruby and Rails.
