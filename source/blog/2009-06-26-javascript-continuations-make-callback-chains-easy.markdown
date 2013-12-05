---
title: Javascript Continuations Make Callback Chains Easy
author: Jason LaPorte
---
The problem: I define hooks for callbacks in my javascript libraries. The functions for these hooks could be defined anywhere and tend to overwrite each other. When you want to write a callback you have to understand what the entire system is doing.



 The solution: Instead of defining single functions for callbacks, maintain a list of them and then build a chain of continuations. Here is the completed code for managing our callbacks: [http://gist.github.com/136525](http://gist.github.com/136525). This expands on Jason's continuations: [http://lonelypinkelephants.com/continuing.html](http://lonelypinkelephants.com/continuing.html).

 The old way was to do something like this:

```javascript
 // file 1
 Controllers.Hydra = {
 on_load : function() {
 do_whatever_is_defined_by_default()
 }
 }
```

```javascript
 // file 2
 Controllers.Hydra = {
 on_load : function() {
 do_something()
 do_this_other_thing()
 do_whatever_is_defined_by_default()
 }
 }
```

 And then in the code that actually cares:

```html
onload="Controllers.Hydra.on_load()"
```

 This means the overloading method must know about what the default behavior is and it can only be overloaded once.

 The new (awesome) way:

```javascript
 // file 1
 Callbacks.add(Callbacks.Hydra.on_load, do_whatever_is_defined_by_default)
```

 And:

```javascript
 // file 2
 Callbacks.add(Callbacks.Hydra.on_load, do_something)
 Callbacks.add(Callbacks.Hydra.on_load, do_this_other_thing)
```

 And in the code that actually fires the callback:

```html
 onload="Callbacks.start(Callbacks.Hydra.on_load)"
```

 The callbacks are called in order.

 What else can we do with this? One of the features I like about Rails is that if a callback or filter returns false the rest of the chain is halted. We've included that behavior too (This doesn't necessarily affect what ever called start on the callback chain).
