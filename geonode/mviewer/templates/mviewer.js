<script type="text/javascript">
  // var up = new UpAndDownLayer();
  var numItems = $('.forest-change').length;

  for (var i = 2; i <= numItems; i++) {
       if (i==2) {
         $('#t'+i).attr('class', 'forest-cover');
       } else if (i==3) {
         $('#t'+i).attr('class', 'forest-use');
       } else if (i==4) {
         $('#t'+i).attr('class', 'country');
       } else if (i==5) {
         $('#t'+i).attr('class', 'conservation');
       } else if (i==6) {
         $('#t'+i).attr('class', 'stories');
       } else if (i==7) {
         $('#t'+i).attr('class', 'people');
       }
  }

  $('.js-toggle-category').click(function() {
    if($(this).closest('li').hasClass('closed')) {
        $(this).closest('li').removeClass('closed');
        $(this).next('ul').addClass('closed');
    } else {
        $(this).closest('li').addClass('closed');
        $(this).next('ul').removeClass('closed');
    }
  })

  var vis_dict = {{vis_dict|safe}};
  var perm_dict = {{perm_dict|safe}};
  var baseMap = basemapsDict[{{basemap|safe}}][0];
  var map_layers = [];
  var mask;
  var layer_mask;
  var swt_id;
  var regid;

  var map = L.map('map', {
        center: [22, -105],
        zoom: 6,
        animate: true,
        layers: [baseMap],
        minZoom: 4,
        zoomControl: false
      });
  /* Set BBOX */
  map.fitBounds({{bounds|safe}});

  if(!jQuery.isEmptyObject({{layer_mask|safe}})) {
      layer_mask = {{layer_mask|safe}};
      $('.fa-low-vision').show();
  }

  /* Basemaps functions */
  $.each(basemapsDict, function(k, v){
    var html = '<li class="maptype '+k+'" data-maptype="'+k+'"><i></i><span>'+v[1]+'</span><a href="#" class="source"></a></li>'
    $(".maptype-list").append(html);
  });

  /* Basemap initial selectedf */
  $('.'+{{basemap|safe}}).addClass('selected');

  // Basemaps event
  $(".tab-basemaps").on('click', '.maptype', function() {
    var val = $(this).attr('data-maptype');
    $('.maptype').removeClass('selected');
    $(this).addClass('selected');
    basemapsDict[val][0].addTo(map);
    map.removeLayer(baseMap);
    baseMap = basemapsDict[val][0];
  });

  /* zoom */
  L.control.zoom({
     position:'bottomright'
    }).addTo(map);

  /* zoomBox */
  L.control.zoomBox({
    modal: true,
    position:'bottomright'
  }).addTo(map);

  /* Capas iniciales prendidas */
  $.each(vis_dict, function( k, v ){
      $.each(v, function( lid, vis ){
          if(vis==true) {
              var swt_lay = '#st'+k+'l'+lid;
              var dataId = $(swt_lay).attr('id');
              var typename = $(swt_lay).attr('data-typename');
              var title = $(swt_lay).attr('data-title');
              var ows_url = $(swt_lay).attr('data-href');
              var style = $(swt_lay).attr('data-style');
              var default_style = $(swt_lay).attr('data-defstyle');

              $(swt_lay).addClass('checked');
              $(swt_lay).css('background', 'green');

              theLayer = L.tileLayer.betterWms(ows_url, {
                layers: typename,
                format: 'image/png',
                styles: style,
                transparent: true
              });
              map_layers.push(theLayer);
//              console.log("map_layers",map_layers);
              map.addLayer(theLayer);
              /*Code for app spatial objects analysis */
              // up.set_global_layer(map_layers);
              // up.set_global_layer(map_layers);

              $.each(map_layers, function(i, val) {
                if (theLayer._leaflet_id == val._leaflet_id) {
                  leafletId = val._leaflet_id;
                  checkId = i;
                  var zIndex = 100+i;
                  val.setZIndex(zIndex);
                }
              });
              layer_legend(dataId, theLayer._leaflet_id, title, typename, ows_url, style, default_style);
          }
      });
  });

  /*Drawing */
  var featureGroup = L.featureGroup().addTo(map);

/*DrawControl is necesary for drawing custom */
  var drawControl = new L.Control.Draw({
        edit: {
          featureGroup: featureGroup
        },
        position:'bottomleft',
        draw: {
          polygon: false,
          polyline: false,
          rectangle: false,
          circle: false,
          marker: true,
        }
  }).addTo(map);
  var SquereDraw = new L.Draw.Rectangle(map, {draggable: true});
  /* OnOffswitch event */
  $(".onoffswitch").click(function() {
    var checkId;
    var leafletId;
    var typename = $(this).attr('data-typename');
    var title = $(this).attr('data-title');
    var dataId = $(this).attr('id');
    var ows_url = $(this).attr('data-href');
    var style = $(this).attr('data-style');
    var default_style = $(this).attr('data-defstyle');

    if($(this).attr('class') == 'onoffswitch') {
        theLayer = L.tileLayer.betterWms(ows_url, {
          layers: typename,
          format: 'image/png',
          //maxZoom: 24,
          styles: style,
          transparent: true
        });

        map_layers.push(theLayer);
        map.addLayer(theLayer);
        $.each(map_layers, function(i, val) {
          if (theLayer._leaflet_id == val._leaflet_id) {
            leafletId = val._leaflet_id;
            checkId = i;
            var zIndex = 100+i;
            val.setZIndex(zIndex);
          }
        });
        $(this).attr('class', 'onoffswitch checked');
        $(this).css('background', 'green');

        layer_legend(dataId, theLayer._leaflet_id, title, typename, ows_url, style, default_style);
    } else {
        remove_layer(dataId);
    }
  });

  /* Legend Tools */
  $(".layers").on("click", ".vtools", function() {
    $("#"+$(this).attr('data-id') + " .tools").toggle('slow');
    if($("#"+$(this).attr('data-id') + " .vtools").hasClass( "fa-chevron-left" )){
      $("#"+$(this).attr('data-id') + " .vtools").addClass('fa-chevron-right');
      $("#"+$(this).attr('data-id') + " .vtools").removeClass('fa-chevron-left');
    }else{
      $("#"+$(this).attr('data-id') + " .vtools").addClass('fa-chevron-left');
      $("#"+$(this).attr('data-id') + " .vtools").removeClass('fa-chevron-right');
    }
  });

  $(".layers").on('click', '.fa-eye', function() {
    var leafletId = $(this).closest('li').attr("leaflet-id");
    for (var i = 0; i < map_layers.length; i++) {
      if (leafletId == map_layers[i]._leaflet_id) {
        if ($(this).hasClass('eyeon')) {
            map.removeLayer(map_layers[i]);
            $(this).removeClass('eyeon');
        } else {
            map.addLayer(map_layers[i]);
            $(this).addClass('eyeon');
        }
      }
    }
  });

  $(".layers").on("click", ".fa-list-alt", function() {
    $("#"+$(this).closest('li').attr('id') + " .thumb").toggle('slow');
  });

  $(".layers").on("click", ".fa-arrows-h", function() {
    $("#"+$(this).closest('li').attr('id') + " .slidecontainer").toggle('slow');
  });

  $(".layers").on("click", ".fa-info-circle", function() {
    var swt_id = $(this).closest('li').attr('id').slice(1);
    modal_info(swt_id);
  });

  $(".layers").on("click", ".fa-search", function() {
    var swt_id = $(this).closest('li').attr('id').slice(1);
    var southWest = L.latLng($('#'+swt_id).attr('data-y0'), $('#'+swt_id).attr('data-x0')),
    northEast = L.latLng($('#'+swt_id).attr('data-y1'), $('#'+swt_id).attr('data-x1')),
    bounds = L.latLngBounds(southWest, northEast);
    map.fitBounds(bounds);
  });

  $(".layer-title").on("click", ".fa-info-circle", function() {
    var swt_id = $(this).attr('data-id');
    modal_info(swt_id);
  });

  /* Slider for the opacity */
  $(".layers").on('change', '.slider', function() {
    var range = $(this).val();
    var element_id = $(this).attr('id');
    for (var i = 0; i < map_layers.length; i++) {
          if (element_id == map_layers[i]._leaflet_id) {
                map_layers[i].setOpacity(range/100);
                $('#percent'+element_id).html(range+"%");
          }
    }
  });

  $(".layers").on('click', '.fa-times-circle', function() {
    var dataId = $(this).closest('li').attr('id');
    remove_layer(dataId.slice(1));
  });

  $(".layers").on('click', '.fa-file-text', function() {
    $(this).addClass('eyeon');
    $('#description-content').hide();
    $('#layer-narrative').empty();
    if (regid != null){
    $.ajax({
        url: '{% url "get_layer_narrative" %}',
        data: {'regid': regid},
        type: 'GET',
        success : function(obj) {
            if(obj) {
                $('#layer-narrative').append(obj);
            } else {
                $('#layer-narrative').append('<p>Esta capa no tiene narrativa</p>');
            }
            $('#layer-narrative').show();
        },
        error : function(message) {
                console.log(message);
        }
    });
    // reset_stats_tool();
    }
    info_tab();
  });

  $('.fa-low-vision').click(function() {
    if(mask){
      if($(this).hasClass('active')) {
          map.removeLayer(mask);
          $(this).removeClass('active');
      } else {
          map.addLayer(mask);
          $(this).addClass('active');
      }
    } else {
      var black_screen = {"type":"FeatureCollection","features":[
      {"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-180,90],
      [180,90],[180,-90],[-180,-90],[-180,90]]]},"properties":{"id":1}}
      ]};

      var gjson_layer=jQuery.parseJSON(layer_mask['gjson_layer']);
      var poly1 = gjson_layer.features[0].geometry;
      var poly2 = black_screen.features[0].geometry;

      var bbx_layer=L.geoJSON(poly1);
      map.fitBounds(bbx_layer.getBounds());

      var difference = turf.difference(poly2, poly1);
      var diff_pol = {"type":"FeatureCollection","features":[difference]};

      mask = L.geoJson(diff_pol,  {
        style: function (feature) {
            return  {
                weight: 0.9,
                opacity: 0.7,
                color: 'black',
                dashArray: '',
                fillOpacity: 0.8,
                };
        }
      }).addTo(map);
      $(this).addClass('active');
    }
  });

  /* Sortable */
  $(function () {
    $(".layers").sortable({
      tolerance: 'pointer',
      revert: 'invalid',
      items: "> li.layer",
      placeholder: 'placeholder',
      forcePlaceholderSize: true,
      forceHelperSize: true,
      axis: "y",
      cancel: "div.no-sort",
      cursor: "row-resize",
      stop: function(event, ui) {
        var sortedIDs = $(this).sortable('toArray');
        $.each(sortedIDs.reverse(), function(index, val) {
          var leafletId = $('#'+val).attr('leaflet-id');
          var zIndex = 100+index;
          var i=0;
          while (leafletId != map_layers[i]._leaflet_id){
            i++;
          }
          map_layers[i].setZIndex(zIndex);
        });
      }
    });
  });

  /* OPERACIONES REPETITIVAS*/

  function remove_layer(dataId) {
      var leafletId = $("#l"+dataId).attr("leaflet-id");
      $("#l"+dataId).fadeOut(200, function(){ $(this).remove();});
      for (var i = 0; i < map_layers.length; i++) {
        if (leafletId == map_layers[i]._leaflet_id) {
          map.removeLayer(map_layers[i]);
          map_layers.splice(i,1);
        }
      }
      $("#"+dataId).attr('class', 'onoffswitch');
      $("#"+dataId).css('background', '');
  }

  function layer_legend(dataId, leaflet_id, title, typename, ows_url, style, default_style) {
     var lgd_title = ((style != default_style) ? style : title);
     var imglegend = ows_url+'?service=WMS&request=GetLegendGraphic&format=image/png&WIDTH=20&HEIGHT=20&LAYER='+typename+'&STYLE='+style+'&legend_options=fontAntiAliasing:true;fontSize:12;forceLabels:on&transparent=true"';
     var theLegend = '<li id="l'+ dataId +'" class="layer layer-info-container" leaflet-id="'+leaflet_id
                      + '"><span class="layer-name -alerts"><div class="no-sort container-eye-icon">'
                      + '<i class="fa fa-eye eyeon" aria-hidden="true"></i></div><div class="l-title" style="width:230px;">'+lgd_title+'</div>'
                      + '<div class="no-sort container-info-icon" title="+Info"><i class="fa fa-file-text" aria-hidden="true"></i></div>'
                      + '<div class="no-sort pull-right"><div class="tools no-sort" style="display:none;"><a href="#" class="f15" title="Leyenda">'
                      + '<i class="fa fa-list-alt" aria-hidden="true"></i></a><a href="#" class="f15" title="Opacidad">'
                      + '<i class="fa fa-arrows-h" aria-hidden="true"></i></a><a href="#" class="f15" title="Info">'
                      + '<i class="fa fa-info-circle" aria-hidden="true"></i></a><a href="#" class="f15" title="Zoom a la capa">'
                      + '<i class="fa fa-search" aria-hidden="true"></i></a><a href="#" class="f15" title="Eliminar">'
                      + '<i class="fa fa-times-circle" aria-hidden="true"></i></a></div>'
                      + '<div class="pull-right"><i data-toggle="tooltip" title="Herramientas" class="vtools fa fa-chevron-left" data-id="l'+dataId+'"></i></div></div>'
                      + '<div class="thumb"><a class="thumbnail2" href="#" data-target="#image-gallery"><img class="img-responsive" src="'+imglegend+'" style="'+style+'"/></a></div>'
                      + '<div id="sld-'+dataId+'" class="no-sort slidecontainer" style="display:none;"><input type="range" min="1" max="100" value="100" class="slider" id="'
                      + leaflet_id+'"><span id="percent'+leaflet_id+'">100%</span></div></span></li>';
     $(".layers").prepend(theLegend);
     var top_id = $("#"+dataId).attr("data-topid");
     var color = $("#nav-head"+top_id).css('border-color');
     $("#l"+dataId).css('border-left','4px solid '+color);
     $("#l"+dataId).find('.l-title').click();
     /*Code for app toolkit spatial objects analysis  */
     // up.set_layer(typename, title);
  }

  function modal_info(swt_id){
    var dataInfo = $('#'+swt_id).attr('data-info');
    var dataTitle = $('#'+swt_id).attr('data-title');
    var dataDate = $('#'+swt_id).attr('data-date');
    var dataTypename = $('#'+swt_id).attr('data-typename');
    var layid = $('#'+swt_id).attr('data-layid');
    $('#lay-tit').html(dataTitle);
    $('#lay-abst').html(dataInfo);
    $('#lay-date').html(dataDate);
    $('#sourceModal').addClass('is-active');
    $('#down-meta').attr('href', '/layers/'+dataTypename+'/pdf_metadata_layer');
    if (layid in perm_dict){
      $('#down-shp').show();
      $('#down-shp').attr('href', '/layers/download/'+dataTypename+'/ESRI Shapefile');
    }
  }

  /* Evento de capa activa */
  $('.layers').on('click', '.l-title', function() {
        swt_id = $(this).closest('li.layer').attr('id').slice(1);
        if ($(this).closest('li.layer').hasClass('layer-selected')) {
            $(this).closest('li.layer').removeClass('layer-selected');
            // hide_layer_tool();
            if ( $("#markers-tab-button").hasClass("active") ) {
                $("#markers-tab-button").click();
            }
            $("#markers-tab-button").hide();
            $('#l'+swt_id).find('.container-info-icon .fa-file-text').removeClass('eyeon');
            $('#l'+swt_id).find('.container-info-icon').hide();
            if_gen_tool();
            if_sidebar();
            if_mv_narrative();
        } else {
            $('li.layer').removeClass('layer-selected');
            $(this).closest('li.layer').addClass('layer-selected');
            $('.container-info-icon').hide();

            /* Valida si la capa tiene herramienta y/o narrativa */
            swt_id = $(this).closest('li.layer').attr('id').slice(1);
            regid = $('#'+swt_id).attr('data-regid');
            if (regid != null){
                $.ajax({
                    url: '{% url "has_layer_tool" %}',
                    data: {'regid': regid},
                    type: 'GET',
                    success : function(flags) {
                      if (flags.tflag) {show_layer_tool(); $("#analysis-tab-button").show();}
                      else {
                            // hide_layer_tool();
                            if_gen_tool();}
                      if (flags.nflag) {$("#info-tab-button").hide(); $('#l'+swt_id).find('.container-info-icon').show();}
                      else {$("#info-tab-button").hide(); $('#l'+swt_id).find('.container-info-icon').hide();}
                      if (flags.mflag) {
                        $("#markers-tab-button").show();
                        $("#markers-tab-button").click();
                      }
                      else {$("#markers-tab-button").hide();}
                    },
                    error : function(message) {
                            console.log(message);
                    }
                });
                // reset_stats_tool();
            }
            /* Desactiva markers al seleccionar otra capa */
            if ( $("#markers-tab-button").hasClass("active") ) {
                $("#markers-tab-button").click();
            }
        }
        if ($('#info-tab-button').hasClass('active')) {
            $('#info-tab-button').click();
        }
        $('#btn-start-stats').removeClass('disabled');
  });

  /* Evento del module-tabs */
  $('li.tab').click(function() {
        var tab_id = $(this).attr('data-tab');
        var sidebar = "#sidebar-description";

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).addClass('inactive');
            if (tab_id=='info-tab') {
                $(sidebar).toggle("slide", {direction: "right"});
                $(sidebar).removeClass('active');
            } else if (tab_id=='markers-tab') {
                remove_markers();
                if_sidebar();
            } else {
                $('.tab-content').removeClass('selected');
            }
        } else {
            $('li.tab').removeClass('active');
            $('li.tab').addClass('inactive');
            $(this).removeClass('inactive');
            $(this).addClass('active');
            $('.tab-content').removeClass('selected');
            if (tab_id=='info-tab') {
                info_tab();
                remove_markers();
            } else if (tab_id=='markers-tab') {
                layerid_markers();
                if_sidebar();
            } else {
                $('#'+tab_id).addClass('selected');
                if_sidebar();
                remove_markers();
            }
        }
  });

  function info_tab () {
    if (!$('li.layer').hasClass('layer-selected')) {
        $('#layer-narrative').hide();
        $('#description-content').show();
    }

    if ($("#sidebar-description").hasClass('active')) {
        $('#marker-narrative').hide();
        $('#narrative-nav').hide();
    } else {
      $("#sidebar-description").toggle("slide", {direction: "right"});
      $("#sidebar-description").addClass('active');
    }
  }

  function if_sidebar () {
    if ($("#sidebar-description").hasClass('active')) {
        $("#sidebar-description").toggle("slide", {direction: "right"});
        $("#sidebar-description").removeClass('active');
        $('#narrative-nav').hide();
    }
  }
var gen_tool_count = 0; //Temporal en lo q se integra tools
  function if_gen_tool () {
    if (gen_tool_count == 0) {
      $("#analysis-tab-button").hide();
    } else {
      $("#analysis-tab-button").show();
    }
  }

  function if_mv_narrative () {
    if ($('#description-content').children().length == 0){
      $("#info-tab-button").hide();
    } else {
      $("#info-tab-button").show();
    }
  }

  /* Verifica narrativa de visualizador */
  if ($('#description-content').html().trim()) {
    $("#info-tab-button").show();
    $('#info-tab-button').click();
  }

  /* Verifica herramienta general */
  if (gen_tool_count > 0) {
    $("#analysis-tab-button").show();
  }
</script>
