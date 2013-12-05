---
title: Coding by Example
author: David Czarnecki
---
I don't think there's anything inherently wrong in coding by example, e.g. cutting and pasting code from a sample that works for you. But, I would like to advocate for making at least minimal changes to update the code for your application or domain.

 Consider the following factory which creates an account.

```ruby
Factory.define(:account) do |f|
  f.first_name { Factory.next(:name) }
  f.last_name { Factory.next(:name) }
end
```

 What's wrong here? Nothing? What if we change the code to be the following?

```ruby
Factory.define(:account) do |account|
  account.first_name { Factory.next(:name) }
  account.last_name { Factory.next(:name) }
end
```

 IMO, the second code example is more self-documenting. Obviously we know we're working with a factory, but it's for an account object, and we're being explicit about the attributes being applied to an account object, not some f object which just happens to be an account object.

 You can find more hilarity over on my Twitter account, [CzarneckiD](http://twitter.com/czarneckid).
