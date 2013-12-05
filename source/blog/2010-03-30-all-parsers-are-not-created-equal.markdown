---
title: All Parsers Are Not Created Equal
author: David Czarnecki
---
This is a post about [XML](http://en.wikipedia.org/wiki/Xml) and [JSON](http://en.wikipedia.org/wiki/JSON).

 We recently came across a bottleneck in one of our applications that grabs data from a content repository. A large part of the bottleneck had to do with caching of data from the content repository, or lack thereof. A small part of the bottleneck has to do with parsing of XML data as the application grabs XML feeds from the content repository and parses it to display data within the application. Novel idea using XML as a communication mechanism between 2 applications? You betcha.

 In any event, boring machine name aside, I decided to benchmark the data parsing via JSON, Hpricot, and Simple-RSS.

```ruby
David-Czarneckis-iMac:application-playground dczarnecki$ ruby parsing-benchmarking.rb
"Benchmarking JSON"
"    JSON document: /Users/dczarnecki/projects/parsing-benchmarking/sample_json_document.json, Size: 161574"
"    JSON::Ext::ParserJSON::Ext::Generator"
"    Benchmarked JSON parse for 20x (average): 0.0121459603309631"
"Benchmarking Hpricot"
"    XML document: /Users/dczarnecki/projects/parsing-benchmarking/sample_photo_rss_document.rss, Size: 162644"
"    Benchmarked XML parse for 20x (average): 0.00232400894165039"
"Benchmarking Simple-RSS"
"    XML document: /Users/dczarnecki/projects/parsing-benchmarking/sample_photo_rss_document.rss, Size: 162644"
"    Benchmarked XML parse for 20x (average): 1.78787769079208"
David-Czarneckis-iMac:application-playground dczarnecki$
```

 The numbers are interesting. Here is my opinion on the results:

 - Hpricot is the fastest at parsing a big XML document. You have to use XPath to get at the elements in the document. XPath is, for me, non-intuitive and you sacrifice a bit in terms of readability of the code.

 - JSON is the second fastest at parsing a big JSON document. Also, you have a four letter acronym technology integrated into your application, and let's finally admit it, size matters. For me, you gain intuitive access to the underlying data and more readability of the code.

 - Simple-RSS is slow.

 - XML output from our content repository doesn't give us paged access to the content, but the JSON API in the content repository does give us paged access to the content. With the XML output, we have to suck down a firehose and slice it up appropriately leading to a bunch of flackery with caching the parsed document.

 If you're looking for a better read, then check out the following book, "Paint It Black: A Guide to Gothic Homemaking".

 [ ![Paint it Black](/uploads/2010/03/41Jbbh8d2SL._BO2204203200_PIsitb-sticker-arrow-clickTopRight35-76_AA300_SH20_OU01_.jpg "Paint it Black") ](http://www.amazon.com/Paint-Black-Guide-Gothic-Homemaking/dp/1578633613/ref=sr_1_1?ie=UTF8&s=books&qid=1269982528&sr=1-1)
