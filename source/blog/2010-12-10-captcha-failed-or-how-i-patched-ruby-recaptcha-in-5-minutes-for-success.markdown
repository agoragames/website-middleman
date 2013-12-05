---
title: CAPTCHA failed or How I Patched ruby-recaptcha In 5 Minutes For Success
author: David Czarnecki
---
We are using the [ruby-recaptcha](http://bitbucket.org/mml/ruby-recaptcha/wiki/Home) library here at Agora Games. I got a bug from our QA department that they wanted the CAPTCHA failure message to change from 'Captcha failed.' to 'CAPTCHA failed.'.

 I love that the Ruby and Rails community is so test-focused. I looked at the ruby-recaptcha issue tracker and there was already a patch for adding in customizable message support. However, with the patch, none of the tests passed. It was well within the library author's rights to give that patch the middle finger.

 So, what did I do? I applied the patch to my local copy of the ruby-repatcha library, fixed the tests, and [submitted an updated patch](http://bitbucket.org/mml/ruby-recaptcha/issue/2/make-the-error-message-customizable#comment-313094).

 Success.

 You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).

 ![](http://static.rubyrags.com/pictures/1/ruby_makes_me_happy.png "happy-ruby")
