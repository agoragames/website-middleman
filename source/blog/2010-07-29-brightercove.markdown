---
title: Brightercove
author: David Czarnecki
---
We're using [Brightcove](http://www.brightcove.com/en/) here at Agora Games for some video platform work. In our group chats, we've talked about, "It would be nice if we had a Ruby API for interacting with Brightcove."

 And so I did just that, [http://github.com/agoragames/brightcove](http://github.com/agoragames/brightcove)

```ruby
sudo gem install brightcove-api

>> require 'brightcove-api'
=> true
>> brightcove = Brightcove::API.new('0Z2dtxTdJAxtbZ-d0U7Bhio2V1Rhr5Iafl5FFtDPY8E.')
=> #
>> response = brightcove.get('find_all_videos', {:page_size => 3, :video_fields => 'id,name,linkURL,linkText'})
=> {"items"=>[{"name"=>"Documentarian Skydiving", "id"=>496518762, "linkText"=>nil, "linkURL"=>nil}, {"name"=>"Surface Tricks", "id"=>496518763, "linkText"=>nil, "linkURL"=>nil}, {"name"=>"Free Skiing", "id"=>496518765, "linkText"=>nil, "linkURL"=>nil}], "page_number"=>0, "page_size"=>3, "total_count"=>-1}
```
