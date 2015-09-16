$(document).on 'change', '.file-wrapper input[type="file"]', (e) ->
  file_input = $(this)
  button = file_input.closest('.file-wrapper').find('.button')
  filename = file_input.val()
  button.filter('.file').toggleClass('hide', !filename)
  button.filter('.no-file').toggleClass('hide', !!filename)
  if filename
    # "C:\fakepath\foo.jpg" => "foo.jpg"
    (filename = filename.split('\\').pop()) if filename
    button.filter('.file').html(filename).prepend(' ')
