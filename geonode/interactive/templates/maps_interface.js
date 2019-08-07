<script type="text/javascript">
  var progress = setInterval(function () {
    var $bar = $("#bar");
    $bar.width($bar.width() + 700);
  }, 800);

  $(window).load(function() {
    $("#bar").width($(this).width());
    $(".loader").fadeOut(2000);
    $(".container_layers").css('height', $(this).height()-140);
    //$(".leaflet-left").addClass( "leaflet-control-openmenu" );
    $('#searchBox').addClass( "form-control" );
  });
  $( window ).resize(function() {
    $(".container_layers").css('height', $(this).height()-140);
  });

  /*Eliminar  footer*/
  $('#bottom-nav').css('display', 'none');
  $('#footer').css('display', 'none');

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

  /*Display categorias*/
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
    $(".labelsContainer").addClass( "translateLayerLabelsLeft" );
    $($(this).attr('data-id')).addClass( "layerMenuIconDivClicked" );
    $($(this).attr('data-id')+'c').show( "slow" );
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

  /*Category click*/
  $(".level2LabelText").click(function() {
    if ($("#"+$(this).attr('data-id')+" .layer").is(":visible")){
      $("#"+$(this).attr('data-id')+" .layer").hide( "slow" );
    }else{
      $(".layer").hide( "slow" );
      $("#"+$(this).attr('data-id')+" .layer").show( "slow" );
    }
  });

  /* Back Menu */
  $(".backToListButton").click(function() {
    //$(".layer").hide( "slow" );
    $(".narrative").hide( "slow" );
    $(".layerGroupContainer").hide( "slow" );
    $(".labelsContainer").removeClass( "translateLayerLabelsLeft" );
    $(".layerMenuIconDiv").removeClass( "layerMenuIconDivClicked" );
    $(".layerMenuIconDiv").removeClass( "layerMenuIconDivSelected" );
  });

  var layers = null;
  var mbAttr = 'AdeSur &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
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
  /*Print*/
//  L.easyPrint({
//    title: 'Imprimir mapa',
//    elementsToHide: 'p, h2, a, i, span, .layerMenu, .layerMenu2'
//  }).addTo(map);
  /*zoomBox*/
  L.control.zoomBox({
    modal: true
  }).addTo(map);

  //add configured controls coordinates
//  L.control.coordinates({
//    position:"bottomleft",
//    decimals:6,
//    decimalSeperator:".",
//    labelTemplateLat:"Latitud: {y}",
//    labelTemplateLng:"Longitud: {x}"
//  }).addTo(map);

  /* Checkbox change event */
  $(".checkbox").change(function() {
    mapid = $(this).attr('data-mapid');
    resetMap();
    ajaxMap(mapid);
    $('#l2').show();
    $('#l3').show();
    $('#l2t').show();
    $('#l3t').show();
  });

  /* Checkbox change event */
  $(".checkbox2").change(function() {
    var checkId;
    var leafletId;
    var typename = this.value;
    dataId = $(this).attr('id');
    dataInfo = $(this).attr('data-info');

    if(this.checked) {
        theLayer = L.tileLayer.betterWms($(this).attr('href'), {
          layers: typename,
          format: 'image/png',
          transparent: true
        });

        checkboxes.push(theLayer);
        map.addLayer(theLayer);
        $.each(checkboxes, function(i, val) {
          if (theLayer._leaflet_id == val._leaflet_id) {
            leafletId = val._leaflet_id;
            checkId = i;
            var zIndex = 100+i;
            val.setZIndex(zIndex);
          }
        });

        imglegend = $(this).attr('href')+'?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer='+this.value+'&transparent=true" title="'+this.title;

        theLegend = '<div id="l'+dataId+'" leaflet-id="'+leafletId+'" typename="'+typename+'" data-title="'+this.title+'" class="rowlegend">'
        + '<div class="l-title"><i data-toggle="tooltip" title="Desactivar" class="fa fa-check-square" data-id="l'+dataId+'"></i> '+this.title+'</div>'
        + '<div class="rlayer"><div class="tools" style="display:none;"><i data-toggle="tooltip" title="Leyenda" data-id="l'+dataId+'" class="fa fa-list-alt"></i>'
        + '<i title="Descripción" class="fa fa-info" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="left" data-content="'+dataInfo+'"></i><i data-toggle="tooltip" title="Eliminar" class="fa fa-times" data-value="'+this.value+'" data-id="'+dataId+'"></i></div>'
        + '</div><i data-toggle="tooltip" title="Herramientas" data-id="l'+dataId+'" class="vtools animationTransition fa fa-chevron-left"></i>'
        + '<div class="thumb"><a class="thumbnail2" href="#" data-image-id="" data-title="'+this.title+'" data-image="'+imglegend
        + '" data-target="#image-gallery"><img class="img-responsive" src="'+imglegend+'"/></a></div></div>';

        $( "#addlegend" ).prepend(theLegend);

    }else{
      leafletId = $("#l"+dataId).attr("leaflet-id");
      $("#l"+dataId).fadeOut(200, function(){ $(this).remove();});
      for (var i = 0; i < checkboxes.length; i++) {
        if (leafletId == checkboxes[i]._leaflet_id) {
          map.removeLayer(checkboxes[i]);
          checkboxes.splice(i,1);
        }
      }
    }

        /*Slider*/
//    d3.select('#'+dataId+'s').call(d3.slider().value(100).on("slide", function(evt, value) {
//      var element_slider = evt.toElement.title;
//      var element_id = evt.toElement.id;
//      var post = $('#'+element_id).attr('data-checkid');
//      var num = value/100;
//      num = num.toFixed(2);
//      checkboxes[post].setOpacity(num);
//      num = (num*10).toFixed()*10;
//      d3.select('#'+ $('#'+element_id).attr('data-id') + ' .slider span').text(num.toFixed()+"%");
//    }));
    $("#l"+dataId+ " .slider").slideToggle('slow');
  });

  /* Map Reset in window */
  function resetMap() {
    $( "#addlegend" ).empty();
    $('.checkbox2').removeAttr('checked');
    for (var i = 0; i < checkboxes.length; i++) {
      map.removeLayer(checkboxes[i]);
    }
    checkboxes = [];
    $('input[name=baseLayers]:radio').filter('[value="Open Street Map"]').trigger('click');
  };
  /*Drawing */
  var featureGroup = L.featureGroup().addTo(map);
/*DrawControl is necesary for drawing custom */
  var drawControl = new L.Control.Draw({
        edit: {
          featureGroup: featureGroup
        },
        draw: {
          polygon: false,
          polyline: false,
          rectangle: false,
          circle: false,
          marker: true,
        }
  });/*Not adding for map, but is necesary for drawing custom */
  /*Marker for comments */
var MarkerDrawer = new L.Draw.Marker(map, { draggable: true });
  /*Buscador por texto*/
  $('input#text_search_input_l').quicksearch('div#result_text div.layer');
  $( "#text_search_input_l" ).bind('keyup', function(e) {
    if (this.value.length >= 3) {
      $("#m1c .layerRow").show( "fast" );
    }
  });

  /*Ajax config del mapa*/
  function ajaxMap(mapid){

    $.ajax({
        data: {'mapid': mapid },
        url: '/interactive/maps/ajax/',
        type: 'GET',
        success : function(data) {
            sAjaxMap(data);
        },
        error : function(message) {
                console.log(message);
             }
        });
  }

  function drawPie( pieName, dataSet, selectString, colors, margin, outerRadius, innerRadius, sortArcs ) {
// Color Scale Handling...
  var colorScale = d3.scale.category20c();
  switch (colors)
  {
    case "colorScale10":
      colorScale = d3.scale.category10();
      break;
    case "colorScale20":
      colorScale = d3.scale.category20();
      break;
    case "colorScale20b":
      colorScale = d3.scale.category20b();
      break;
    case "colorScale20c":
      colorScale = d3.scale.category20c();
      break;
    default:
      colorScale = d3.scale.category20c();
  };

  var canvasWidth = 700;
var pieWidthTotal = outerRadius * 2;;
var pieCenterX = outerRadius + margin/2;
var pieCenterY = outerRadius + margin/2;
  var legendBulletOffset = 30;
  var legendVerticalOffset = outerRadius - margin;
  var legendTextOffset = 20;
  var textVerticalSpace = 20;

var canvasHeight = 0;
  var pieDrivenHeight = outerRadius*2 + margin*2;
  var legendTextDrivenHeight = (dataSet.length * textVerticalSpace) + margin*2;
// Autoadjust Canvas Height
if (pieDrivenHeight >= legendTextDrivenHeight)
{
canvasHeight = pieDrivenHeight;
}
else
{
canvasHeight = legendTextDrivenHeight;
}

  var x = d3.scale.linear().domain([0, d3.max(dataSet, function(d) { return d.magnitude; })]).rangeRound([0, pieWidthTotal]);
  var y = d3.scale.linear().domain([0, dataSet.length]).range([0, (dataSet.length * 20)]);


  var synchronizedMouseOver = function() {
    var arc = d3.select(this);
    var indexValue = arc.attr("index_value");

    var arcSelector = "." + "pie-" + pieName + "-arc-" + indexValue;
    var selectedArc = d3.selectAll(arcSelector);
    selectedArc.style("fill", "Maroon");

    var bulletSelector = "." + "pie-" + pieName + "-legendBullet-" + indexValue;
    var selectedLegendBullet = d3.selectAll(bulletSelector);
    selectedLegendBullet.style("fill", "Maroon");

    var textSelector = "." + "pie-" + pieName + "-legendText-" + indexValue;
    var selectedLegendText = d3.selectAll(textSelector);
    selectedLegendText.style("fill", "Maroon");
  };

  var synchronizedMouseOut = function() {
    var arc = d3.select(this);
    var indexValue = arc.attr("index_value");

    var arcSelector = "." + "pie-" + pieName + "-arc-" + indexValue;
    var selectedArc = d3.selectAll(arcSelector);
    var colorValue = selectedArc.attr("color_value");
    selectedArc.style("fill", colorValue);

    var bulletSelector = "." + "pie-" + pieName + "-legendBullet-" + indexValue;
    var selectedLegendBullet = d3.selectAll(bulletSelector);
    var colorValue = selectedLegendBullet.attr("color_value");
    selectedLegendBullet.style("fill", colorValue);

    var textSelector = "." + "pie-" + pieName + "-legendText-" + indexValue;
    var selectedLegendText = d3.selectAll(textSelector);
    selectedLegendText.style("fill", "Blue");
  };

  var tweenPie = function (b) {
    b.innerRadius = 0;
    var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
    return function(t) {
      return arc(i(t));
    };
  }
   $(selectString).html("");

  // Create a drawing canvas...
  var canvas = d3.select(selectString)
    .append("svg:svg") //create the SVG element inside the <body>
      .data([dataSet]) //associate our data with the document
      .attr("width", canvasWidth) //set the width of the canvas
      .attr("height", canvasHeight) //set the height of the canvas
      .append("svg:g") //make a group to hold our pie chart
        .attr("transform", "translate(" + pieCenterX + "," + pieCenterY + ")") // Set center of pie

// Define an arc generator. This will create <path> elements for using arc data.
  var arc = d3.svg.arc()
      .innerRadius(innerRadius) // Causes center of pie to be hollow
      .outerRadius(outerRadius);

// Define a pie layout: the pie angle encodes the value of dataSet.
// Since our data is in the form of a post-parsed CSV string, the
// values are Strings which we coerce to Numbers.
  var pie = d3.layout.pie()
.value(function(d) { return d.magnitude; })
.sort(function(a, b) {if (sortArcs==1) { return b.magnitude - a.magnitude; } else { return null; } });

  // Select all <g> elements with class slice (there aren't any yet)
  var arcs = canvas.selectAll("g.slice")
    // Associate the generated pie data (an array of arcs, each having startAngle,
    // endAngle and value properties)
    .data(pie)
    // This will create <g> elements for every "extra" data element that should be associated
    // with a selection. The result is creating a <g> for every object in the data array
    // Create a group to hold each slice (we will have a <path> and a <text>      // element associated with each slice)
.enter().append("svg:a")
      .attr("xlink:href", function(d) { return d.data.link; })
      .append("svg:g")
        .attr("class", "slice")    //allow us to style things in the slices (like text)
        // Set the color for each slice to be chosen from the color function defined above
        // This creates the actual SVG path using the associated data (pie) with the arc drawing function
        .style("stroke", "White" )
        .attr("d", arc);

  arcs.append("svg:path")
    // Set the color for each slice to be chosen from the color function defined above
    // This creates the actual SVG path using the associated data (pie) with the arc drawing function
    .attr("fill", function(d, i) { return colorScale(i); } )
    .attr("color_value", function(d, i) { return colorScale(i); }) // Bar fill color...
    .attr("index_value", function(d, i) { return "index-" + i; })
    .attr("class", function(d, i) { return "pie-" + pieName + "-arc-index-" + i; })
    .style("stroke", "White" )
    .attr("d", arc)
    .on('mouseover', synchronizedMouseOver)
    .on("mouseout", synchronizedMouseOut)
    .transition()
      .ease("bounce")
      .duration(2000)
      .delay(function(d, i) { return i * 50; })
      .attrTween("d", tweenPie);

  // Add a magnitude value to the larger arcs, translated to the arc centroid and rotated.
  arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
    .attr("transform", function(d) { //set the label's origin to the center of the arc
      //we have to make sure to set these before calling arc.centroid
      d.outerRadius = outerRadius; // Set Outer Coordinate
      d.innerRadius = innerRadius; // Set Inner Coordinate
      return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    .style("fill", "White")
    .style("font", "normal 12px Arial")
    .text(function(d) { return d.data.magnitude; });

  // Computes the angle of an arc, converting from radians to degrees.
  function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  }

  // Plot the bullet circles...
  canvas.selectAll("circle")
    .data(dataSet).enter().append("svg:circle") // Append circle elements
    .attr("cx", pieWidthTotal + legendBulletOffset)
    .attr("cy", function(d, i) { return i*textVerticalSpace - legendVerticalOffset; } )
    .attr("stroke-width", ".5")
    .style("fill", function(d, i) { return colorScale(i); }) // Bullet fill color
    .attr("r", 5)
    .attr("color_value", function(d, i) { return colorScale(i); }) // Bar fill color...
    .attr("index_value", function(d, i) { return "index-" + i; })
    .attr("class", function(d, i) { return "pie-" + pieName + "-legendBullet-index-" + i; })
    .on('mouseover', synchronizedMouseOver)
    .on("mouseout", synchronizedMouseOut);

  // Create hyper linked text at right that acts as label key...
  canvas.selectAll("a.legend_link")
    .data(dataSet) // Instruct to bind dataSet to text elements
    .enter().append("svg:a") // Append legend elements
      .attr("xlink:href", function(d) { return d.link; })
      .append("text")
        .attr("text-anchor", "center")
        .attr("x", pieWidthTotal + legendBulletOffset + legendTextOffset)
        //.attr("y", function(d, i) { return legendOffset + i*20 - 10; })
    //.attr("cy", function(d, i) {    return i*textVerticalSpace - legendVerticalOffset; } )
        .attr("y", function(d, i) { return i*textVerticalSpace - legendVerticalOffset; } )
        .attr("dx", 0)
        .attr("dy", "5px") // Controls padding to place text in alignment with bullets
        .text(function(d) { return d.legendLabel;})
        .attr("color_value", function(d, i) { return colorScale(i); }) // Bar fill color...
        .attr("index_value", function(d, i) { return "index-" + i; })
        .attr("class", function(d, i) { return "pie-" + pieName + "-legendText-index-" + i; })
        .style("fill", "Blue")
        .style("font", "normal 1.5em Arial")
        .on('mouseover', synchronizedMouseOver)
        .on("mouseout", synchronizedMouseOut);
        $(selectString).css({ opacity: 1.0 });

};

function getLegend(d,aD){ // Utility function to compute percentage.
  var porcentaje
           return ""+d+","+aD+"";
};
$('#searchBox').on('click focusin', function() {
    this.value = '';
});
</script>
