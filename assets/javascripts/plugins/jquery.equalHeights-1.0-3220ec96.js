!function(e){e.fn.equalHeights=function(t,n){return tallest=t?t:0,this.each(function(){e(this).height()>tallest&&(tallest=e(this).height())}),n&&tallest>n&&(tallest=n),this.each(function(){e(this).height(tallest).css("overflow","auto")})}}(jQuery);