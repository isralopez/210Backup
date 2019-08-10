<script type="text/javascript">
		/*******************************************************
		    TEMPLATE-CHANGE [CHANGE-CLASS]
		*******************************************************/

		var tmp_color = ['Blues','Greens','Greys','Oranges','Purples','Reds','BuGn','BuPu','GnBu','OrRd','PuBuGn','PuBu','PuRd','RdPu','YlGnBu','YlGn','YlOrBr','YlOrRd'];
        var ramp = tmp_color[{{config.color}}];
        var ramp_colors = cbrewerHex9[ramp];
        var gray_colors = {{config.gray_colors|yesno:"true,false"}};

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
			if (varChildsNum === 7) {
				$(varParent).children('.row-item').addClass('col-xs-6 col-sm-4 col-md-4');
			}
			if (varChildsNum === 8) {
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

	$(document).ready(function(){
	    $( "iframe.iframe-nw" ).wrap( '<div class="embed-responsive embed-responsive-16by9"></div>' );
		$( "iframe.iframe-fw" ).wrap( '<div class="embed-responsive embed-responsive-fw embed-responsive-16by9"></div>' );
		//Imagen full-width
		$( ".imgfw" ).wrap( '<figure class="full-width"></figure>' );
		$( ".imgfw" ).css('width', '100%');
		$( ".imgfw" ).css('height', 'auto');
		//ATL de la imagen
		$("img.imgfw").wrap('<div class="alt-wrap"/>');
        $("img.imgfw").each(function() {
            var alt = $(this).attr('alt');
            if(alt.length >= 3){
                $(this).after('<p class="alt">' + $(this).attr('alt') + '</p>');
            }
        });



		if (!gray_colors) {
           //HEADER
					  $('.btn-size-type').css('color', ramp_colors[7]);
						// $('.title-hov-size:hover').css('color', ramp_colors[7]);
						$('.title-hov-size').hover(function(){$(this).css('color', ramp_colors[7]);});
            $('#admin').css("background-color", ramp_colors[1]);
            $('#admin .admin-nav a.nav-btn').css("color", ramp_colors[7]);
            $('#admin .admin-nav a.nav-btn').hover(function() {$(this).css("color", ramp_colors[5]);}, function() {$(this).css("color", ramp_colors[7]);}); //hover: primero se indica el tono final y despues el inicial

            //HEADER TIPO SLIDER
            $('#topbar-fixed').css("background-color", 'rgba(0, 0, 0, 0.70)');
            // $('#topbar-fixed a').css("background-color", ramp_colors[1]);
            // $('#topbar-fixed a').css("color", ramp_colors[7]);
            $('#slidenav .nav-label').css("background-color", ramp_colors[1]);
            $('#slidenav a').css("color", ramp_colors[7]);
            // $('#topbar-fixed a').hover(function() {$(this).css("color", ramp_colors[5]);}, function() {$(this).css("color", ramp_colors[7]);}, function() {$(this).css("border-color", ramp_colors[7]);});
            $('.bttn-primary').css("background-color", ramp_colors[4]);
            $('.bttn-primary').css("border-color", ramp_colors[4]);
            $('.bttn-primary').css("color", ramp_colors[7]);

            //COMMENTS
            //$('#section_face').css("background-color", ramp_colors[9]);
            //$('#section_content').css("background-color", ramp_colors[9]);
            $('#section_content a').css("color", "#333333" );
            $('#section_content a').hover(function() {$(this).css("color", ramp_colors[6]);}, function() {$(this).css("color",  "#333333");});
            $('#section_others').css("background-color", ramp_colors[9]);
            $('#section_others a').css("color", "#333333");
            $('#section_others a').hover(function() {$(this).css("color", ramp_colors[6]);}, function() {$(this).css("color", "#333333");});

            //FOOTER SUPERIOR
            $('#bottom-nav').css("background-color", ramp_colors[3]);
            $('#bottom-nav a').css("color", ramp_colors[6]);
            $('#bottom-nav a').hover(function() {$(this).css("color", ramp_colors[8]);}, function() {$(this).css("color", ramp_colors[6]);});
            //FOOTER INFERIOR
            $('#footer').css("background-color", ramp_colors[7]);
            $('#footer a').css("color", ramp_colors[1]);
            //BOTON
            $('.btn-primary').css("background-color", ramp_colors[4]);
            $('.btn-primary').css("border-color", ramp_colors[4]);
            $('.btn-primary').css("color", ramp_colors[7]);
            //BOTON HOVER
            $('.btn-primary').hover(function() {$(this).css("background-color", ramp_colors[7]);}, function() {$(this).css("background-color", ramp_colors[4]);});
            $('.btn-primary').hover(function() {$(this).css("border-color", ramp_colors[7]);}, function() {$(this).css("border-color", ramp_colors[4]);});
            $('.btn-primary').hover(function() {$(this).css("color", ramp_colors[1]);}, function() {$(this).css("color", ramp_colors[7]);});
        }else{
					 $('.btn-size-type').css('color','#333');
				}
	});
</script>
