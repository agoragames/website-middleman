jQuery.fn.slideFadeIn = function(speed, easing, callback) {
  return this.animate({opacity: '1.0', height: 'show'}, speed, easing, callback);  
};

jQuery.fn.slideFadeOut = function(speed, easing, callback) {
  return this.animate({opacity: 0, height: 'hide'}, speed, easing, callback);  
};
