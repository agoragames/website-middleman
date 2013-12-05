---
title: 'My "Freedom Patch" Gem: constant-redefinition'
author: David Czarnecki
---
The [constant-redefinition gem](https://rubygems.org/gems/constant-redefinition) allows you to define constants if not defined on an object and redefine constants without warning.



 Are you still with me? Good.

 The code "credit" for this gem comes from the Stack Overflow post, ["How to redefine a Ruby constant without warning?"](http://stackoverflow.com/questions/3375360/how-to-redefine-a-ruby-constant-without-warning). It just so happens that I was working on a project today where our test suite was testing a large number of iterations to write out data. I wanted to redefine the number of iterations in test (based on a constant in the model) to respect the spirit of the test, but not do as many iterations in test. I googled, found that post, and it seemed like a neatly packageable item that would be useful to other developers.

 So, I created the [constant-redefinition gem](https://rubygems.org/gems/constant-redefinition). You can also check out the [GitHub constant-redefinition project](https://github.com/czarneckid/constant-redefinition). My contribution was merely packaging it up as a gem, formalizing the tests, and making the method names longer (sue me, I prefer readability).

 The project page has a good overview of using the two methods, but I'll reproduce it here.

 {% gist 726069 %}

 You may know "freedom patch" by its other names, "monkey patch" or "duck punch".

 You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).
