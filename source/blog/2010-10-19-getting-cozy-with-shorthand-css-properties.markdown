---
title: Getting Cozy with Shorthand CSS Properties
author: Joshua Childs
---
I pride myself in being forgetful, but sometimes this can have unfortunate consequences. For instance, whenever I want to use the [css background shorthand property](http://www.devarticles.com/c/a/Web-Style-Sheets/CSS-shorthand-at-a-glance/3/) I simply can't remember the order.

In case you aren't aware, the background shorthand basically allows you to specify a background all at once, that would otherwise need to be specified with multiple rules.

For example

```css
background-color: black
background-attachment: fixed
background-position: left top
background-repeat: no-repeat
background-image: url(example.gif)
```

simply becomes

```css
background: url(example.gif) no-repeat fixed left top black
```

And the whole world is happy...

As I mentioned the problem is I find it difficult to remember the order, and it seems that there is an order that should be followed, if for no reason other than consistency. As a result I always find myself turning to Google to remember what that order is. This is frustrating, but even more frustrating Google never returns the result I'm looking for and I end up leafing through several results to eventually stumble upon a code example that can help me.

Well, not anymore! Turns out there is an easier way then this and one which doesn't require me to resort to hardcore memorization (my only weakness). As anyone who really knows me is already aware, I love [Firebug](http://getfirebug.com/). The reasons go on and on, but now I have a new one. Firebug automatically fixes the background style rule providing the complete and proper format. If you specify a background rule and just give it say a color, or take your best shot at specifying all the properties you need then leave the style pane for a second or two and close your eyes, by the time you come back Firebug would have parsed and updated your best effort with the correct format. How nice.

Once I realized this, I couldn't help but share my excitement with some of the fellows around the office. Well, our new teammate Nick pointed out that it would be cool if this worked for the font shorthand as well; I thought so too. As it turns out however, it does not. That's really too bad, but maybe we will see this feature come along in the future. I think it would be a welcomed addition all around to an already spectacular tool. Thanks Firebug!

For anyone who wants to know a little more about all the CSS shorthand rules here is a [nice article I found on the nets about it](http://www.devarticles.com/c/a/Web-Style-Sheets/CSS-shorthand-at-a-glance/).
