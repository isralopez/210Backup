<script type="text/javascript">
  var progress = setInterval(function () {
    var $bar = $("#bar");
    $bar.width($bar.width() + 700);
  }, 800);
  /*Eliminar  footer*/
  $('#bottom-nav').css('display', 'none');
  $('#footer').css('display', 'none');
  $('#home-container').css('display', 'none');


  $(window).load(function() {
  	$("body").animate({scrollTop: 0}, 100);
    $("#bar").width($(this).width());
    $(".loader").fadeOut(1500);
  });

  $(function(){
	  $('#portfolio-grid').mixItUp();
	});

  $('.filter').click( function(){
  	$('.toggleDiv').slideUp();
  	$('#text_search_input_l').val('');
  	$('#portfolio-grid .thumbnail').css('display', 'block');
  });
  $( "#text_search_input_l" ).bind('keyup', function(e) {
      $('.toggleDiv').slideUp();
  });
  $('.toggleDiv .show_hide').click( function(){
  	$('.toggleDiv').slideUp();
  });
  $('#portfolio-grid .show_hide').click( function(){
  	var rel = $(this).attr('rel');
  	$('.toggleDiv').slideUp();
  	$(rel).slideDown();
    var img_alto = $(rel+' .project-img').height();
    var title_alto = $(rel+' .project-title').height();
    $(rel+" .project-info").height(img_alto-title_alto-60);
  });

  /*Buscador por texto*/
  $('input#text_search_input_l').quicksearch('ul#portfolio-grid div.thumbnail');
      // helper functions
    function getUrlParam(paramName) {
        var reParam = new RegExp('(?:[\?&]|&amp;)' + paramName + '=([^&]+)', 'i') ;
        var match = window.location.search.match(reParam) ;

        return (match && match.length > 1) ? match[1] : '' ;
    }
    // embedder
    $('.embed').on('click', function() {
        var funcNum = getUrlParam('CKEditorFuncNum');
        var fileUrl = $(this).attr('href');
        fileUrl = unescape(encodeURIComponent(fileUrl));
        window.opener.CKEDITOR.tools.callFunction(funcNum, fileUrl);
        window.close();
    });
</script>