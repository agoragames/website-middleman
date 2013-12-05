---
title: HTML and CSS Horizontal Delimited Navigation Done Right
author: Joshua Childs
---
When we, as front-end developers, set out to build a horizontal site navigation, what markup come to mind? Thoughts of a standard semantic design pattern, an unordered list (UL) with list items (LI) floated to one side, possibly with delimited items to help visually separate each link.



 This design pattern generally produces markup that looks something like:

 {% gist 704052 %}

 And styling like:
 {% gist 704057 %}

 This doesn't look so bad, but there's a problem. Those pipes (|) don't belong in the markup. Because they don't describe any piece of the document, and they are not content, they are purely presentational. As such, they belong in the presentation layer (stylesheets).

 For a some time now, front-end developers have had to settle for mixing content and presentation in order to maintain a single experience across browsers and platforms due to inconsistent implementations of css2.

 Today, notions of one user experience for a website have been shattered by paradigm shifts such as increased market penatration of mobile browsing devices. This shift combined with improved client support for css2 and css3 modules, as seen in IE9pr3, has given us the freedom to build similar but different experiences for users. We are free to build on strengths of each browser while accepting that some browsers may not fully support the presentational features desired.

 With that in mind:

 {% gist 704060 %}

 Our navigation markup now looks the way it should, meaning it's a list of links in no particular order, with only relevant content. There are no pipes (|) or other delimiters meant only for presentation purposes. The wrapping DIV element has been substituted with a NAV element to be more descriptive.

 The following CSS does the same basic styling as the first, but notice the last two rules.
 {% gist 704064 %}

 The last two rules are how we're able to put those delimiters in the presentation layer. Let's take a closer look.
 {% gist 704067 %}

 This rule is adding the pipe (|) delimiter to all of the list (LI) element that have nav.site-nav as their ancestor.
 {% gist 704069 %}

 And here we look up the last list item (LI) of our unordered list (UL) and remove the pipe delimiter (|) we added with the previous rule.

 Some of you may be saying that this won't work in all browsers (< IE9pr3, < FF3, < Safari4, ect). This is true, it won't work in all browsers, but when you're thinking about doing something like this, ask yourself, "Do I need this for users to be able to use my site?" If yes, then by all means put those load bearing delimiters in your markup. If no, enjoy the knowledge that you can have a more semantic html document, a stylesheet file that takes advantage of modern implementations of css, and a flexible user experience that degrades gracefully in older browsers. Make the move to more cleanly separated content and presentation layers.

 You can find more of my musings on the Twitters,  [@JoshuaChilds](http://twitter.com/JoshuaChilds).
