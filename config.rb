set :css_dir, 'assets/stylesheets'
set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'
set :fonts_dir, 'assets/fonts'

set :layouts_dir, 'templates/layouts'
set :partials_dir, 'templates/partials'

# This causes too many problems, e.g. when visiting /blog instead of
# /blog/ (the relative links to blog posts resolve differently)
#
# set :relative_links, true

activate :blog do |blog|
  blog.prefix = "blog"
  blog.permalink = ":year/:month/:day/:title"
  blog.layout = "blog"
  blog.default_extension = ".markdown"

  blog.year_link = "{year}/index.html"
  blog.month_link = "{year}/{month}/index.html"
  blog.day_link = "{year}/{month}/{day}/index.html"
  blog.calendar_template = "blog/calendar.html"
end

# This has to go AFTER the blog config section.
# See https://coderwall.com/p/qgnwzw
activate :directory_indexes
activate :asset_hash
activate :automatic_image_sizes

# The relative_assets setting doesn't play particularly nicely with
# directory_indexes, but we don't really need it, since we're hosting
# the site at a domain root.
#
# activate :relative_assets

Slim::Engine.set_default_options :format => :html5
Slim::Engine.set_default_options :pretty => true

compass_config do |config|
  config.output_style = :nested
end

configure :build do

  ignore "templates/layouts/*"
  ignore "templates/partials/*"

  Slim::Engine.set_default_options :pretty => false

  activate :minify_css
  activate :minify_javascript

end
