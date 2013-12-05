$(function(){
		
	// Main Slider
	$(".slides").slides({
		effect:'fade',
		fadeSpeed:750,
		autoHeight:true,
		play:5000,
		container:'slides-container'
	});

	// Job listing slider
	$("#positions").slides({
		effect:'fade',
		fadeSpeed:200,
		autoHeight:true,
		container:'jobs-container',
		generatePagination:false,
		paginationClass:'inline-buttons'
	});
	
	// Some equal height goodness
	$("#perks .box").equalHeights();
	$("#home .box").equalHeights();
	$("#what-we-do-blocks .pad").equalHeights();
	// $("#open-source li a").equalHeights(100, 200);
	
	// Conditional form field display
	$("#conditional").css('display', 'none');
	$(".radio").click(function() {
		if ($('input[name=position]:checked').val() != "producer") {
			$("#conditional").slideFadeIn();
		} else {
			$("#conditional").slideFadeOut();
		}
	});
	
	// Form validation
	$('#apply-form').validate({
		rules:{
			position: "required",
			name: "required",
			email: {
				required: true,
				email: true
			}
		},
		messages: {
			position: "You need to pick a position",
			name: "Don't you have a name?",
			email: "Make sure it's a real address"
		},
		errorPlacement: function(error, element) {
			if ( element.is(":radio") )
				error.appendTo( element.parent().next().next() );
			else if ( element.is(":checkbox") )
				error.appendTo ( element.next() );
			else
				error.appendTo( element.parent() );
			},
	});
	
	$('#contact-form').validate({
		rules:{
			name: "required",
			email: {
				required: true,
				email: true
			},
			company: "required",
			phone: "required",
			message: "required"
		},
		messages: {
			name: "Let us know who you are.",
			email: "Make sure it's a real address.",
			company: "Let us know where you work.",
			phone: "Let us know where to call you back.",
			message: "Let us what you're looking for."
		},
		errorPlacement: function(error, element) {
			if ( element.is(":radio") )
				error.appendTo( element.parent().next().next() );
			else if ( element.is(":checkbox") )
				error.appendTo ( element.next() );
			else
				error.appendTo( element.parent() );
			},
	});

	$.localScroll();

});