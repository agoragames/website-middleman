---
title: wiredump_dev = STDERR
author: David Czarnecki
---
If you are ever debugging SOAP web services from Ruby and wondering what information is going across the wire to/from the web service, wiredump_dev = STDERR, may be your best friend.

```ruby
def some_method_that_uses_a_soap_web_service
  storage = SOAP::WSDLDriverFactory.new(STORAGE_WSDL).create_rpc_driver
  ...
  storage.wiredump_dev = STDERR
  response = storage.DoSomething(...)
end
```

 When the DoSomething web service method is called, the Ruby SOAP library will print out the request and response to STDERR.

 It is invaluable. Trust me!

 Follow-up (8/13/2009): A friend pointed me at [Handsoap](http://github.com/troelskn/handsoap/tree/master), a library for creating SOAP clients in Ruby, which is an alternative to SOAP4R. It apparently does not suck. YMMV.
