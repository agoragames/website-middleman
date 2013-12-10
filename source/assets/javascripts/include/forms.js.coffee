# Conditional form field display
$("#conditional").css('display', 'none')

$(".radio").click ->
  if $('input[name=position]:checked').val() != "producer"
    $("#conditional").slideFadeIn()
  else
    $("#conditional").slideFadeOut()

# Form validation
$('#apply-form').validate
  rules:
    Field10: "required"
    Field4: "required"
    Field5:
      required: true
      email: true
  messages:
    Field10: "You need to pick a position"
    Field4: "Don't you have a name?"
    Field5: "Make sure it's a real address"
  errorPlacement: (error, element) ->
    if element.is(":radio")
      error.appendTo(element.closest('.radio'))
    else if element.is(":checkbox")
      error.appendTo(element.next())
    else
      error.appendTo(element.parent())

$('#contact-form').validate
  rules:
    Field4: "required"
    Field5:
      required: true
      email: true
    Field6: "required"
    Field8: "required"
    Field9: "required"
  messages:
    Field4: "Let us know who you are."
    Field5: "Make sure it's a real address."
    Field6: "Let us know where you work."
    Field8: "Let us know where to call you back."
    Field9: "Let us know what you're looking for."
  errorPlacement: (error, element) ->
    if element.is(":radio")
      error.appendTo(element.parent().next().next())
    else if element.is(":checkbox")
      error.appendTo(element.next())
    else
      error.appendTo(element.parent())

if ($('#wufoo-iframe').length > 0) and ($('#wufoo-thanks').length > 0)

  $('form.wufoo').each () ->
    form = $(this)
    form
      .attr('target', 'wufoo-iframe')
      .on 'submit', (e) ->
        if form.hasClass('disabled')
          e.preventDefault()
        form.addClass('disabled')

  setup_thanks = () ->
    $('#wufoo-iframe').on 'load', ->
      window.location = $('#wufoo-thanks').attr('href')

  window.setTimeout setup_thanks, 1000
