---
title: 'Python Is Mocking Me: A Ruby Programmer''s Adventures With Python/Mox'
author: Tim Jones
---
**Overview**

 Much of Agora's work over the last few years has been done in Ruby. Recently though, we're migrating major components to Python in order to enjoy the benefits of cross platform compatibility with Windows. The purpose of this post is to discuss testing in Python; specifically mocking.

 Coming from Ruby I've so far found the mocking frameworks in Python somewhat lacking. I haven't found a case where I've been unable to implement a particular test in Python but I've certainly found myself doing a lot more typing than I would in Ruby/Mocha. Perhaps this is just a sign that the Python libraries need further abstraction to provide higher-level interfaces. I think it also points to the fact that metaprogramming magic is much simpler in Ruby.

 A quick and dirty list of some available mocking frameworks can be found here ( [http://pycheesecake.org/wiki/PythonTestingToolsTaxonomy#MockTestingTools](http://pycheesecake.org/wiki/PythonTestingToolsTaxonomy#MockTestingTools)). We chose Mox primarily because it presented most of the functionality we were used to with Mocha and the interface was concise (relatively speaking...).

 **The Basics**

 Mox uses a record/replay format for creating mocks. Mocks are initialized with the system in record mode. All method calls executed on the mocks are recorded in order to be played back later. This is similar to Mocha, although Mocha makes this less explicit and does not enforce order. For comparison:

 Ruby/Mocha:

```ruby
class Foo
  def do_something
    self.first_thing
    self.second_thing
  end
end

f = Foo.new
f.expects(:second_thing).once
f.expects(:first_thing).once

f.do_something
```

 Python/Mox:

```python
class Foo(object):
  def do_something(self):
    self.first_thing()
    self.second_thing()

self.mox = mox.Mox()
f = self.mox.CreateMock(Foo)

f.first_thing()
f.second_thing()
self.mox.ReplayAll()

f.do_something()
self.mox.VerifyAll()
```

 Note, these are not complete examples and they will not run by themselves. We'll get to that in a bit. The important thing is that, in the Python/Mox version, we're doing a bit of recording until we get to ReplayAll(). At that point we stop recording and start executing the methods that will cause the recorded portion to be repeated by our running code. Mox checks off each method as it's called and raises exceptions if a call is not expected.

 **The Complete Example**

 Mox provides a handy subclass of unittest.TestCase that takes care of a few things for you. First, self.mox is instantiated in setUp method so you don't have to worry about doing that yourself. Second, and this is left out of the example above, it introduces some metaclass magic that unsets stubs and executes VerifyAll() to confirm that all expectations were met during execution (see the Mox documentation for an explanation of unsetting stubs). The complete code would look something like this:

```python
import mox
from foo import Foo

class FooTest(mox.MoxTestBase):
  def test_do_something(self):
    f = self.mox.CreateMock(Foo)

    f.first_thing()
    f.second_thing()
    self.mox.ReplayAll()

    f.do_something()
```

 If you want to mock an entire object this is great. It's relatively clean and gets the job done. But what if I want to stub out a single method of an already instantiated object? Enter StubOutWithMock.

```python
class FooTest(mox.MoxTestBase):
  def test_do_something(self):
    f = Foo()
    self.mox.StubOutWithMock(f, 'second_thing')

    f.second_thing()
    self.mox.ReplayAll()

    f.do_something()
```

 In this example I've instantiated my own instance of Foo and allowed the first_thing method to get called normally. The second_thing method is mocked out. I could add return values and whatnot to the mock here if necessary.

 These are just two simple examples but they'll cover a lot of cases. Mox really handles them quite well. Where I think it starts to fall behind Mocha is when it comes to dealing with more complex tasks such as introducing mocks for locally instantiated objects. Ultimately I think the Mox library just needs a bit more abstraction to handle these cases.

 **The Hard(er) Stuff**

 Some folks  [(http://googletesting.blogspot.com/2008/08/by-miko-hevery-so-you-decided-to.html]((http://googletesting.blogspot.com/2008/08/by-miko-hevery-so-you-decided-to.html)) are of the opinion that your code should be written with testing in mind. I couldn't disagree more (although I think there are many good points that can be taken from that article for reasons outside of testing). I should _not_ have to change the way I write code to make up for flaws in my testing framework. In some languages it may not be possible to support every test case without some extra consideration (compiled, strongly-typed, minimal-reflection languages come to mind although I've had excellent luck with MockItNow ( [http://code.google.com/p/mockitnow/](http://code.google.com/p/mockitnow/)) for C++ under Visual Studio) but we're working with highly abstracted scripting languages here! There really shouldn't be a reason to change the way you code just to support testing. Let's see what we can do.

 **Local Object Construction**

Note: Since this post was original written I've been shown a much more elegant way to mock local object construction. See comment #6 for details.

In the everything's-an-object land of Python and Ruby objects are instantiated left and right. Most are created in local scopes. What happens when you want to mock out methods of an object that's instantiated inside of a function? Take the following code:

```python
class Bar(object):
  def do_something(self, something):
  o = SomeOtherClass()
  result = o.crazy_thing_not_to_be_tested(something)
  return self.do_something_else(result)
```

 In our unit test what we really want to do is make sure that the result of crazy_thing_not_to_be_tested is being passed to do_something_else. Since the implementation of crazy_thing_not_to_be_tested is crazy (and because this is a unit test, not a functional one) we want to mock it out and return something simple. With Mocha I could use SomeOtherClass.any_instance but there's no such abstraction in Mox. An alternative might be to change our implementation so that the SomeOtherClass instance is passed to our method instead of being instantiated by it. In some cases this may work but what if the SomeOtherClass object needs to be initialized with private members of Bar? Furthermore this means you're writing your code for your tests and not vice versa (there are other reasons, unrelated to testing, for why you might be better off passing in the object rather than instantiating it locally but that's outside the scope of this post). It turns out that the Python solution is to mock out the class method that actually instantiates the object.

 Object allocation in Python is a two step process. First the instance is allocated and then the constructor (__init__) is called. This is similar to Ruby's allocate/initialize setup. The allocate equivalent for Python is __new__. This method can be mocked like any other.

 ```python
 bar = Bar()
 self.mox.StubOutWithMock(bar, 'do_something_else')
 self.mox.StubOutWithMock(SomeOtherClass, '__new__')

 mocked_some_other_class = self.mox.CreateMockAnything()
 SomeOtherClass.__new__(SomeOtherClass, ).AndReturn(mocked_some_other_class)
 mocked_some_other_class.crazy_thing_not_to_be_tested('something').AndReturn('something_else')
 mocked_bar.do_something_else('something_else')
 self.mox.ReplayAll()

 mocked_bar.do_something_else('something')
 ```

 **Skipping Constructors**

 With our new knowledge of __new__ it becomes easier to take care of a few more problems. Say your constructor does something that you really don't want to have executed for every test. There's a good argument here that you shouldn't be doing real work in your constructor anyway but in some cases it is desirable. At any rate, one solution is to instantiate the object using __new__ without calling __init__. This could be done in your setUp method so that you have the object available for every test in your test case.

```python
class SomethingTest(mox.MoxTestBase):
  def setUp(self):
    mox.MoxTestBase.setUp(self)

    self.something = Something.__new__(Something)
```

 Note that the __new__ method takes the class object as its first argument. You may need to pass in additional arguments for __init__ (although it's never called) to match the function definition.

 Later, if you actually want the constructor to be called, you can do so explicitly.

```python
def a_test(self):
  self.something.__init__(*args)
```

 **Mocking Modules**

 Modules are nothing special, including those that are part of standard libraries. Mock away!

```python
import os

self.mox.StubOutWithMock(os, 'listdir')
os.listdir(".").AndReturn(["a_dir", "a_link", "cat.py", "dog.py", "goat.txt", ".svn"])
```

 **Mocking Builtin Methods**

 The route to mocking builtin methods is a bit more involved but not terribly so. The first question is how to access the methods to mock them. StubOutWithMock takes an object and the name of the method to mock. We know the name of the method but what's the object? For those with Python experience it will seem obvious that the answer is the __builtin__ module which houses all of Python's builtin methods. The way I found to access that module was via sys.modules:

```python
import sys

self.mox.StubOutWithMock(sys.modules['__builtin__'], 'open')

stream = self.mox.CreateMockAnything()
sys.modules['__builtin__'].open('foo.yml', 'r').AndReturn(stream)
```

 **Mocking Your Parents**

 Sometimes its necessary to prevent the super class implementation of a method from being called during a test. This is actually very easy to accomplish and the implementation is relatively intuitive.

 To call a parent class implementation in Python you'd do something like this:

```python
class HouseCat(Feline):
  def walk(self):
    self.act_crazy()
    Feline.walk(self)
```

 All we're doing is passing self directly to the Feline implementation of the walk method. So, all we need to do to mock out the Feline version is:

```python
self.mox.StubOutWithMock(Feline, 'walk')

cat = HouseCat()
Feline.walk(cat)
self.mox.ReplayAll()

cat.walk()
```

 Now self.act_crazy will be executed but the super class implementation of walk will be mocked out.

 **Sorting Out Errors With MockAnything**

 There's a bug of sorts when using the MockAnything class that causes fun problems ( [http://code.google.com/p/pymox/issues/detail?id=3](http://code.google.com/p/pymox/issues/detail?id=3)) when Mox attempts to print out results of a failed method call. The output from Mox usually consists of a series of "Expected X. Got Y" statements. Well when X or Y includes a MockAnything object we run into a bit of a catch 22. Python attempts to convert the instance to a string using __repr__ but, since we're mocking anything, we don't have a real implementation for that method and the object raises an exception to say that the method call for __repr__ was unexpected. Currently the authors of Mox have not submitted a solution to this problem but there's a relatively naive one you can use yourself... Just implement the __repr__ method explicitly for MockAnything objects. Be aware that this will likely (I haven't tried it) block attempts to mock the __repr__ method itself and may cause unexpected issues later on.

 In the class definition for MockAnything (roughly ln 265 in mox.py) add the following:

  ```python
    def __str__(self):
      return ""

    def __repr__(self):
      return self.__str__()
  ```

 MockAnything instances will then be rendered as in your error output.

 **Misc Trivia/Pointers/Gotchas**

- Everything is an object in Python so there's probably some way to mock everything
- Use mox.MoxTestBase as the parent class for all your tests where mocking will be used
- If you do this and you have your own setUp method declaration be sure to call the parent class implementation!
- Don't forget to call self.mox.ReplayAll() before you actually kick off the replay portion of your test
