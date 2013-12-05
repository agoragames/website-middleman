---
title: Rails 3 + Mocha Load Order Gotcha
author: Tom Quackenbush
---
The other day we ran into an issue in one of our new Rails 3 apps that is using mocha for mocking. It seemed that once a stub was mocked in one test, it would carry over to each subsequent test causing failures.
 Mocks were not being torn down correctly...
 Since mocha does not lie, it had to be something within our setup causing it to fail...

 Thankfully, a tweet response from @elise_huard offered the following solution:

 " [@tquackenbush](http://www.twitter.com/tquackenbush) yes, [@threedaymonk](http://www.twitter.com/threedaymonk) suggested a fix: to fix load order, so do `gem 'mocha', :require => false` and `require 'mocha'` in test_helper"

 Worked like a charm!
 A tip of the hat to [@elise_huard](http://www.twitter.com/elise_huard) and [@threedaymonk](http://www.twitter.com/threedaymonk) for the help!
