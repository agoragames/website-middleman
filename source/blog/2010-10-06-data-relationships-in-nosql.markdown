---
title: Data relationships in NoSQL (P.S. They're real and they're spectacular)
author: David Czarnecki
---
Do people really think there are no relationships between data in NoSQL databases? Or that they're doomed from the start?

 ![](http://www.nataliedee.com/092808/this-relationship-is-doomed.jpg "This Relationship Is Doomed")

 I'm going to demonstrate a very simple relationship among data using [MongoDB](http://www.mongodb.org/) and [Mongoid](http://mongoid.org/).

 Let's first define a user.

```ruby
class User
  include Mongoid::Document
  include Mongoid::Timestamps

  attr_protected :_id

  field :nickname
  field :first_name
  field :last_name

  references_many :activity_items
end
```

 Users are an active bunch, so let's keep track of their activity. The user model references the activity items.

```ruby
class ActivityItem
  include Mongoid::Document
  include Mongoid::Timestamps

  attr_protected :_id

  field :event_type

  referenced_in :user

  index :user
end
```

 The activity item references a user.

 Now, let me show you how this works.

```ruby
dczarnecki-agora:project dczarnecki$ rails console
Loading development environment (Rails 3.0.0)
ruby-1.9.2-p0 > user = Factory.create(:user)
=> #
ruby-1.9.2-p0 > activity = Factory.create(:activity_item, :user => user)
=> #
ruby-1.9.2-p0 > user.activity_items.count
=> 1
ruby-1.9.2-p0 > activity.user
=> #
ruby-1.9.2-p0 >
```

 I created a user. I created an activity and associated it with the user I just created. I counted the number of activities of that user. I referenced the user from the activity.

 Any questions?
