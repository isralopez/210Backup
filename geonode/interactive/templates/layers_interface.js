<script type="text/javascript">
  var x0_mapa_global = 0;
  var x1_mapa_global = 0;
  var y0_mapa_global = 0;
  var y1_mapa_global = 0;

  var progress = setInterval(function () {
    var $bar = $("#bar");
    $bar.width($bar.width() + 700);
  }, 800);

  $(window).load(function() {
    $("#bar").width($(this).width());
    $(".loader").fadeOut(2000);
    $(".container_layers").css('height', $(this).height()-140);
    $(".leaflet-left").addClass( "leaflet-control-openmenu" );
    $('#searchBox').addClass( "form-control" );
  });
  $( window ).resize(function() {
    $(".container_layers").css('height', $(this).height()-140);
  });

  /*Eliminar  footer*/
  $('#bottom-nav').css('display', 'none');
  $('#footer').css('display', 'none');
  $('#search').css('display', 'none');

  /*Tooltips*/
  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
  });
  $('body').tooltip({
    selector: '[data-toggle="tooltip"]'
  });
  $(document).on({click: function () {
    $('[data-toggle="popover"]').popover()
  }}, '.fa');

  /*Display categories*/
  $(".layerListNub").click(function() {
    if($( ".layerMenu" ).hasClass( "translateLayerListRight" )){
      $(".layerMenu").removeClass( "translateLayerListRight" ).addClass( "translateLayerListLeft" );
      $(".layerMenuNubOpen").removeClass( "layerMenuNubOpen" ).addClass( "layerMenuNubClosed" );
      $(".leaflet-left").removeClass( "leaflet-control-openmenu" );
    }else{
      $(".layerMenu").removeClass( "translateLayerListLeft" ).addClass( "translateLayerListRight" );
      $(".layerMenuNubClosed").removeClass( "layerMenuNubClosed" ).addClass( "layerMenuNubOpen" );
      $(".leaflet-left").addClass( "leaflet-control-openmenu" );
    }
  });

  /*Display Legend*/
  $(".layerListNub2").click(function() {
    if($( ".layerMenu2" ).hasClass( "translateLayerListLeft2" )){
      $(".layerMenu2").removeClass( "translateLayerListLeft2" ).addClass( "translateLayerListRight2" );
      $(".fa-caret-right").removeClass( "fa-caret-right" ).addClass( "fa-list" );
      $(".leaflet-right").removeClass( "leaflet-control-openmenu2" );
    }else{
      $(".layerMenu2").removeClass( "translateLayerListRight2" ).addClass( "translateLayerListLeft2" );
      $(".fa-list").removeClass( "fa-list" ).addClass( "fa-caret-right" );
      $(".leaflet-right").addClass( "leaflet-control-openmenu2" );
    }
  });

  /*Menu hover*/
  $( ".layerMenuTopLevelGroupLabel" ).hover(
    function() {
      $( this ).addClass( "layerMenuIconDivSelected" );
      $($(this).attr('data-id')).addClass( "layerMenuIconDivSelected" );
    }, function() {
      $( this ).removeClass( "layerMenuIconDivSelected" );
      if($($(this).attr('data-id')).hasClass( "layerMenuIconDivClicked" )){

      }else{
        $($(this).attr('data-id')).removeClass( "layerMenuIconDivSelected" );
      }
    }
  );
  /*Menu icon hover*/
  $( ".layerMenuIconDiv" ).hover(
    function() {
      $( this ).addClass( "layerMenuIconDivSelected" );
      $("#"+this.id+"t").addClass( "layerMenuIconDivSelected" );
    }, function() {
      $("#"+this.id+"t").removeClass( "layerMenuIconDivSelected" );
      if($("#"+this.id).hasClass( "layerMenuIconDivClicked" )){
      }else{
        $("#"+this.id).removeClass( "layerMenuIconDivSelected" );
      }
    }
  );

  /*Menu click*/
  $(".layerMenuTopLevelGroupLabel").click(function() {
    if($(this).attr('data-id')!="#m5"){
        $(".labelsContainer").addClass( "translateLayerLabelsLeft" );
        $($(this).attr('data-id')).addClass( "layerMenuIconDivClicked" );
        $($(this).attr('data-id')+'c').show( "slow" );
    }

  });
  /*Menu icon click*/
  $(".layerMenuIconDiv").click(function() {
    $(".labelsContainer").addClass( "translateLayerLabelsLeft" );
    $(".layerGroupContainer").hide( "slow" );
    $(".layerMenuIconDiv").removeClass( "layerMenuIconDivClicked" );
    $(".layerMenuIconDiv").removeClass( "layerMenuIconDivSelected" );
    $("#"+this.id).addClass( "layerMenuIconDivClicked" );
    $("#"+this.id).addClass( "layerMenuIconDivSelected" );
    $("#"+this.id+"c").show( "slow" );
  });

  /* Intercensal Topic click*/
  $('.layerList').on('click', '.level3LabelText', function() {
    if ($("#"+$(this).attr('data-id')+" .subtopic").is(":visible")){
      $("#"+$(this).attr('data-id')+" .subtopic").hide( "slow" );
    }else{
      $(".subtopic").hide( "slow" );
      $("#"+$(this).attr('data-id')+" .subtopic").show( "slow" );
    }
  });

  /*Category and tags click*/
  $('.layerList').on('click', '.level2LabelText', function() {
    if ($("#"+$(this).attr('data-id')+" .layer").is(":visible")){
      $("#"+$(this).attr('data-id')+" .layer").hide( "slow" );
    }else{
      $(".layer").hide( "slow" );
      $("#"+$(this).attr('data-id')+" .layer").show( "slow" );
    }
  });

  /* Back Menu */
  $(".backToListButton").click(function() {
    // $(".layer").hide( "slow" );
    // $(".narrative").hide( "slow" );
    $(".layerGroupContainer").hide( "slow" );
    $(".labelsContainer").removeClass( "translateLayerLabelsLeft" );
    $(".layerMenuIconDiv").removeClass( "layerMenuIconDivClicked" );
    $(".layerMenuIconDiv").removeClass( "layerMenuIconDivSelected" );
  });

  /*Tools*/
  $("#addlegend").on("click", ".vtools", function() {
    $("#"+$(this).attr('data-id') + " .tools").toggle('slow');
    if($("#"+$(this).attr('data-id') + " .vtools").hasClass( "fa-chevron-left" )){
      $("#"+$(this).attr('data-id') + " .vtools").addClass('fa-chevron-right');
      $("#"+$(this).attr('data-id') + " .vtools").removeClass('fa-chevron-left');
    }else{
      $("#"+$(this).attr('data-id') + " .vtools").addClass('fa-chevron-left');
      $("#"+$(this).attr('data-id') + " .vtools").removeClass('fa-chevron-right');
    }
  });

  $("#addlegend").on("click", ".fa-list-alt", function() {
    $("#"+$(this).attr('data-id') + " .thumb").toggle('slow');
  });

  $("#addlegend").on("click", ".fa-arrows-h", function() {
    $("#"+$(this).attr('data-id') + " .slidecontainer").toggle('slow');
  });

  $("#addlegend").on("click", ".fa-check-square", function() {
    var checkId = $(this).attr('data-checkid');
    map.removeLayer(checkboxes[checkId]);
    if ($("#"+$(this).attr('data-id')+" .slider").is(":visible")){
      $("#"+$(this).attr('data-id') + " .slider").toggle('slow');
    }
    if ($("#"+$(this).attr('data-id')+" .thumb").is(":visible")){
      $("#"+$(this).attr('data-id') + " .thumb").toggle('slow');
    }
    if($("#"+$(this).attr('data-id') + " .vtools").hasClass( "fa-chevron-right" )){
      $("#"+$(this).attr('data-id') + " .tools").toggle('slow');
      $("#"+$(this).attr('data-id') + " .vtools").addClass('fa-chevron-left');
      $("#"+$(this).attr('data-id') + " .vtools").removeClass('fa-chevron-right');
    }
    $(this).addClass('fa-square-o');
    $(this).removeClass('fa-check-square');
  });

  $("#addlegend").on("click", ".fa-square-o", function() {
    var checkId = $(this).attr('data-checkid');
    map.addLayer(checkboxes[checkId]);
    if (!$("#"+$(this).attr('data-id')+" .thumb").is(":visible")){
      $("#"+$(this).attr('data-id') + " .thumb").toggle('slow');
    }
    $(this).addClass('fa-check-square');
    $(this).removeClass('fa-square-o');
  });

  $("#addlegend").on("click", ".fa-times", function() {
    var dataId = $(this).attr('data-id');
    var dataV = $(this).attr('data-value');
    $('#'+dataId).removeAttr('checked');
    $("#l"+dataId).fadeOut(200, function(){ $(this).remove();});
    var matcher = new RegExp("m7");
    if ( matcher.test(dataId) ) {
      var eid = dataId.slice(0,-1);
      $("#"+eid).fadeOut(200, function(){ $(this).remove();});
    }
    for (var i = 0; i < checkboxes.length; i++) {
      if (dataV == checkboxes[i].wmsParams.layers) {
        map.removeLayer(checkboxes[i]);
        checkboxes.splice(i,1);
      }
    }
  });

  /* Slider for the opacity */
  $("#addlegend").on('change', '.slider', function() {
    var range = $(this).val();
    var element_id = $(this).attr('id');
    for (var i = 0; i < checkboxes.length; i++) {
          if (element_id == checkboxes[i]._leaflet_id) {
                checkboxes[i].setOpacity(range/100);
                $('#percent'+element_id).html(range+"%");
          }
    }
  });

  $(".layerList").on("click",".g-download", function() {
    var layername = $(this).attr('data-name');
    var layer_storeType = $(this).attr('data-storetype');
    var links, htmlLinks = '';
    if(layer_storeType == 'dataStore'){
      links = {'KML':'KML','ESRI Shapefile':'Shapefile Comprimido','GeoJSON':'GeoJSON','CSV':'CSV','PDF':'PDF'}
    }
    else{
      links = {'TIF':'TIF'}
    }
    $.each(links, function(index, val) {
      htmlLinks += '<li><a href="/layers/download/'+layername+'/'+index+'">'+val+'</a></li>';
    });
    $( "#download-layer .modal-body" ).html(htmlLinks);
  });

  $("#addlegend").on("click", ".fa-file-text", function() {
    var url = $(this).attr('data-url');
    window.open(url, '_blank');
  });


  var theLayer = null,
      theLegend = null,
      dataId = null;
  var checkboxes = [];
  var snapshot = document.getElementById('snapshot');

  var layer_opacity = [];
  var index = [];
  var mapBase = OpenStreetMap;

  var map = L.map('map', {
        center: [22, -105],
        zoom: 6,
        animate: true,
        layers: [mapBase],
        minZoom: 4
      });
  $.each(baseLayers, function( k, v ){
    $( "#baseLayers" ).append( '<div class="radio"><label><input type="radio" name="baseLayers" value="'+k+'">'+k+'</label></div>' );
  });
  $('input[name=baseLayers]:radio').filter('[value="Open Street Map"]').attr('checked', 'checked');
  $("input[name=baseLayers]:radio").change(function () {
    baseLayers[this.value].addTo(map);
    map.removeLayer(mapBase);
    mapBase = baseLayers[this.value];
  });
  //L.control.layers(baseLayers).addTo(map);
  /*zoomBox*/
  L.control.zoomBox({
    modal: true
  }).addTo(map);
  /*Print*/
//  L.easyPrint({
//    title: 'Imprimir mapa',
//    elementsToHide: 'p, h2, a, i, span, .layerMenu, .layerMenu2'
//  }).addTo(map);

  //add configured controls coordinates
//  L.control.coordinates({
//    position:"bottomleft",
//    decimals:6,
//    decimalSeperator:".",
//    labelTemplateLat:"Latitud: {y}",
//    labelTemplateLng:"Longitud: {x}"
//  }).addTo(map);

  x0_mapa_global = map.getBounds().getWest();
  x1_mapa_global = map.getBounds().getEast();
  y0_mapa_global = map.getBounds().getSouth();
  y1_mapa_global = map.getBounds().getNorth();

  /* Checkbox change event */
  $('.layerList').on('change', '.checkbox', function() {
    dataId = $(this).attr('id');
    dataInfo = $(this).attr('data-info');
    var typename = this.value;
    var mbAttr = '';

    if ($(this).attr('href') == 'http://46.19.32.32:8080/geoserver/wms') {
        mbAttr = 'Map tiles by <a href="https://maps.elie.ucl.ac.be/CCI/viewer/">ESA/CCI</a> Climate Change Initiative. Land cover';
    }
    theLayer = L.tileLayer.betterWms($(this).attr('href'), {
          layers: typename,
          format: 'image/png',
          transparent: true,
          attribution: mbAttr
        });

    if(this.checked) {
        checkboxes.push(theLayer);
        for (var i = 0; i < checkboxes.length; i++) {
          if (this.value == checkboxes[i].wmsParams.layers) {
            map.addLayer(checkboxes[i]);
            var leafletId = checkboxes[i]._leaflet_id;
            var checkId = i;
            var zIndex = 100+i;
            checkboxes[i].setZIndex(zIndex);
          }
        }
        imglegend = $(this).attr('href')+'?service=WMS&request=GetLegendGraphic&format=image/png&WIDTH=20&HEIGHT=20&LAYER='+this.value+'&legend_options=fontAntiAliasing:true;fontSize:12;forceLabels:on&transparent=true" title="'+this.title;
        theLegend = '<div id="l'+dataId+'" data-checkid="'+checkId+'" leaflet-id="'+leafletId+'" typename="'+typename+'" data-title="'+this.title+'" class="rowlegend"><div class="l-title"><i data-toggle="tooltip" title="Desactivar" class="fa fa-check-square" data-id="l'+dataId+'" data-checkid="'+checkId+'"></i> '+this.title+'</div><div class="rlayer">'
        + '<div class="tools" style="display:none;"><i data-toggle="tooltip" title="Leyenda" data-id="l'+dataId+'" class="fa fa-list-alt"></i><i data-toggle="tooltip" title="Opacidad" data-id="l'+dataId+'" class="fa fa-arrows-h"></i>'
        + '<i title="Descargar meta-data" class="fa fa-file-text" data-url="/layers/'+this.value+'/pdf_metadata_layer"></i>'
        + '<i title="Descripción" class="fa fa-info" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="left" data-content="'+dataInfo+'"></i><i data-toggle="tooltip" title="Eliminar" class="fa fa-times" data-value="'+this.value+'" data-id="'+dataId+'"></i></div>'
        + '</div><i data-toggle="tooltip" title="Herramientas" data-id="l'+dataId+'" class="vtools animationTransition fa fa-chevron-left"></i>'
        + '<div class="thumb"><a class="thumbnail2" href="#" data-image-id="" data-title="'+this.title+'" data-image="'+imglegend+'" data-target="#image-gallery"><img class="img-responsive" src="'+imglegend+'"/></a></div>'
        + '<div id="sld-'+dataId+'" class="no-sort slidecontainer" style="display:none;"><input type="range" min="1" max="100" value="100" class="slider" id="'
        + leafletId+'" style="width: 80%;"><span id="percent'+leafletId+'">100%</span></div></span></div></div>';
        
        $( "#addlegend" ).prepend(theLegend);
        imgGallery();

    }else{
      $("#l"+dataId).fadeOut(200, function(){ $(this).remove();});
      for (var i = 0; i < checkboxes.length; i++) {
        if (this.value == checkboxes[i].wmsParams.layers) {
          map.removeLayer(checkboxes[i]);
          checkboxes.splice(i,1);
        }
      }
    }

    /* Save Qmap Button behavior */
    if(checkboxes.length > 0) {
      $("#save-qmap").show();
    }else{
      $("#save-qmap").hide();
      $(".toolsSelected").hide();
    }

    if($( ".layerMenu2" ).hasClass( "lm-closed" )){
      var window_w = $( window ).width();
      if(window_w >= 1280){
        $(".layerMenu2").removeClass( "translateLayerListRight2" ).removeClass( "lm-closed" ).addClass( "translateLayerListLeft2" );
        $(".fa-list").removeClass( "fa-list" ).addClass( "fa-caret-right" );
      }
    }
  });

  /*Sortable*/
  $(function () {
    $("#addlegend").sortable({
      tolerance: 'pointer',
      revert: 'invalid',
      items: "> div.rowlegend",
      placeholder: 'placeholder',
      forcePlaceholderSize: true,
      forceHelperSize: true,
      axis: "y",
      cancel: "div.no-sort",
      cursor: "row-resize",
      stop: function(event, ui) {
        var sortedIDs = $(this).sortable('toArray');
        $.each(sortedIDs.reverse(), function(index, val) {
          var checkId = $('#'+val).attr('data-checkid');
          var zIndex = 100+index;
          checkboxes[checkId].setZIndex(zIndex);
        });
      }
    });
  });

  /* Map Reset in window */
  function resetMap() {
    $('.checkbox').removeAttr('checked');
    $( "#addlegend" ).empty();
    for (var i = 0; i < checkboxes.length; i++) {
      map.removeLayer(checkboxes[i]);
    }
    checkboxes = [];

    /* Save Qmap form reset */
    $("#save-qmap").hide();
    $('#map_id').val('');
    $('#title').val('');
    $('#abstract').val('');
    $('#btnSaveMap').val('Guardar');
    $('#savenewMap').css('display','none');
  };

  /* Draw */
  var featureGroup = L.featureGroup().addTo(map);
  /*
  var drawControl = new L.Control.Draw({
    edit: {
      featureGroup: featureGroup
    },
    draw: {
      polygon: true,
      polyline: true,
      rectangle: true,
      circle: true,
      marker: true
    }
    }).addTo(map);*/

  $('.geoDropDownMenuItem').on('click', '.draw_polygon', function() {
      $('#contentToggleContainer').show( "fast" );
      $(".selectedRegionTitle .fa-caret-up").addClass('fa-caret-down');
      $(".selectedRegionTitle .fa-caret-up").removeClass('fa-caret-up');
      $(".geoDropDownMenu").slideUp("slow");
      new L.Draw.Polygon(map).enable()
  });

  $('.geoDropDownMenuItem').on('click', '.draw_circle', function() {
      $('#contentToggleContainer').show( "fast" );
      $(".selectedRegionTitle .fa-caret-up").addClass('fa-caret-down');
      $(".selectedRegionTitle .fa-caret-up").removeClass('fa-caret-up');
      $(".geoDropDownMenu").slideUp("slow");
      new L.Draw.Circle(map).enable()
  });

  map.on('draw:created', showPolygonArea);
  map.on('draw:edited', showPolygonAreaEdited);

  function showPolygonAreaEdited(e) {
      e.layers.eachLayer(function(layer) {
        showPolygonArea({layer:layer});
      });
  }

  function showPolygonArea(e) {
      featureGroup.clearLayers();
      featureGroup.addLayer(e.layer);

      var data = featureGroup.toGeoJSON();

      var black_screen = {"type":"FeatureCollection","features":[
      {"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-180,90],
      [180,90],[180,-90],[-180,-90],[-180,90]]]},"properties":{"id":1}}
      ]};

      bbx_layer = L.geoJson(data, {});
      map.fitBounds(bbx_layer.getBounds());

      var poly1 = data.features[0].geometry;
      var poly2 = black_screen.features[0].geometry;

      var difference = turf.difference(poly2, poly1);
      var mask = {"type":"FeatureCollection","features":[difference]};

      statesMun = L.geoJson(mask,  {
        style: function (feature) {
            return  {
                weight: .9,
                opacity: 0.9,
                color: 'black',
                dashArray: '',
                fillOpacity: 0.9,
                };
        }
      }).addTo(map);

      featureGroup.clearLayers();
      $(".headerTextButtons").show( "fast" );
  }
  /* ------------------------------------------ */


  $(".fa-repeat").click(function() {
    resetMap();
  });

  $(function() {
  $(".fa-question-circle").click(function() {
    $(".helpOverlayWrapper").css('height', $(".container_layers").height());
    //$(".helpOverlayWrapper").css('width', $(".container_layers").width());
    $(".helpOverlayWrapper").slideToggle('slow');
  });
  $(".helpOverlayWrapper").click(function() {
    $(".helpOverlayWrapper").slideToggle('fast');
  });
  });

  /*Buscador por texto*/
  $('input#text_search_input_l').quicksearch('div#result_text div.layer');
  $( "#text_search_input_l" ).bind('keyup', function(e) {
    if (this.value.length >= 3) {
      $("#m1c .layerRow").show( "fast" );
    }else {
      $("#m1c .layerRow").hide('fast');
    }
  });

  /* Seleccion de layer */
  $("#addlegend").on("click", ".l-title", function() {
  if ($(this).closest('.rowlegend').hasClass('layer_select')) {
    $(this).closest('.rowlegend').removeClass('layer_select');
  } else {
    $('.rowlegend').removeClass('layer_select');
    $(this).closest('.rowlegend').addClass('layer_select');
    $(".toolsSelected").show();
    $('.toolsSelected .fa').addClass('select');
    var rlegendId = $(this).closest('.rowlegend').attr('id');
    if(rlegendId.indexOf('extLay')>-1) {
      $("#styleCreate").hide();
    } else {
      var layer_id = $(this).closest('.rowlegend').attr('typename');
      $.ajax({
        data: {'layer_id': layer_id },
        url: '{% url "get_style_perm" %}',
        type: 'GET',
        success : function(perm) {
          if (perm == 'True') {$("#styleCreate").show();}
          else {$("#styleCreate").hide();}
        },
        error : function(message) {
                console.log(message);
        }
      });
    }
  }
  });

  $('.toolsSelected .fa-search').click(function(event) {
    var idLayerSelect = $("#addlegend .layer_select").attr('id').slice(1, -1);
    var southWest = L.latLng($('#'+idLayerSelect+' .layerRow').attr('data-y0'), $('#'+idLayerSelect+' .layerRow').attr('data-x0')),
    northEast = L.latLng($('#'+idLayerSelect+' .layerRow').attr('data-y1'), $('#'+idLayerSelect+' .layerRow').attr('data-x1')),
    bounds = L.latLngBounds(southWest, northEast);
    map.fitBounds(bounds);
  });

  $(".fa-eye-slash").click(function() {
    if ($("#range").is(":visible")){
      $("#range").hide( "slow" );
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].getContainer().style.clip = '';
      }
    }else{
      $("#range").show( "slow" );
      range['oninput' in range ? 'oninput' : 'onchange'] = clip;
      //map.on('move', clip);
      clip();
    }
  });

  /*Swipe*/
  function clip() {
    if ($("#range").is(":visible")){
      var nw = map.containerPointToLayerPoint([0, 0]),
          se = map.containerPointToLayerPoint(map.getSize()),
          clipX = nw.x + (se.x - nw.x) * range.value,
          idLayerSwipe = $("#addlegend .layer_select").attr('data-checkid');
      checkboxes[idLayerSwipe].getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
    }
  }

  /*Mascaras*/
  var mascara;
  var statesMun = L.geoJson(mascara,  {
  });

  $(".titles").click( function() {
    var consulta = $(this).attr("id");
    var zoom = $(this).attr("title");

    $(".geoDropDownMenu").slideUp("slow");
    $(".selectedRegionTitle .fa-caret-up").addClass('fa-caret-down');
    $(".selectedRegionTitle .fa-caret-up").removeClass('fa-caret-up');
    $("#submittername").text(zoom).css("font-size: 15px;");
    map.removeLayer(statesMun);
    $.ajax({
      data: {'param': consulta, 'zoom': zoom },
          url: '/interactive/face/',
          type: 'GET',
          success : function(data) {
                  var zoom_to = data[0];
                  var mascara = data[1];

                  bbx_layer = L.geoJson(zoom_to, {});

                  map.fitBounds(bbx_layer.getBounds());

                  statesMun = L.geoJson(mascara,  {
                    style: style
                  }).addTo(map);

                  function style(feature) {
                                       return  {
                                           weight: .9,
                                           opacity: 0.9,
                                           color: 'black',
                                           dashArray: '',
                                           fillOpacity: 0.9,
                                       };
                                     }

              $(".headerTextButtons").show( "fast" );
          },
          error : function(message) {
                  console.log(message);
               }
          });
  });

  $(".headerTextButtons .fa-times").click( function() {
    $(".headerTextButtons").hide( 1000 );
    $("#submittername").text("Estados");
    $(".selectedRegionTitle .fa-caret-up").addClass('fa-caret-down');
    $(".selectedRegionTitle .fa-caret-up").removeClass('fa-caret-up');
    $(".geoDropDownMenu").slideUp("slow");
    map.removeLayer(statesMun);
    map.setView([22, -105], 6);
  });

  /* [Zoom to menu open] */
  $(".selectedRegionTitle").click( function() {
    if($(".selectedRegionTitle .fa" ).hasClass("fa-caret-down")) {
      $(".selectedRegionTitle .fa-caret-down").addClass('fa-caret-up');
      $(".selectedRegionTitle .fa-caret-down").removeClass('fa-caret-down');
      $(".geoDropDownMenu").slideDown("slow");
    } else {
      $(".selectedRegionTitle .fa-caret-up").addClass('fa-caret-down');
      $(".selectedRegionTitle .fa-caret-up").removeClass('fa-caret-up');
      $(".geoDropDownMenu").slideUp("slow");
    }
  });

  /* [moveend event] */
  map.on('moveend', function(move) {
    //$("#wait").css("display", "block");
    if ($("#m2").hasClass("layerMenuIconDivClicked")&&$(".layerMenu").hasClass("translateLayerListRight")) {
      var zoom = map.getZoom();
      if(zoom>=9){
        var x0_mapa = map.getBounds().getWest();
        var x1_mapa = map.getBounds().getEast();
        var y0_mapa = map.getBounds().getSouth();
        var y1_mapa = map.getBounds().getNorth();
        if((x0_mapa_global-x0_mapa)>1||(x0_mapa_global-x0_mapa)<-1
        ||(y0_mapa_global-y0_mapa)>1||(y0_mapa_global-y0_mapa)<-1){
         x0_mapa_global = map.getBounds().getWest();
         x1_mapa_global = map.getBounds().getEast();
         y0_mapa_global = map.getBounds().getSouth();
         y1_mapa_global = map.getBounds().getNorth();
         $(".filter_category").each(function(index) {
            var data_x0 = $(this).attr("data-x0");
            var data_x1 = $(this).attr("data-x1");
            var data_y0 = $(this).attr("data-y0");
            var data_y1 = $(this).attr("data-y1");

            if(data_x0!="undefined"){
              //If para checar que nuestra capa este dentro del bounding box del mapa visible
              if(x0_mapa<=data_x1&&y0_mapa<=data_y1
                &&data_x0<=x1_mapa&&data_y0<=y1_mapa){
                  $(this).removeClass("oculto");
                  $(this).addClass("activo");
              }else if(!$(this).find(".checkbox").is(":checked"))
              {
                $(this).addClass("oculto");
                $(this).removeClass("activo");
              }
              $('.category').each(function (index, val)  {
                var class_hide = $('#' + val.id + ' .activo').length;
                if (class_hide >= 1) {
                  $('#' + val.id).show(1000);
                }
                else {
                  $('#' + val.id).hide(1000);
                }
              });
            }
        });
      }//end if zoom minimo
      }else {
        $(".filter_category").removeClass("oculto");
        $(".filter_category").addClass("activo");
        $(".category").show(1000);
      }
    }
    //$("#wait").css("display", "none").delay( 800 );
});
/* [End moveend event] */

/*IMG Gallery*/
$("#addlegend").on("dblclick", "a.thumbnail2", function(e) {
    e.preventDefault();
    $('#image-gallery').modal('toggle');
});

function imgGallery(){

    loadGallery(true, 'a.thumbnail2');

    //This function disables buttons when needed
    function disableButtons(counter_max, counter_current){
        $('#show-previous-image, #show-next-image').show();
        if(counter_max == counter_current){
            $('#show-next-image').hide();
        } else if (counter_current == 1){
            $('#show-previous-image').hide();
        }
    }

    /**
     *
     * @param setIDs        Sets IDs when DOM is loaded. If using a PHP counter, set to false.
     * @param setClickAttr  Sets the attribute for the click handler.
     */

    function loadGallery(setIDs, setClickAttr){
        var current_image,
            selector,
            counter = 0;

        $('#show-next-image, #show-previous-image').click(function(){
            if($(this).attr('id') == 'show-previous-image'){
                current_image--;
            } else {
                current_image++;
            }

            selector = $('[data-image-id="' + current_image + '"]');
            updateGallery(selector);
        });

        function updateGallery(selector) {
            var $sel = selector;
            current_image = $sel.data('image-id');
            $('#image-gallery-title').text($sel.data('title'));
            $('#image-gallery-image').attr('src', $sel.data('image'));
            disableButtons(counter, $sel.data('image-id'));
        }

        if(setIDs == true){
            $('[data-image-id]').each(function(){
                counter++;
                $(this).attr('data-image-id',counter);
            });
        }
        $(setClickAttr).on('click',function(){
            updateGallery($(this));
        });
    }
};

$("#image-gallery").draggable({
      handle: ".modal-header"
});

/* Crea los checkbox e icono de descarga de las capas */
function check_loop(clayers, div_id) {
    var layer_list = []
    $.each(clayers, function(k, value) {
       layer_list.push(value);
    });

    layer_list = layer_list.sort( function(a, b) {
           var atl = a.title.toLowerCase();
           var btl = b.title.toLowerCase();
           if(atl < btl) return -1;
           if(atl > btl) return 1;
           return 0;
           })

    $.each(layer_list, function(i, lay) {
        if(lay.download){
            html = '<div id="'+div_id+lay.id+'" class="layerMenuTopLevelGroupContainer layer" style="display: none;">'
            + '<div class="layerRow filter_category" id="'+lay.id+'" data-x0="'+lay.x0+'" data-x1="'+lay.x1+'" data-y0="'
            + lay.y0 +'" data-y1="'+lay.y1+'" data-title="'+lay.title+'">'
            + '<span class="fa-stack fa-lg download-l"><i class="fa fa-square fa-stack-2x"></i>'
            + '<i title="Descargar capa" class="fa fa-download fa-stack-1x fa-inverse g-download" data-toggle="modal"'
            + ' data-target="#download-layer" data-name="'+lay.typename+'" data-storeType="'+lay.storeType+'" data-id="'
            + div_id+lay.id+'i"></i></span>'
            +'<label for="'+div_id+lay.id+'i" title="'+lay.title.slice(0,1).toUpperCase()+lay.title.slice(1)+'">'
            + '<input class="checkbox" type="checkbox" id="'+div_id+lay.id+'i" href="'+lay.ows_url+'" value="'+lay.typename
            + '" data-layerid="'+lay.id+'" data-info="'+lay.abstract+'" title="'+lay.title.slice(0,1).toUpperCase()+lay.title.slice(1)+'">'
            + lay.title.slice(0,1).toUpperCase()+lay.title.slice(1)+'</label></div></div>';
        } else {
            html = '<div id="'+div_id+lay.id+'" class="layerMenuTopLevelGroupContainer layer" style="display: none;">'
            + '<div class="layerRow filter_category" id="'+lay.id+'" data-x0="'+lay.x0+'" data-x1="'+lay.x1+'" data-y0="'
            + lay.y0 +'" data-y1="'+lay.y1+'" data-title="'+lay.title+'">'
            +'<label for="'+div_id+lay.id+'i" title="'+lay.title.slice(0,1).toUpperCase()+lay.title.slice(1)+'">'
            + '<input class="checkbox" type="checkbox" id="'+div_id+lay.id+'i" href="'+lay.ows_url+'" value="'+lay.typename
            + '" data-layerid="'+lay.id+'" data-info="'+lay.abstract+'" title="'+lay.title.slice(0,1).toUpperCase()+lay.title.slice(1)+'">'
            + lay.title.slice(0,1).toUpperCase()+lay.title.slice(1)+'</label></div></div>';
        }
        $('#'+div_id).append(html);
    });
}

/* Crea dinamicamente la lista de capas por categoria */
$(".catTrgg").click( function() {
    if ($('#cat_container').is(':empty')){
        $.ajax({
          url: '{% url "layers_cat_list" %}',
          type: 'POST',
          data: {csrfmiddlewaretoken: '{{ csrf_token }}'},
          dataType: 'json',
          success: function(result) {
              var cat_ordered = []
              $.each(result, function(k, value) {
                  cat_ordered.push(value);
              });

              cat_ordered = cat_ordered.sort(function(a, b) {
                 if(a.name < b.name) return -1;
                 if(a.name > b.name) return 1;
                 return 0;
              })

              /* Agrega las categorias y sus capas */
              $.each(cat_ordered, function(i, value) {
                var divcat_id = 'm2c'+ value.id + 'l',
                    clayers = value.layers;

                if( $('#'+divcat_id).length ){
                    check_loop(clayers, divcat_id);
                } else {
                    html = '<div id="'+divcat_id+'" class="layerMenuTopLevelGroupContainer level2LabelBorderBottom category"'
                    +'style="display: block;"><h6 class="level2LabelText translatable level2Label" data-id="m2c'
                    + value.id + 'l" style="direction: ltr;">' + value.name+'<span class="label label-info pull-right">'
                    + Object.keys(clayers).length+'</span></h6></div>'

                    $('#cat_container').append(html);
                    check_loop(clayers, divcat_id);
                }
              });
              $("#cat_load").hide();
          },
          error : function(xhr,errmsg,err) {
              console.log('Error en el servidor')
              console.log(xhr.status + ": " + xhr.responseText);
          }
        });
    }
});

/* Crea dinamicamente la lista de capas por palabras clave */
$(".tagTrgg").click( function() {
    if ($('#tag_container').is(':empty')){
        $.ajax({
          url: '{% url "layers_tags_list" %}',
          type: 'POST',
          data: {csrfmiddlewaretoken: '{{ csrf_token }}'},
          dataType: 'json',
          success: function(result) {
              var ordered = []
              $.each(result, function(k, value) {
                  ordered.push(value);
              });

              ordered = ordered.sort(function(a, b) {
                 if(a.name < b.name) return -1;
                 if(a.name > b.name) return 1;
                 return 0;
              })

              /* Agrega palabras clave y sus capas */
              $.each(ordered, function(i, value) {
                var divcat_id = 'm3c'+ value.id + 'l',
                    clayers = value.layers;

                if( $('#'+divcat_id).length ){cd
                    check_loop(clayers, divcat_id);
                } else {
                    html = '<div id="'+divcat_id+'" class="layerMenuTopLevelGroupContainer level2LabelBorderBottom tag"'
                    +'style="display: block;"><h6 class="level2LabelText translatable level2Label" data-id="m3c'
                    + value.id + 'l" style="direction: ltr;">' + value.name+'<span class="label label-info pull-right">'
                    + Object.keys(clayers).length+'</span></h6></div>'

                    $('#tag_container').append(html);
                    check_loop(clayers, divcat_id);
                }
              });
              $("#tag_load").hide();
          },
          error : function(xhr,errmsg,err) {
              console.log('Error en el servidor')
              console.log(xhr.status + ": " + xhr.responseText);
          }
        });
    }
});

function validateURL(textval) {
  var urlregex = new RegExp(
        "^(http:\/\/){1}([0-9A-Za-z]+\.){1}([0-9A-Za-z]+\.)");
  return urlregex.test(textval);
}

$('#wmsUrl').on('input', function() {
	var input=$(this);
	var wmsUrl=input.val();
	var format = validateURL(wmsUrl);
	if(format){input.css('border', '2px solid green'); $("#addWmsBtn").prop('disabled', false); $('#invalidUrlMsg').hide();}
	else{input.css('border', '2px solid red');$("#addWmsBtn").prop('disabled', true); $('#invalidUrlMsg').show();}
});

//$("#addWmsBtn").click( function() {
//    if ($('#wmsLayers').is(':empty')) {
//        $("#wmsLayers").hide();
//        $('#wmsLoad').show();
//        var wmsUrl = $('#wmsUrl').val();
//        var nameSearch = $('#nameSearch').val();
//
//        $.ajax({
//          url: '{% url "external_wms" }',
//          type: 'POST',
//          data: {'wmsUrl': wmsUrl, 'nameSearch': nameSearch, csrfmiddlewaretoken: '{{ csrf_token }}'},
//          dataType: 'json',
//          success: function(result) {
//              var index = 0;
//              $.each(result, function(key, lay) {
//                html = '<div id="extLay'+index+'" class="layerMenuTopLevelGroupContainer extlayer">'
//                + '<div class="layerRow" id="L'+index+'" data-x0="'+lay.bbox[0]+'" data-x1="'+lay.bbox[2]+'" data-y0="'
//                + lay.bbox[1] +'" data-y1="'+lay.bbox[3]+'" data-title="'+lay.title+'">'
//                +'<label for="extLay'+index+'i" title="'+lay.title.slice(0,1).toUpperCase()+lay.title.slice(1)+'" style="margin-left:0px;">'
//                + '<input class="checkbox" type="checkbox" id="extLay'+index+'i" href="'+wmsUrl+'" value="'+key
//                + '" data-layerid="'+lay.id+'" data-info="'+lay.abstract+'" title="'+lay.title.slice(0,1).toUpperCase()+lay.title.slice(1)+'">'
//                + lay.title.slice(0,1).toUpperCase()+lay.title.slice(1)+'</label></div></div>';
//                $('#wmsLayers').append(html);
//                index++;
//              });
//              $("#wmsLoad").hide();
//              $("#wmsLayers").show();
//              $("#emptyWms").prop('disabled', false);
//          },
//          error : function(xhr,errmsg,err) {
//              $("#wmsLoad").hide();
//              $("#notFoundUrlMsg").show();
//              console.log('Error en el servidor')
//              console.log(xhr.status + ": " + xhr.responseText);
//          }
//        });
//    }
//});

/*Vacia lista de resultados wms externos*/
$("#emptyWms").click( function() {
    $("#wmsLayers").empty();
});

$('#searchBox').on('click focusin', function() {
    this.value = '';
});
</script>
