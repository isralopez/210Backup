<script type="text/javascript">

var sty_dict = {{sty_dict|safe}};
var mv_id = {{ mviewer.id }};
var topic_id;

$.each(sty_dict, function(k,v){
    var mySelect = $('select[name="' + k + '"]');
    $.each(v, function(key,val){
        if(val!= mySelect.val()){
            html = '<option value="'+val+'">'+val+'</option>';
            mySelect.append(html);
        }
    });
});

$(".add-layers-btn").click(function() {
    topic_id = $(this).attr('data-id');
});

$(".minimize-menu").click(function() {
    topic_id = $(this).attr('data-id');
    var obj = "#top-"+topic_id+'-head';
    if ($(obj).is(":visible")) {
      $(obj).hide();
      $("#top-"+topic_id+'-lays').hide();
      $("i", this).attr("class", "fa fa-expand");
      $("i", this).attr("title", "Mostrar Capas");
      $("#top-"+topic_id).css("background","");

      if ($("#topic-layers-div").is(":visible")) {
        $("#topic-layers-div").hide();
      }
    } else {
      $(obj).show();
      $("#top-"+topic_id+'-lays').show();
      $("i", this).attr("class", "fa fa-compress");
      $("i", this).attr("title", "Oculta Capas");
      $("#top-"+topic_id).css("background","aliceblue");
    }
});

$(".td-layers").on('change', 'select', function() {
    var reg_id = $(this).closest('div').attr('data-regid');
    var select_name = $(this).attr('name');
    var opt = $(this).val();

    var data = {
            'reg_id': reg_id,
            'style_select': opt
        };
    $.ajax({
      url: '{% url "set_layer_style" %}',
      type: 'POST',
      data: {'data': JSON.stringify(data),
             csrfmiddlewaretoken: '{{ csrf_token }}'
            },
      dataType: 'html',
      success: function(result) {

      },
      error : function(xhr,errmsg,err) {
          console.log('Error en el servidor')
          console.log(xhr.status + ": " + xhr.responseText);
      }
    });
});

$(".td-layers").on('click', '.fa-square-o', function() {
    var parent_id = $(this).closest('div').attr('id');
    var reg_id = $(this).attr('data-regid');

    var data = {
            'reg_id': reg_id,
        };

    $.ajax({
      url: '{% url "tlayer_on" %}',
      type: 'POST',
      data: {'data': JSON.stringify(data),
             csrfmiddlewaretoken: '{{ csrf_token }}'
            },
      dataType: 'html',
      success: function(result) {
          $('#'+parent_id).find('.fa-square-o').attr('class', 'fa fa-check-square-o');
      },
      error : function(xhr,errmsg,err) {
          console.log('Error en el servidor')
          console.log(xhr.status + ": " + xhr.responseText);
      }
    });
});

$(".td-layers").on('click', '.fa-check-square-o', function() {
    var parent_id = $(this).closest('div').attr('id');
    var reg_id = $(this).attr('data-regid');

    var data = {
            'reg_id': reg_id,
        };

    $.ajax({
      url: '{% url "tlayer_off" %}',
      type: 'POST',
      data: {'data': JSON.stringify(data),
             csrfmiddlewaretoken: '{{ csrf_token }}'
            },
      dataType: 'html',
      success: function(result) {
          $('#'+parent_id).find('.fa-check-square-o').attr('class', 'fa fa-square-o');
      },
      error : function(xhr,errmsg,err) {
          console.log('Error en el servidor')
          console.log(xhr.status + ": " + xhr.responseText);
      }
    });
});


$(".td-layers").on('click', '.fa-trash', function() {
    var parent_id = $(this).closest('div').attr('id');
    var reg_id = $(this).attr('data-regid');

    var rmv_data = {
            'reg_id': reg_id,
        };

    $.ajax({
      url: '{% url "remove_topic_layer" %}',
      type: 'POST',
      data: {'rmv_data': JSON.stringify(rmv_data),
             csrfmiddlewaretoken: '{{ csrf_token }}'
            },
      dataType: 'html',
      success: function(result) {
          $('#'+parent_id).remove();
      },
      error : function(xhr,errmsg,err) {
          console.log('Error en el servidor')
          console.log(xhr.status + ": " + xhr.responseText);
      }
    });
});

//$(".minimize-menu-wms").click(function() {
//    tool_id = $(this).attr('tool-id');
//    var obj = "#tool-"+tool_id+"-head";
//    if ($(obj).is(":visible")) {
//      $(obj).hide();
//      $("#tool-"+tool_id+"-lays").hide();
//      $("i", this).attr("class", "fa fa-expand");
//      $("i", this).attr("title", "Mostrar Capas");
//      $("#tool-"+tool_id).css("background","");
//
//      if ($("#topic-layers-div").is(":visible")) {
//        $("#topic-layers-div").hide();
//      }
//    } else {
//      $(obj).show();
//      $("#tool-"+tool_id+"-lays").show();
//      $("i", this).attr("class", "fa fa-compress");
//      $("i", this).attr("title", "Oculta Capas");
//      $("#tool-"+tool_id).css("background","aliceblue");
//    }
//});
//
  /* Sort topics */
  $(function () {
    $(".ms-hide-menu").sortable({
      tolerance: 'pointer',
      revert: 'invalid',
      items: "> tr.topic-sort",
      placeholder: 'placeholder',
      forcePlaceholderSize: true,
      forceHelperSize: true,
      axis: "y",
      cancel: ".top-tools, .top-exp",
      cursor: "row-resize",
      stop: function(event, ui) {
        var sortedIDs = $(this).sortable('toArray');
        $.ajax({
          url: '{% url "sort_topic" %}',
          type: 'POST',
          data: {'sorted_ids': JSON.stringify(sortedIDs),
                 csrfmiddlewaretoken: '{{ csrf_token }}'
                },
          error : function(xhr,errmsg,err) {
              console.log('Error en el servidor')
              console.log(xhr.status + ": " + xhr.responseText);
          }
        });
      }
    });
  });

  /* Sort layers */
  $(function () {
    $(".td-layers").sortable({
      tolerance: 'pointer',
      revert: 'invalid',
      items: "div.sort_layer",
      placeholder: 'placeholder',
      forcePlaceholderSize: true,
      forceHelperSize: true,
      axis: "y",
      cancel: ".lay-tools, .select-style",
      cursor: "row-resize",
      stop: function(event, ui) {
        var sortedIDs = $(this).sortable('toArray', {attribute: 'data-regid'});
        $.ajax({
          url: '{% url "sort_layer" %}',
          type: 'POST',
          data: {'sorted_ids': JSON.stringify(sortedIDs),
                 csrfmiddlewaretoken: '{{ csrf_token }}'
                },
          error : function(xhr,errmsg,err) {
              console.log('Error en el servidor')
              console.log(xhr.status + ": " + xhr.responseText);
          }
        });
      }
    });
  });
</script>
