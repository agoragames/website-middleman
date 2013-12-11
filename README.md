# website-middleman

For ease of hosting, this site is built on [Middleman](http://middlemanapp.com), a static site generator written in Ruby.

## Editing the site

Run `bundle install`, then `middleman server`, then point your browser at `http://localhost:4567/` to view your local copy of the site.

Template files in the `source` directory are automatically mapped to the equivalent `.html` path in the generated site. The `source/templates` directory contains layouts and partials, and the `source/assets` directory contains images, stylesheets, etc.

Middleman will watch for changes made to any of these files and show the updates after a reload in your browser.

You may see this warning in your shell while Middleman is running its server on localhost: _Option :locals is not supported by Slim::Engine_; this can safely be ignored. See [middleman#612](https://github.com/middleman/middleman/issues/612).

## Deploying the site

Run `rake publish`