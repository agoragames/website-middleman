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
  blog.layout = "blog_post"
  blog.default_extension = ".markdown"
  blog.year_link = "{year}/index.html"
  blog.month_link = "{year}/{month}/index.html"
  blog.day_link = "{year}/{month}/{day}/index.html"
  blog.calendar_template = "blog/calendar.html"
  blog.paginate = true
end

# GitHub Pages wants 404.html, not 404/index.html
page '/404.html', :directory_index => false

# The relative_assets setting doesn't play particularly nicely with
# directory_indexes, but we don't really need it, since we're hosting
# the site at a domain root.
#
# activate :relative_assets

# This has to go AFTER the blog config section.
# See https://coderwall.com/p/qgnwzw
activate :directory_indexes
activate :automatic_image_sizes

sprockets.append_path(File.join(root, 'bower_components'))

compass_config do |config|
  config.output_style = :nested
  config.add_import_path(
    File.join(root, 'bower_components', 'foundation', 'scss'))
end

configure :build do

  ignore 'templates/layouts/*'
  ignore 'templates/partials/*'

  # Quicker to render HTML without proper indenting, and since we're going to
  # minify it anyway, there's no reason to bother with it.
  set :haml, ugly: true

  activate :minify_html do |html|
    # Foundation has specific styles for inputs with type="text", so we don't
    # want to remove that (even though it's the default input type).
    html.remove_input_attributes = false
    html.remove_http_protocol = false
    html.remove_https_protocol = false
  end

  activate :minify_css
  activate :minify_javascript
  activate :asset_hash

end
