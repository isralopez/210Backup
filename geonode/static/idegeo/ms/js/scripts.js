jQuery(function ($) {

	'use strict';

	$(document).ready(function () {

		/*******************************************************
		    TEMPLATE-CHANGE [CHANGE-CLASS]
		*******************************************************/

		$('#template-nav span').click(function (event) {
			var templateChange = $(event.target).attr('class');
			$('#body').attr('class', templateChange);
		});

		/*******************************************************
		    HEADER-TITLE [HEIGHT]
		*******************************************************/

		funcHeaderTitle();

		/*******************************************************
		    SECTION [MAIN-NEXT]
		*******************************************************/

		$('#main').next().addClass('main-next');

		/*******************************************************
		    SECTION ROW [COLUMN]
		*******************************************************/

		var varParent;
		var varChildsNum;

		$('.section-row').each(function () {
			varParent = this;
			varChildsNum = $(this).children('.row-item').length;
			funcRowColumn();
		});

		/*******************************************************
		    BOOTSTRAP [MODAL]
		*******************************************************/

		$("#modal").modal('hide');
		var modalItem;
		var modalBody;
		var modalClass;
		$('.modal_acerca, .modal_marco-conceptual').click(function (event) {
			event.preventDefault();
			modalItem = $('#modal');
			modalBody = modalItem.find('.modal-body');
			modalClass = $(event.target).attr('class');
			var classSplit = modalClass.split(' ');
			var className;
			classSplit = classSplit.map(function (value) {
				if (value.indexOf("modal_") !== -1) {
					className = value;
					//return value;
				}
			});
			modalBody.load(className + '.html');
			modalItem.modal('show');
		});

		/*******************************************************
		   FUNCTION: WINDOW-RESIZE
		*******************************************************/

		$(window).resize(function () {

			/* HEADER-TITLE [HEIGHT]*/

			funcHeaderTitle();

			/* SECTION ROW [COLUMN] */

			$('.section-row').each(function () {
				varParent = this;
				varChildsNum = $(this).children('.row-item').length;
				funcRowItems();
			});

		});
		//}).resize();

		/* ***************************************************************
			FUNCTION: HEADER-TITLE [HEIGHT]
		*************************************************************** */

		function funcHeaderTitle() {
			if (window.matchMedia('(min-width: 767px)').matches) {
				if ($('#header .header-title').height() > 60) {
					$('#header .header-title').css('margin-top', '12px');
				} else {
					$('#header .header-title').css('margin-top', '24px');
				}
			} else {
				$('#header .header-title').css('margin-top', '10px');
			}
		}

		/*******************************************************
			FUNCTION: SECTION ROW [COLUMN]
			xs:0, sm:576px, md:768px, lg:992px, xl:1200px
		*******************************************************/

		function funcRowColumn() {
			$(varParent).addClass('row-items-num' + varChildsNum);
			if (varChildsNum === 1) {
				$(varParent).children('.row-item').addClass('col-xs-12 col-sm-12 col-md-12');
			}
			if (varChildsNum === 2) {
				$(varParent).children('.row-item').addClass('col-xs-6 col-sm-6 col-md-6');
			}
			if (varChildsNum === 3) {
				$(varParent).children('.row-item').addClass('col-xs-6 col-sm-4 col-md-4');
			}
			if (varChildsNum === 4) {
				$(varParent).children('.row-item').addClass('col-xs-6 col-sm-6 col-md-3');
			}
			if (varChildsNum === 5) {
				$(varParent).children('.row-item').addClass('col-xs-6 col-sm-4 col-md-4');
			}
			if (varChildsNum === 6) {
				$(varParent).children('.row-item').addClass('col-xs-6 col-sm-4 col-md-4');
			}
			funcRowItems();
		}

		function funcRowItems() {
			var lisInRow = 0;
			$(varParent).children('.row-item').each(function () {
				if ($(this).prev().length > 0) {
					if ($(this).position().top !== $(this).prev().position().top) {
						return false;
					}
					lisInRow++;
				} else {
					lisInRow++;
				}
			});
			var varChildsCol = varChildsNum % lisInRow;
			if (varChildsCol === 0) {
				varChildsCol = lisInRow;
			}
			//console.log('NUM: ' + varChildsNum + ' COL: ' + varChildsCol);
			var varChildTarget = (varChildsNum - varChildsCol) + 1;
			$(varParent).children('.row-item').css('padding-bottom', '30px');
			$(varParent).children('.row-item:nth-child(n+' + varChildTarget + ')').css('padding-bottom', '0px');
		}

	});

});
