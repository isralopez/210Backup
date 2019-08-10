<script type="text/javascript">
  $(".iframe").colorbox({iframe:true, width:"90%", height:"90%"});

  $(document).ready(function(){
  var id_micro_site = 0;
  var tmp_color = ['Blues','Greens','Greys','Oranges','Purples','Reds','BuGn','BuPu','GnBu','OrRd','PuBuGn','PuBu','PuRd','RdPu','YlGnBu','YlGn','YlOrBr','YlOrRd'];
  var tmp_thematic = ['Circulos','Red', 'Circulos Lineales', 'Lapidarium', 'Blog', 'Blog-Temas', 'Temas'];
  var minimize_cat = false;
  var minimize_other_cat = false;
  var minimize_nar = false;
  var minimize_other_nar = false;
  var minimize_menu = false;
  var categorys_ls = [];

  var id_color = 0;

  id_color = {{ms.color}};
  id_thematic = {{ms.thematic}};
  id_color_old = id_color;
  id_ms = {{ms.id}};
  id_color_old[id_ms] = id_color;
  id_micro_site = id_ms;
  var gray_colors = {{ms.gray_colors|yesno:"true,false"}};

  if (gray_colors) {
      $('#grays').prop('checked', true);
  }

  var color_theme = tmp_color[id_color];
  var thematic_ms = tmp_thematic[id_thematic];
  // var combo_thems = "<select id='ms_theme_cb_"+id_ms+"'' class='ms_themes_cb'><option value='0'>template_dark-blue</option>";
  var combo_thems = "<select class='ms_themes_palet' id='palet_ms'><option value='0' data-image='{{STATIC_URL}}idegeo/ms/images/Blues.png' ></option>"; //<option value="Blues" data-image="{{STATIC_URL}}idegeo/ms/images/Blues.png"></option>";
  var combo_thematic = "<select id='ms_thematic_cb_"+id_ms+"'' class='ms_thematic_cb'><option value='0'>Circulos</option>";

    //FORMATOS DE PRESENTACION
    if(id_thematic==1){combo_thematic += "<option value='1' selected>Red</option>";}
    else{combo_thematic += "<option value='1'>Red</option>";
    }
    if(id_thematic==2){combo_thematic += "<option value='2' selected>Circulos Lineales</option>";}
    else{combo_thematic += "<option value='2'>Circulos Lineales</option>";
    }
    if(id_thematic==3){combo_thematic += "<option value='3' selected>Lapidarium</option>";}
    else{combo_thematic += "<option value='3'>Lapidarium</option>";
    }
    if(id_thematic==4){combo_thematic += "<option value='4' selected>Blog</option>";}
    else{combo_thematic += "<option value='4'>Blog</option>";
    }
    if(id_thematic==5){combo_thematic += "<option value='5' selected>Blog-Temas</option>";}
    else{combo_thematic += "<option value='5'>Blog-Temas</option>";
    }
    if(id_thematic==6){combo_thematic += "<option value='6' selected>Temas</option>";}
    else{combo_thematic += "<option value='6'>Temas</option>";
    }
    if(id_thematic==7){combo_thematic += "<option value='7' selected>Slider</option>";}
    else{combo_thematic += "<option value='7'>Slider</option>";
    }
    if(id_thematic==8){combo_thematic += "<option value='8' selected>Smooth Scroll</option></select>";}
    else{combo_thematic += "<option value='8'>Smooth Scroll</option></select>";
    }

    //OPCIONES DE TONOS DE PALETAS
    if(id_color==1){combo_thems += "<option value='1' data-image='{{STATIC_URL}}idegeo/ms/images/Greensi.png' selected></option>";}
    else{combo_thems += "<option value='1' data-image='{{STATIC_URL}}idegeo/ms/images/Greensi.png'></option>";
    }
    if(id_color==2){combo_thems += "<option value='2'  data-image='{{STATIC_URL}}idegeo/ms/images/Greys.png' selected></option>";}
    else{combo_thems += "<option value='2' data-image='{{STATIC_URL}}idegeo/ms/images/Greys.png'></option>";
    }
    if(id_color==3){combo_thems += "<option value='3' data-image='{{STATIC_URL}}idegeo/ms/images/Oranges.png' selected></option>";}
    else{combo_thems += "<option value='3' data-image='{{STATIC_URL}}idegeo/ms/images/Oranges.png'></option>";
    }
    if(id_color==4){combo_thems += "<option value='4' data-image='{{STATIC_URL}}idegeo/ms/images/Purples.png' selected></option>";}
    else{combo_thems += "<option value='4'data-image='{{STATIC_URL}}idegeo/ms/images/Purples.png'></option>";
    }
    if(id_color==5){combo_thems += "<option value='5' data-image='{{STATIC_URL}}idegeo/ms/images/Reds.png' selected></option>";}
    else{combo_thems += "<option value='5' data-image='{{STATIC_URL}}idegeo/ms/images/Reds.png'></option>";
    }
    if(id_color==6){combo_thems += "<option value='6' data-image='{{STATIC_URL}}idegeo/ms/images/BuGn.png' selected></option>";}
    else{combo_thems += "<option value='6' data-image='{{STATIC_URL}}idegeo/ms/images/BuGn.png'></option>";
    }
    if(id_color==7){combo_thems += "<option value='7' data-image='{{STATIC_URL}}idegeo/ms/images/BuPu.png' selected></option>";}
    else{combo_thems += "<option value='7' data-image='{{STATIC_URL}}idegeo/ms/images/BuPu.png' ></option>";
    }
    if(id_color==8){combo_thems += "<option value='8' data-image='{{STATIC_URL}}idegeo/ms/images/GnBu.png' selected></option>";}
    else{combo_thems += "<option value='8' data-image='{{STATIC_URL}}idegeo/ms/images/GnBu.png'></option>";
    }
    if(id_color==9){combo_thems += "<option value='9' data-image='{{STATIC_URL}}idegeo/ms/images/OrRd.png' selected></option>";}
    else{combo_thems += "<option value='9' data-image='{{STATIC_URL}}idegeo/ms/images/OrRd.png'></option>";
    }
    if(id_color==10){combo_thems += "<option value='10' data-image='{{STATIC_URL}}idegeo/ms/images/PuBuGn.png' selected></option>";}
    else{combo_thems += "<option value='10' data-image='{{STATIC_URL}}idegeo/ms/images/PuBuGn.png' ></option>";
    }
    if(id_color==11){combo_thems += "<option value='11' data-image='{{STATIC_URL}}idegeo/ms/images/PuBu.png' selected></option>";}
    else{combo_thems += "<option value='11' data-image='{{STATIC_URL}}idegeo/ms/images/PuBu.png' ></option>";
    }
    if(id_color==12){combo_thems += "<option value='12' data-image='{{STATIC_URL}}idegeo/ms/images/PuRd.png' selected></option>";}
    else{combo_thems += "<option value='12' data-image='{{STATIC_URL}}idegeo/ms/images/PuRd.png' ></option>";
    }
    if(id_color==13){combo_thems += "<option value='13' data-image='{{STATIC_URL}}idegeo/ms/images/RdPu.png' selected></option>";}
    else{combo_thems += "<option value='13' data-image='{{STATIC_URL}}idegeo/ms/images/RdPu.png' ></option>";
    }
    if(id_color==14){combo_thems += "<option value='14' data-image='{{STATIC_URL}}idegeo/ms/images/YlGnBu.png' selected></option>";}
    else{combo_thems += "<option value='14' data-image='{{STATIC_URL}}idegeo/ms/images/YlGnBu.png'></option>";
    }
    if(id_color==15){combo_thems += "<option value='15' data-image='{{STATIC_URL}}idegeo/ms/images/YlGn.png' selected></option>";}
    else{combo_thems += "<option value='15' data-image='{{STATIC_URL}}idegeo/ms/images/YlGn.png' ></option>";
    }
    if(id_color==16){combo_thems += "<option value='16' data-image='{{STATIC_URL}}idegeo/ms/images/YlOrBr.png' selected></option>";}
    else{combo_thems += "<option value='16' data-image='{{STATIC_URL}}idegeo/ms/images/YlOrBr.png' ></option>";
    }
    if(id_color==17){combo_thems += "<option value='17' data-image='{{STATIC_URL}}idegeo/ms/images/YlOrRd.png' selected></option>";}
    else{combo_thems += "<option value='17' data-image='{{STATIC_URL}}idegeo/ms/images/YlOrRd.png'></option>";
    }
    combo_thems += "</select>";

  $("#theme_ms_"+id_ms).html(combo_thems);
  $("#thematic_ms_"+id_ms).html(" <span class='ms_themes_cb'> "+combo_thematic+" </span>");
  $("#img_"+id_ms+"_theme").html('<iframe src="{{site}}{{ms.url_name}}" width="590" height="800"/>');

   //This code is for logos's combos
   try {$("#palet_ms").msDropDown();} catch(e) {alert(e.message);
   }

  $(".img_theme").mouseenter(function() {
    $('.themes_modal').show();
  });
  $(".img_theme").mouseleave(function() {
    $('.themes_modal').hide();
  });
  $(".img_theme").click(function() {
    $('.themes_modal').hide();
  });

  $(".ms_themes_palet").change(function(){
      var id_color = $("#palet_ms option:selected").val();
      query_data = {
        'id_ms':id_micro_site,
        'id_color': id_color
      }
      $.ajax({
        data: {'query_data': JSON.stringify(query_data),
             csrfmiddlewaretoken: '{{ csrf_token }}'
            },
        url: '{% url "ms_save_color" %}',
        type: 'POST',
        success : function(data) {
          // console.log('<iframe src="{{site}}'+data[0]+'" width="590" height="800"/>');
          $("#img_"+id_ms+"_theme").html('<iframe src="{{site}}'+data[0]+'" width="590" height="800"/>');
        },
        error : function(message) {
                console.log(message);
             }
        });
  });

  $("#grays").change(function(){
      var grays = $(this).is(':checked');
      query_data = {
        'id_ms':id_micro_site,
        'grays': grays
      }

      $.ajax({
        data: {'query_data': JSON.stringify(query_data),
             csrfmiddlewaretoken: '{{ csrf_token }}'
            },
        url: '{% url "ms_grays" %}',
        type: 'POST',
        error : function(message) {
                console.log(message);
             }
        });
  });

  $(".ms_thematic_cb").change(function(){
      var id_ms_compuest = $(this).attr('id');

      var id_ms_compuest_array = id_ms_compuest.split("_");
      var id_ms = id_ms_compuest_array[3];

      var id_tematics = $("#ms_thematic_cb_"+id_ms+" option:selected").val();

      query_data = {
        'id_ms':id_ms,
        'id_tematics': id_tematics
      }
      $.ajax({
        data: {'query_data': JSON.stringify(query_data),
             csrfmiddlewaretoken: '{{ csrf_token }}'
            },
        url: '{% url "ms_save_thmatizing" %}',
        type: 'POST',
        success : function(data) {

          // console.log('<iframe src="{{site}}'+data[0]+'" width="590" height="800"/>');
          $("#img_"+id_ms+"_theme").html('<iframe src="{{site}}'+data[0]+'" width="590" height="800"/>');
        },
        error : function(message) {
                console.log(message);
             }
        });
  });


  $(".minimize_ms").click(function(){
  if (minimize_cat) {
        $(".ms-hide-cat").show();
        $(".minimize_ms").html('<i class="fa fa-compress fa-1x" title="Minimizar"></i>');
        minimize_cat  = false;
  }else{
        $(".ms-hide-cat").hide();
        $(".minimize_ms").html('<i class="fa fa-expand fa-1x" title="Maximizar"></i>');
        minimize_cat  = true;
  }
  });

  $(".ms-minimize-other-cat").click(function(){
  if (minimize_other_cat) {
        $(".ms-hide-cat-other").show();
        $(".ms-minimize-other-cat").html('<i class="fa fa-compress fa-1x" title="Minimizar"></i>');
        minimize_other_cat  = false;
  }else{
        $(".ms-hide-cat-other").hide();
        $(".ms-minimize-other-cat").html('<i class="fa fa-expand fa-1x" title="Maximizar"></i>');
        minimize_other_cat  = true;
  }
  });

  $(".ms-minimize-nar").click(function(){
  if (minimize_cat) {
        $(".ms-hide-nar").show();
        $(".ms-minimize-nar").html('<i class="fa fa-compress fa-1x" title="Minimizar"></i>');
        minimize_cat  = false;
  }else{
        $(".ms-hide-nar").hide();
        $(".ms-minimize-nar").html('<i class="fa fa-expand fa-1x" title="Maximizar"></i>');
        minimize_cat  = true;
  }
  });

  $(".ms-minimize-nar-other").click(function(){
  if (minimize_other_cat) {
        $(".ms-hide-nar-other").show();
        $(".ms-minimize-nar-other").html('<i class="fa fa-compress fa-1x" title="Minimizar"></i>');
        minimize_other_cat  = false;
  }else{
        $(".ms-hide-nar-other").hide();
        $(".ms-minimize-nar-other").html('<i class="fa fa-expand fa-1x" title="Maximizar"></i>');
        minimize_other_cat  = true;
  }
  });

  $(".ms-minimize-menu").click(function(){
  if (minimize_menu) {
        $(".ms-hide-menu").show();
        $(".ms-minimize-menu").html('<i class="fa fa-compress fa-1x" title="Minimizar"></i>');
        minimize_menu  = false;
  }else{
        $(".ms-hide-menu").hide();
        $(".ms-minimize-menu").html('<i class="fa fa-expand fa-1x" title="Maximizar"></i>');
        minimize_menu  = true;
  }
  });

  $(".ms-cat-cb").change(function(){
    var cat = $(".ms-cat-cb option:selected").val();

    query_data = {
        'id_ms':id_ms,
        'cat': cat
      }
      $.ajax({
        data: {'query_data': JSON.stringify(query_data),
             csrfmiddlewaretoken: '{{ csrf_token }}'
            },
        url: '{% url "ms_search_narrative" %}',
        type: 'POST',
        success : function(cats) {
          $(".ms-tbody-cat").html("");
          for (i = 0; i < cats.length; i++) {
             var site_edit = cats[i][4]+"ms_update_narrative/"+cats[i][3]+"/"+id_ms+"";
             var site_meta = cats[i][4]+"ms_update_narrative_meta/"+cats[i][3]+"/"+id_ms+"";
             var site_delete = cats[i][4]+"remove_nar/"+cats[i][3]+"/"+id_ms+"";
             $(".ms-tbody-cat").append('<tr class="ms-hide-nar-other"><td colspan="3">'+cats[i][0]+'</td><td>'+cats[i][1]+'</td><td>'+cats[i][2]+'</td><td><span class="edit-nar" id="'+site_meta+'"><i class="fa fa-bars fa-1x" title="Editar Metadato" aria-hidden="true"></i></span></td><td><span class="edit-meta" id="'+site_edit+'"><i class="fa fa-file-text-o fa-1x" title="Editar Narrativa" aria-hidden="true"></i></span></td><td><span class="delete-nar" id="'+site_delete+'"><i class="fa fa-trash fa-1x" title="Eliminar Narrativa" aria-hidden="true"></i></span></td></tr>');
          }
        },
        error : function(message) {
                console.log(message);
             }
        });
  });

  $('.ms-cat-parent-cb').change(function(){
  var cat = $(".ms-cat-parent-cb option:selected").val();
    if (cat==0) {
      return;
    }
    query_data = {
        'id_ms':id_ms,
        'cat': cat
      }
      $.ajax({
        data: {'query_data': JSON.stringify(query_data),
             csrfmiddlewaretoken: '{{ csrf_token }}'
            },
        url: '{% url "ms_search_cat" %}',
        type: 'POST',
        success : function(data) {
          var categories = data;
          $(".ms-tbody-cat-padre").html("");
          for (i = 0; i < categories.length; i++) {
            var cat_name = categories[i][0];
            var cat_father = categories[i][1];
            var cat_desc = categories[i][2];
            var cat_id = categories[i][3];
            var cat_site = categories[i][4];

            var site_add_cat = ""+cat_site+"up_cat_to_cat/"+cat_id+"/"+id_ms+"";
            var site_edit = ""+cat_site+"update_cat_ms/"+id_ms+"/"+cat_id+"";
            var site_delete = ""+cat_site+"remove_cat/"+cat_id+"/"+id_ms+"";
            $(".ms-tbody-cat-padre").append('<tr class="ms-hide-nar-other"><td colspan="2">'+cat_name+'</td><td>'+cat_father+'</td><td><span class="add-cat" id="'+site_add_cat+'"><i class="fa fa-plus fa-1x" title="Agregar una categoria a '+cat_name+'" aria-hidden="true"></i></span></td><td><span class="edit-cat" id="'+site_edit+'"><i class="fa fa-pencil fa-1x" title="Editar Categoria" aria-hidden="true"></i></span></td><td><span class="delete-cat" id="'+site_delete+'"><i class="fa fa-trash fa-1x" title="Eliminar Categoria" aria-hidden="true"></i></span></td></tr>');
          }
        },
        error : function(message) {
                console.log(message);
             }
        });
  });

  $('.ms-tbody-cat').on("click","span.edit-nar", function(e){
  id_nar_full = $(this).attr("id");
  window.location.href = id_nar_full;
  });

  $('.ms-tbody-cat').on("click","span.edit-meta", function(e){
  id_nar_full = $(this).attr("id");
  window.location.href = id_nar_full;
  });

  $('.ms-tbody-cat').on("click","span.delete-nar", function(e){
  id_nar_full = $(this).attr("id");
  window.location.href = id_nar_full;
  });

  $('.ms-tbody-cat-padre').on("click","span.edit-cat", function(e){
  id_nar_full = $(this).attr("id");
  window.location.href = id_nar_full;
  });

  $('.ms-tbody-cat-padre').on("click","span.add-cat", function(e){
  id_nar_full = $(this).attr("id");
  window.location.href = id_nar_full;
  });

  $('.ms-tbody-cat-padre').on("click","span.delete-cat", function(e){
  id_nar_full = $(this).attr("id");
  window.location.href = id_nar_full;
  });
  });
</script>
