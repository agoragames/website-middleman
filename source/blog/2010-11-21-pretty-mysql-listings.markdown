---
title: Pretty MySQL listings
author: Jason LaPorte
---
Tired of MySQL wrapping long rows when running selects from the command line?  Here's a crazy useful tip:  add \G to the end of your 'select' statement and your output will go from gobbledygook to great.

 Here's an example:

 {% gist 709399 %}
