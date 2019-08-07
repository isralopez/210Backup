<script type="text/javascript">
var analisys_layer_base = [];
var analisys_layer_base_name = [];
var global_layers = null;
/*Success ajaxMap*/
function sAjaxMap(data) {
  var layers = data.map.layers;
  global_layers = layers;
  var x = data.map.center[1];
  var y = data.map.center[0];
  var point = new L.Point(y, x); // Lon/Lat
  var latlng = L.Projection.SphericalMercator.unproject(point);
  //map.setView(latlng, data.map.zoom);//i comment this line because i use before
//  checkCookie(data,latlng);//This method has the setView for the map
  $('#mapTitle').text(data.about.title).fadeIn();
  $.each(layers, function(index, val) {
    if (val.group != 'background'){
      var dataId = 'i'+index;
      var dataInfo = ""
      if(typeof val.capability != "undefined"){
          dataInfo = '<i title="Descripción" class="fa fa-info" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="left" data-content="'+val.capability.abstract+'"></i>';
      }
      var layerStyle = typeof val.styles != "undefined" ? val.styles : '';
      var theLayer = L.tileLayer.betterWms(data.sources[val.source].url, {
            layers: val.name,
            format: val.format,
            transparent: true,
            styles: layerStyle
          });

      map.addLayer(theLayer);
      checkboxes.push(theLayer);
      var leafletId = theLayer._leaflet_id;

      for (var i = 0; i < checkboxes.length; i++) {
        if (leafletId == checkboxes[i]._leaflet_id) {
          var checkId = i;
          var zIndex = 100+i;
          var faCkeck = 'fa-check-square';
          var display = 'style="display:block;"';
          checkboxes[i].setZIndex(zIndex);
          if(!val.visibility){
            map.removeLayer(checkboxes[i]);
            faCkeck = 'fa-square-o';
            display = 'style="display:none;"';
          }
        }
      }
      var bboxLegend = '';
      if ('capability' in val) {
        var bbox= val.capability.llbbox;
        bboxLegend = '" data-x0="'+bbox[0]+'" data-x1="'+bbox[2]+'" data-y0="' + bbox[1] +'" data-y1="'+ bbox[3];
      }
      var imglegend = data.sources[val.source].url+'?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer='+val.name+'&style='+layerStyle+'&transparent=true" title="'+val.title;
      var theLegend = '<div id="l'+dataId+'" leaflet-id="'+leafletId+'" typename="'+val.name+'" data-title="'+ val.title + bboxLegend
      + '" class="rowlegend"><div class="l-title"><i data-toggle="tooltip" title="Desactivar" class="fa '+faCkeck
      + '" data-id="l'+dataId+'"></i> '+val.title+'</div><div class="rlayer">'
      + '<div class="tools" style="display:none;"><i data-toggle="tooltip" title="Leyenda" data-id="l'+dataId+'" class="fa fa-list-alt"></i>'
      + dataInfo +'<i data-toggle="tooltip" title="Eliminar" class="fa fa-times" data-value="'+this.name+'" data-id="'+dataId+'"></i></div>'
      + '</div><i data-toggle="tooltip" title="Herramientas" data-id="l'+dataId+'" class="vtools animationTransition fa fa-chevron-left"></i>'
      + '<div class="thumb"'+display+'><a class="thumbnail2" href="#" data-image-id="" data-title="'+val.title+'" data-image="'
      + imglegend+'" data-target="#image-gallery"><img class="img-responsive" src="'+imglegend+'" style="'+layerStyle+'"/></a></div></div>';
      $( "#addlegend" ).prepend(theLegend);

      /*Code for app intersection_tool  */
       var name_l = val.name.split(":");
       analisys_layer_base.push(name_l[1]);
       analisys_layer_base_name.push(val.title);
       /*Code for app intersection_tool*/

      /*Slider*/
//      d3.select('#'+dataId+'s').call(d3.slider().value(100).on("slide", function(evt, value) {
//        var element_slider = evt.toElement.title;
//        var element_id = evt.toElement.id;
//        var post = $('#'+element_id).attr('data-checkid');
//        var num = value/100;
//        num = num.toFixed(2);
//        checkboxes[post].setOpacity(num);
//        num = (num*10).toFixed()*10;
//        d3.select('#'+ $('#'+element_id).attr('data-id') + ' .slider span').text(num.toFixed()+"%");
//      }));
      $("#l"+dataId+ " .slider").slideToggle('slow');
      if($( ".layerMenu2" ).hasClass( "lm-closed" )){
        var window_w = $( window ).width();
        {% if 'interactive' in request.get_full_path %}
        if(window_w >= 1280){
          $(".layerMenu2").removeClass( "translateLayerListRight2" ).removeClass( "lm-closed" ).addClass( "translateLayerListLeft2" );
          $(".fa-list").removeClass( "fa-list" ).addClass( "fa-caret-right" );
        }
        {% endif %}
      }
    }else{
      if(val.visibility){
        $('input[name=baseLayers]:radio').filter('[value="'+val.title+'"]').trigger('click');
      }
    }
  });
}

/* EVENTOS DE LA LEYENDA DE CAPAS */

/* Layer Tools */
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
  $("#"+$(this).attr('data-id') + " .slider").toggle('slow');
});

$("#addlegend").on("click", ".fa-check-square", function() {
  var dataId = $(this).attr('data-id');
  var leafletId = $("#"+dataId).attr("leaflet-id");
  for (var i = 0; i < checkboxes.length; i++) {
    if (leafletId == checkboxes[i]._leaflet_id) {
      map.removeLayer(checkboxes[i]);
    }
  }
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
  var dataId = $(this).attr('data-id');
  var leafletId = $("#"+dataId).attr("leaflet-id");
  for (var i = 0; i < checkboxes.length; i++) {
    if (leafletId == checkboxes[i]._leaflet_id) {
      map.addLayer(checkboxes[i]);
    }
  }
  if (!$("#"+$(this).attr('data-id')+" .thumb").is(":visible")){
    $("#"+$(this).attr('data-id') + " .thumb").toggle('slow');
  }
  $(this).addClass('fa-check-square');
  $(this).removeClass('fa-square-o');
});

$("#addlegend").on("click", ".fa-times", function() {
  var dataId = $(this).attr('data-id');
  var leafletId = $("#l"+dataId).attr("leaflet-id");
  $('#'+dataId).removeAttr('checked');
  $("#l"+dataId).fadeOut(200, function(){ $(this).remove();});
  for (var i = 0; i < checkboxes.length; i++) {
     if (leafletId == checkboxes[i]._leaflet_id) {
       map.removeLayer(checkboxes[i]);
       checkboxes.splice(i,1);
     }
  }
});

/* Ordena capas */
$(function () {
  $("#addlegend").sortable({
  tolerance: 'pointer',
  revert: 'invalid',
  items: "> div.rowlegend",
  placeholder: 'placeholder',
  forcePlaceholderSize: true,
  forceHelperSize: true,
  axis: "y",
  cancel: "div.slider",
  cursor: "row-resize",
  stop: function(event, ui) {
    var sortedIDs = $(this).sortable('toArray');
    $.each(sortedIDs.reverse(), function(index, val) {
      var leafletId = $('#'+val).attr('leaflet-id');
      var zIndex = 100+index;
      var i=0;
      while (leafletId != checkboxes[i]._leaflet_id){
        i++;
      }
      checkboxes[i].setZIndex(zIndex);
    });
  }
  });
});

/*Seleccion de layer*/
$("#addlegend").on("click", ".rowlegend", function() {
  $('.rowlegend').removeClass('layer_select');
  $(this).addClass('layer_select');
  $(".toolsSelected").show();
  $('.toolsSelected .fa').addClass('select');
});

/*Swipe*/
function clip() {
  if ($("#range").is(":visible")){
    var nw = map.containerPointToLayerPoint([0, 0]),
        se = map.containerPointToLayerPoint(map.getSize()),
        clipX = nw.x + (se.x - nw.x) * range.value,
        idLayerSwipe = $(".layer_select").attr('leaflet-id');
    for (var i = 0; i < checkboxes.length; i++) {
      if (idLayerSwipe == checkboxes[i]._leaflet_id) {
        checkboxes[i].getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
      }
    }
  }
}

$(".fa-eye-slash").click(function() {
    if ($("#range").is(":visible")){
      $("#range").hide( "slow" );
      for (var i = 0; i < checkboxes.length; i++) {
        var container = checkboxes[i].getContainer();
        if (container) container.style.clip = '';
      }
    } else {
      $("#range").show( "slow" );
      range['oninput' in range ? 'oninput' : 'onchange'] = clip;
      clip();
    }
});
/* Zoom a la capa */
$('.fa-search').click(function(event) {
  var southWest = L.latLng($(".layer_select").attr('data-y0'), $(".layer_select").attr('data-x0')),
  northEast = L.latLng($(".layer_select").attr('data-y1'), $(".layer_select").attr('data-x1')),
  bounds = L.latLngBounds(southWest, northEast);
  map.fitBounds(bounds);
});
</script>
