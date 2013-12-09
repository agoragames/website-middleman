set :css_dir, 'assets/stylesheets'
set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'
set :fonts_dir, 'assets/fonts'

set :layouts_dir, 'templates/layouts'
ignore "templates/layouts/*"

set :partials_dir, 'templates/partials'
ignore "templates/partials/*"

activate :asset_hash
activate :automatic_image_sizes

activate :blog do |blog|
  blog.prefix = "blog"
  blog.permalink = ":year-:month-:day-:title.html"
  blog.layout = "blog"
  blog.default_extension = ".markdown"

  blog.year_link = "{year}.html"
  blog.month_link = "{year}/{month}.html"
  blog.day_link = "{year}/{month}/{day}.html"
  blog.calendar_template = "blog/calendar.html"
end

Slim::Engine.set_default_options :format => :html5
Slim::Engine.set_default_options :pretty => true

compass_config do |config|
  config.output_style = :nested
end

configure :build do

  Slim::Engine.set_default_options :pretty => false

  activate :minify_css
  activate :minify_javascript
  activate :relative_assets

end
