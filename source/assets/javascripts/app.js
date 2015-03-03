//= require 'foundation/js/vendor/jquery'
//= require 'foundation/js/foundation'
//= require '_countup'
//= require '_waypoints'
//= require '_owl.carousel'
//= require '_jquery.easing'
//= require '_polyfill.requestanimationframe'

$(document).foundation();

$('[data-countup]').each(function(i) {
  $(this).removeClass('is-counting');
  // var startVal = $(this).data('countup') - (($(this).data('countup') / 100) * 60);
  var startVal = 0;
  var numAnim = new countUp(this, startVal, $(this).data('countup'), 0, 1.5);
  var position = $(this).position();
  $(this).waypoint(function() {
    $(this).addClass('is-counting');
    if(numAnim.remaining == null) {
      setTimeout(function() {
        numAnim.start();
      }, 100*i);
    }
  }, { offset: '90%' });
});

$('[data-owl]').each(function() {
  $(this).owlCarousel({
    items: 4
  });
});

/** Animated navigation window scrolling */
$('[data-anchor]').on('click', function(e) {
  e.preventDefault();
  var $panel = $('a[id=' + $(this).attr('href').replace('#', '') + ']');
  // Wait for mobile nav to close.
  setTimeout(function() {
    $('html, body').animate({
      scrollTop: $panel.offset().top - 90
    }, {
      duration: 600,
      easing: 'easeInOutCirc'
    });
  }, 30);
});

if(!Modernizr.touch) {

  var scrollTop = $(window).scrollTop();

  $(window).scroll(function() {
    scrollTop = $(this).scrollTop();
  });

  var scrollSpy = function() {
    $('[data-anchor]').each(function() {
      var $panel = $('a[id=' + $(this).attr('href').replace('#', '') + ']');
      if ($panel.length == 0) { return; }
      if(scrollTop > $panel.offset().top - 100) {
        $('[data-anchor]').not(this).parent().removeClass('active');
        $(this).parent().addClass('active');
      }
    });
  };

  (function animate() {
    requestAnimationFrame(animate);
    scrollSpy();
  })();

}
