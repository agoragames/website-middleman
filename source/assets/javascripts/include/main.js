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

	$.localScroll();

});
