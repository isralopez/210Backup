<script type="text/javascript">
/* =========================@QMAP CODE===================================== */
  /* Save New or update QuickMap */
  $('#save_form').on('submit', function(event){
    map_id = $('#map_id').val();
    save_qmap(event, map_id);
  });

  /* Save as New QuickMap */
  $("#savenewMap").click(function(event) {
    map_id = null;
    save_qmap(event, map_id);
  });

  $("save_form input[type=submit]").click(function() {
    $("input[type=submit]", $(this).parents("save_form")).removeAttr("clicked");
    $(this).attr("clicked", "true");
  });

  function save_qmap(event, map_id) {
      event.preventDefault();
      var layer_list = [];

      var mapBaseSelected = $('input[name=baseLayers]:checked').val();
      var saveLayers = [];
      var layerBase = {
                "title": mapBaseSelected,
                "typename": mapBaseSelected.replace(/ /g,''),
                "group":"background",
                'bbox': [-180, -90, 180, 90],
                'ows_url': '',
                'abstract': 'Mapa Base'
              };
      layer_list.push(layerBase);
      $($(".rowlegend").get().reverse()).each(function(index) {
        var idLayerSelect = $(this).attr("id").slice(1, -1);;
        var y0 = $('#'+idLayerSelect+' .layerRow').attr('data-y0'),
            x0 = $('#'+idLayerSelect+' .layerRow').attr('data-x0'),
            y1 = $('#'+idLayerSelect+' .layerRow').attr('data-y1'),
            x1 = $('#'+idLayerSelect+' .layerRow').attr('data-x1');
        var bbox = [x0, y0, x1, y1];
        var typename = $(this).attr("typename");
        var title = $(this).attr("data-title");
        var ows_url = $('#'+idLayerSelect+'i').attr('href');
        var abstract = $('#'+idLayerSelect+'i').attr('data-info');

        var layer_element = {
            'title': title,
            'typename': typename,
            "group":'',
            'bbox': bbox,
            'ows_url': ows_url,
            'abstract': abstract
        };
        layer_list.push(layer_element);
      });

      var map_title = $('#title').val(),
          map_abstract = $('#abstract').val();
      var zoom = map.getZoom();
      var center = map.getCenter();

      map_data = {
        'map_id': map_id,
        'map_title': map_title,
        'map_abstract': map_abstract,
        'layer_list': layer_list,
        'zoom': zoom,
        'center': center,
        //'opacity': layer_opacity,
      }

      $.ajax({
        url: '{% url "save_quickmap" %}',
        type: 'POST',
        data: {'map_data': JSON.stringify(map_data),
               csrfmiddlewaretoken: '{{ csrf_token }}'
              },
        dataType: 'json',
        success: function(result) {
            $("#savedMsg").show().delay(4000).fadeOut();
            $('#map_id').val(result.id);
            if (map_id == '') {
                $("#qmaps-elements ul").append('<li id="qmap'+result.id+'"><div class="rowlegend"><div class="qmap-opt">'+
                '<div class="tools"><i class="fa fa-times" data-id='+result.id+'></i><a href="#" class="map_option" id='+result.id+'>'+result.title+'</a></div>'+
                '<i class="abstract">'+result.abstract+'</i><br><i id="del-qmap-'+result.id+'" class="fa fa-square-o" data-id="'+result.id+'" style="display:none; float:right;">¿Eliminar objeto?</i>'+
                '</div></div></li><br>');
            }
        },
        error : function(xhr,errmsg,err) {
            console.log('Error en el servidor')
            console.log(xhr.status + ": " + xhr.responseText);
        }
      });
  }

  function do_map(data) {
    var layers = data.map.layers;
    map.setView(data.map.center, data.map.zoom);

    for (var i = 0; i < layers.length; i++) {
        if (layers[i].group == 'background'){
            $('input[name=baseLayers]:radio').filter('[value="'+layers[i].title+'"]').trigger('click');
        } else {
          var dataId = 'gen-lay'+i;
          var dataInfo = layers[i].abstract;
          var checkId = i;
          var layer = L.tileLayer.betterWms(data.sources[i].url, {
              format: 'image/png',
              transparent: true,
              layers: layers[i].name
          });
          map.addLayer(layer);
          layer.setOpacity(layers[i].opacity);
          layer.bringToFront();
          checkboxes.push(layer);

          theLegend = '<div id="l'+dataId+'" data-checkid="'+checkId+'" class="rowlegend"><div class="l-title"><i data-toggle="tooltip" title="Desactivar" class="fa fa-check-square" data-id="l'
            + dataId+'" data-checkid="'+checkId+'"></i> '+layers[i].title+'</div><div class="rlayer">'
            + '<div class="tools" style="display:none;"><i data-toggle="tooltip" title="Leyenda" data-id="l'+dataId+'" class="fa fa-list-alt"></i><i data-toggle="tooltip" title="Opacidad" data-id="l'+dataId+'" class="fa fa-arrows-h"></i>'
            + '<i title="Descargar capa" class="fa fa-download" data-toggle="modal" data-target="#download-layer" data-name="'+layers[i].name+'" data-id="l'
            + dataId+'"></i><i title="Descargar meta-data" class="fa fa-file-text" data-url="/layers/'+layers[i].name+'/pdf_metadata_layer"></i>'
            + '<i title="Descripción" class="fa fa-info" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="left" data-content="'+dataInfo+'"></i></div>'
            + '</div><i data-toggle="tooltip" title="Herramientas" data-id="l'+dataId+'" class="vtools animationTransition fa fa-chevron-left"></i>'
            + '<div class="thumb""><a class="thumbnail2" href="#" data-image-id="" data-title="'+layers[i].title+'" data-image="'
            + data.sources[i].url+'" data-target="#image-gallery"><img src="'+data.sources[i].url+'?request=GetLegendGraphic&format=image%2Fpng&width=15&height=15&layer='
            + layers[i].name+'&transparent=true" title="'+layers[i].title+'"/></a></div>'
            + '<div class="slider"><div class="cslide"><div id="'+dataId+'s" title="'+layers[i].title+'" data-checkid="'+checkId+'" data-id="l'+dataId+'"></div></div><span>100%</span></div></div>';

            $( "#addlegend" ).prepend(theLegend);
            imgGallery();

            /* Save Qmap Button behavior */
            if(checkboxes.length > 0) {
              $("#save-qmap").show();
              $(".toolsSelected").show();
            }else{
              $("#save-qmap").hide();
              $(".toolsSelected").hide();
            }

            /*Slider*/
            d3.select('#'+dataId+'s').call(d3.slider().value(100).on("slide", function(evt, value) {
              var element_slider = evt.toElement.title;
              var element_id = evt.toElement.id;
              var post = $('#'+element_id).attr('data-checkid');
              var num = value/100;
              num = num.toFixed(2);
              checkboxes[post].setOpacity(num);
              num = (num*10).toFixed()*10;
              d3.select('#'+ $('#'+element_id).attr('data-id') + ' .slider span').text(num.toFixed()+"%");
            }));
            $("#l"+dataId+ " .slider").slideToggle('slow');
        }
    }

    if($( ".layerMenu2" ).hasClass( "lm-closed" )){
      var window_w = $( window ).width();
      if(window_w >= 1080) {
        $(".layerMenu2").removeClass( "translateLayerListRight2" ).removeClass( "lm-closed" ).addClass( "translateLayerListLeft2" );
        $(".fa-list").removeClass( "fa-list" ).addClass( "fa-caret-right" );
      }
    }
  };

  /* Get Quickmap*/
  $('#qmaps-elements').on('click', '.map_option', function() {
        resetMap();
        id = $(this).attr('id');
        $.ajax({
            url: '{% url "qmap_data" %}',
            type: 'POST',
            data: {'mapid':id, csrfmiddlewaretoken: '{{ csrf_token }}'},
            dataType: 'json',
            success: function(data) {
                $('#title').val(data.about.title);
                $('#abstract').val(data.about.abstract);
                $('#map_id').val(id);
                $('#btnSaveMap').val('Actualizar');
                $('#savenewMap').css('display','block');
                do_map(data);
                $("#save-qmap").show();
            },
        });
  });

  $('#qmaps-elements').on('click', '.fa-times', function() {
    id = $(this).attr('data-id');
    if($("#del-qmap-"+id).is(':visible')){
        $("#del-qmap-"+id).hide();
    }
    else{
        $("#del-qmap-"+id).show();
    }
  });

    /*Delete Qmap*/
  $('#qmaps-elements').on('click', '.fa-square-o', function() {
    id = $(this).attr('data-id');
    $.ajax({
        url: '{% url "delete_quickmap" %}',
        type: 'POST',
        data: {'id':id,
               csrfmiddlewaretoken: '{{ csrf_token }}'
              },
        dataType: 'html',
        success: function(result) {
            $('#qmap'+result).remove();
        },
    });
  });
</script>