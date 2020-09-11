"use strict";

var Sidebar = function(){

	var $document = $(document),
		$side_panel = $(".e_side_panel_js"), // page sidebar itself
		$side_panel_button = $(".e_header_button"), // sidebar toggle icon
		$side_panel_header = $(".e_header"), // component that contains sidebar toggle icon
		$sidebarItem = $(".e_side_panel_item");

	$side_panel_button.on('click', function(e){
		var $target = $(e.target);

		if ($target.closest($side_panel_button).length) {
			$side_panel.addClass('is_visible');
			return false;
		}
	});

	$document.on('click', function(e) {
		var $target = $(e.target);
		if (!$target.closest($side_panel).length) {
			$side_panel.removeClass('is_visible');
		}
	});
};

// var Modal = function(){
// 	var $document = $(document),
// 		$modal_button = $(".e_modal_button"), 
// 		$modal_panel = $(".e_modal"),
// 		$modal_body = $('.modal_content'),
// 		$modal_close = $('.modal_close');
	

// 	$modal_button.on('click', function(e){
// 		var $target = $(e.target);
// 		if( $(this).data('show') !== ''){
// 			$('#'+ $(this).data('show')).addClass('modal_active');
// 			$('body').css('overflow-y','hidden');
// 			return false;
// 		}
// 	});

// 	$modal_close.on('click', function(e){
// 		var $target = $(e.target);
// 		if ($target.closest($modal_close).length) {
// 			$modal_panel.removeClass('modal_active');
// 			$('body').css('overflow-y','auto');
// 		}
// 	});

// 	$document.on('click', function(e) {
// 		var $target = $(e.target);
// 		if (!$target.closest($modal_body).length) {
// 			$modal_panel.removeClass('modal_active');
// 		}
// 	});
// }

$(function(){
	Sidebar();
	// Modal();
});