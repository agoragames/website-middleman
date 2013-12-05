---
title: As It Turns Out, Faking It Is OK
author: David Czarnecki
---
This post is totally SFW. That's all your going to get in this teaser.

 ![when_harry_met_sally](/uploads/2010/04/themarketingblog_e_a001438922.JPG "when_harry_met_sally")

 I just inherited an application and was adding some tests and noticed that one of the tests was randomly failing. As I dug in more, this particular controller test, in executing the controller's index method, was actually calling out on the intertubes to request some data. For an integration test that's probably OK, but my view is that unit and functional tests should be self-contained.

 Enter [Fakeweb](http://github.com/chrisk/fakeweb).

 "FakeWeb is a helper for faking web requests in Ruby. It works at a global level, without modifying code or writing extensive stubs."

 3 lines of code later and I have a self-contained functional test that works with real data.

```ruby
def setup
  FakeWeb.allow_net_connect = false
end

def teardown
  FakeWeb.allow_net_connect = true
end

test "should get index" do
  FakeWeb.register_uri(:get, 'http://my.real.url.on.the.internets.com', :body => File.join(File.dirname(__FILE__), '../fakeweb', 'some-file.xml'), :content_type => "text/xml")

  get :index
  assert_response :success

 ...

```

 All I needed to do was simply register the URI that was being referenced in my test, provide a valid (or invalid depending on the test) response, and my test will never try to access the real internet.
