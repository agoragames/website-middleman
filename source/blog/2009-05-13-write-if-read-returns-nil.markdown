---
title: Write if read returns nil
author: Ola Mork
---
Usually we use standard caching methods on our site (primarily fragment caching to avoid DB queries).

Occasionally we need to do something more fancy. These instances usually come up when we're splitting one query into two because rails doesn't support `:force_index` or `:adapter_specific_find_options` on `ActiveRecord::Base.find`. We understand this motivation but really hate `ActiveRecord::Base.connection#find_by_sql` or `ActiveRecord::Base.connection#execute`. These are not rational hatreds.

 So when we get into a situation where we're going to be caching manually it's usually in the controller and we almost always end up with a pattern of:

```ruby
@object = Rails.cache.read('really/complicated/and/stinky/key')
if @object.nil?
  @object = what_should_my_object_be?
end
```

 That's fine in a contrived example but we were doing this in about 10 different places and it looked like a good candidate for drying up.

 Here's the solution we use:

```ruby
module ActiveSupport
  module Cache
    class Store
      def read_and_write_if_nil(key, options = {})
        object = read(key)
        if object.nil?
          object = yield
          write(key, object, options)
        end
        object
      end
    end
  end
end
```

 And the production example looks like this:

```ruby
account_ids = Rails.cache.read_and_write_if_nil("member_ids_for_clan_#{@clan.id}", :expires_in => 5.minutes) do
  @clan.members.find(:all, :order => 'groupies DESC', :select => 'accounts.id').collect(&:id)
end
````
