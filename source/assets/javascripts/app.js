//= require 'foundation/js/vendor/jquery'
//= require 'foundation/js/foundation/foundation'
//= require 'foundation/js/foundation/foundation.orbit'
//= require 'foundation/js/foundation/foundation.tab'
//= require 'foundation/js/foundation/foundation.topbar'
//= require '_countup'
//= require '_waypoints'
//= require '_jquery.easing'
//= require '_polyfill.requestanimationframe'

$('[data-orbit]').each(function () {
  $(this).find('[data-background]').each(function () {
    slide = $(this);
    // Need to write directly to the 'style' attribute to work with Orbit plugin
    slide.attr('style', 'background-image: url("' + slide.data('background') + '")');
  });
});

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

/** Animated navigation window scrolling */
$('[data-anchor]').on('click', function(e) {
  if ($(this).attr('href').indexOf('#') != 0) { return; }
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

  (function () {

    var fpsInterval, now, then, elapsed;

    function scrollSpy() {
      $('[data-anchor]').each(function() {
        if ($(this).attr('href').indexOf('#') != 0) { return; }
        var $panel = $('a[id=' + $(this).attr('href').replace('#', '') + ']');
        if ($panel.length == 0) {
          return;
        }
        if (scrollTop > $panel.offset().top - 100) {
          $('[data-anchor]').not(this).parent().removeClass('active');
          $(this).parent().addClass('active');
        }
      });
    }

    function startAnimating(fps) {
      fpsInterval = 1000 / fps;
      then = Date.now();
      animate();
    }

    function animate() {
      requestAnimationFrame(animate);
      now = Date.now();
      elapsed = now - then;
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        scrollSpy();
      }
    }

    startAnimating(5);

  })();

}
