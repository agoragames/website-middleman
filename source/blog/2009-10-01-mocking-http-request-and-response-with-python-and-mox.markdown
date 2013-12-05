---
title: Mocking HTTP request and response with Python and Mox
author: Aaron Westendorf
---
I recently started integrating with some web services in Python and wanted to be able to test all the requests and responses with valid and invalid data. However, I need to be able to do this without actually hitting the web service when testing. And of course I don't want to change my web service code to conditionally do things if running in a test environment. Enter mocking and Mox.



 One of our engineers, Tim, has written an excellent post on his adventures as a Ruby programmer getting up to speed on [testing and mocking in Python using Mox](http://blog.agoragames.com/2009/02/23/python-is-mocking-me-a-ruby-programmers-adventures-with-pythonmox/). You should read it.

 Back to my issue with mocking the HTTP request and response.

 Here is what I came up with. I first created a MockResponse class that adds a read() method to the string class.

```python

class MockResponse(str):
  '''
  Mock response class with a method called read which will be used similar to the response from an HTTP request to a URL
  '''
  def read(self):
    return self
```

And here is a test in which I mock out the request and response for the urllib2.OpenerDirector.open method. I don't so much care what the request string is passed to the open call, so I use IgnoreArg(). And I return the XML that would be returned by the actual web service to indicate the username and/or password were incorrect.

```python
def test_logging_in_to_network_with_bad_username_and_password(self):
    my_network_service = MyNetworkService('foo', 'bar')
    self.mock(urllib2.OpenerDirector, 'open')
    urllib2.OpenerDirector.open(mox.IgnoreArg()).AndReturn(MockResponse('''30000ACCT_LOGIN_FAILED7'''))
    self.replay_all()

    self.assertEqual(False, my_network_service.login())
    self.mox.UnsetStubs()
    self.mox.VerifyAll()
```

If there's a better way, I'd love to hear your suggestions.
