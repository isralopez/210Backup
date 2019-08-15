<script type="text/javascript">
$(document).ready(function(){
	$('.nav-child').on("click", ".category", function(e){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(".eb-post").css("display","block");
			}
		else {
			$('.category').removeClass('active');
			$(this).addClass('active');
			$(".eb-post").css("display","none");
			$("."+ $(this).children('a').attr('id')).css("display","block");
		}
	});
});
</script>