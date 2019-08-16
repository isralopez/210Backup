"use strict";
var bbx_edos = [];
var bbx_x = [];
var bbx_y = [];
let tematizing_mugs = [];
let clases_mugs = [];
var export_csv = [];
var topogeojsonmun;
var list_crops = {};
setBbxL();

/**Ready documment**/
$( document ).ready(function() {
    map.fitBounds(bbx_edos["99"])
    // topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/20.json', null, customLayerBus).addTo(map)
    $('#contactChoice4 option').remove()
    $('#contactChoice4')
      .append($('<option>', {value:'0'})
      .text('--SELECCIONA EL CULTIVO--'))
    {% for i in crops %}
    var key = {{i.0|safe}}
    var value = "{{i.1|safe}}"
    $('#contactChoice4')
        .append($('<option>', { value : key })
        .text(value))
    {% endfor %}
    $('#cicles option').remove()
    $('#cicles')
      .append($('<option>', { value : '0'})
      .text('--TODOS--'))
    {% for cic in ciclos %}
      var value = "{{cic.1|safe}}"
      $('#cicles')
        .append($('<option>', { value : value })
        .text(value))
    {% endfor %}
    {% for m in modalidades %}
      var value = "{{m.1|safe}}"
      $('#cicles')
        .append($('<option>', { value: value })
        .text(value))
    {% endfor %}
    $('.background-reading-risk').hide();

    $('.download-data-risk').click(function(){
       var edo = $('#contactChoice5').val();
       var site = $('#download-r').attr('site');
       if (edo=="99") {
         return;
       }
       if (typeof site === 'undefined') {
         return;
       }

       //Export geometrty JSON
       exportJSON(site, edo);
       //Export data CSV
       exportTableToCSV();
     });

     $('.min-win-risk').click(function(){
       $( "#lbl-legend-risk" ).hide();
       $('.max-win-risk').show();
       $(this).hide();
     });
     $('.max-win-risk').click(function(){
         $( "#lbl-legend-risk" ).show();
         $('.min-win-risk').show();
         $(this).hide();
     });

    $('#restart').click(function(){
      $('.background-reading-risk').show();
      // d3.selectAll('#sankey-viz > svg').remove();
      // doSnake();
      removeTopo();
      var edo = $('#contactChoice5').val();
      topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/'+edo+'.json', null, customLayerBus).addTo(map);
    });



});
/**Ready documment**/

/** Mapa **/
var southWest = L.latLng(10, -100),
      northEast = L.latLng(20, -90),
      bounds = L.latLngBounds(southWest, northEast);

var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> <a href="https://centrogeo.org.mx/">CentroGeo</a>'
  });
var gray = L.esri.basemapLayer("Gray");

var map = L.map('map', {
        center: [24.26, -101],
        zoom: 5,
        animate: true,
        layers: [gray],
        //maxBounds: bounds,
        maxZoom: 10,
        minZoom: 5
      });

/** Capa Mun **/

var layers_mun = [];

var customLayerBus = L.geoJson(null, {
    style: styleBus,
    onEachFeature: onEachFeatureBusiness
});

function styleBus(feature) {
  return {
 	        // weight: 2,
 	        // opacity: 1,
 	        // color: '#D41EB6',
 	        // fillColor: '#D41EB6',
 	        // fillOpacity: 0,
 	        // dashArray: '3',
        color: '#D41EB6',
        fillColor: '#D41EB6',
        weight: 1.0,
        opacity: 0.3,
        fillOpacity: 0
 		    };
}

function resetHighlightBusiness(e) {
  // console.log(e.target);
    // e.target.layer.setStyle({weight: 0.5});
    topogeojsonmun.setStyle({weight: 0.5});
}
/*Hover Features*/
function highlightFeatureBusiness(e) {
    var layer = e.target;
    layer.setStyle({weight: 2});
}


function zoomToFeatureBusiness(e) {
  map.fitBounds(e.target.getBounds());
}
//el bueno
function onEachFeatureBusiness(feature, layer) {
    layers_mun.push(layer);//onclick="graMun(this.id)"
  layer.bindPopup('<div><strong>Municipio: </strong>'+utf8Decode2(feature.properties.NOM_MUN)+'</div><div><strong>Historico: </strong><i class="fa fa-area-chart" onclick="drawLineChart(this.id)" id="id'+feature.properties.Cve_EntMun+'" title="Total de robos por municipio" aria-hidden="true"></i></div><div><strong>Reporte: </strong><i class="fa fa-file-pdf-o" onclick="report_view(this.id)" id="id'+feature.properties.Cve_EntMun+'" title="Ver Reporte" aria-hidden="true" style="cursor: pointer;"></i></div>');
    layer.on({
        mouseover: highlightFeatureBusiness,
        mouseout: resetHighlightBusiness,
        click: zoomToFeatureBusiness
    });
}

function setBbxL(){
  bbx_x = [21.6222664845356, -102.874176584546];
  bbx_y = [22.4595896830525, -101.835289447401];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["01"] = bbx;
  bbx_x = [27.9999999848061, -118.407649550879];
  bbx_y = [32.7186535752625, -112.654240299838];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["02"] = bbx;
  bbx_x = [22.8719540537057, -115.223764337377];
  bbx_y = [28.0000017041175, -109.413172978395];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["03"] = bbx;
  bbx_x = [17.8128711717366, -92.4687900217799];
  bbx_y = [20.84832728853, -89.1212291974072];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["04"] = bbx;
  bbx_x = [24.5426840653016, -103.96000192005];
  bbx_y = [29.8800242896194, -99.8431198067627];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["05"] = bbx;
  bbx_x = [18.3325939998872, -114.759455288635];
  bbx_y = [19.5125187714414, -103.486346451659];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["06"] = bbx;
  bbx_x = [14.5320983619492, -94.139155996379];
  bbx_y = [17.9852877980833, -90.3702137216039];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["07"] = bbx;
  bbx_x = [25.5588436166759, -109.074886167958];
  bbx_y = [31.7844862894973, -103.306768792693];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["08"] = bbx;
  bbx_x = [19.0482366638106, -99.3649242039483];
  bbx_y = [19.5927572799653, -98.9403028113257];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["09"] = bbx;
  bbx_x = [22.345083713078, -107.210132227248];
  bbx_y = [26.8448759117676, -102.472696981309];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["10"] = bbx;
  bbx_x = [19.9127501813221, -102.097032277151];
  bbx_y = [21.8394167186182, -99.6713026147652];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["11"] = bbx;
  bbx_x = [16.3159525831697, -102.184351179715];
  bbx_y = [18.8878467894171, -98.0072763938042];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["12"] = bbx;
  bbx_x = [19.5977581116736, -99.8595414365727];
  bbx_y = [21.3985207679097, -97.9849289109412];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["13"] = bbx;
  bbx_x = [18.9258718700513, -105.695403467336];
  bbx_y = [22.7502459395598, -101.51054174982];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["14"] = bbx;
  bbx_x = [18.3669428770738, -100.613091003664];
  bbx_y = [20.2858666666518, -98.5968666556226];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["15"] = bbx;
  bbx_x = [17.9149078601021, -103.738127072141];
  bbx_y = [20.3945563459586, -100.063032821642];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["16"] = bbx;
  bbx_x = [18.3323730775454, -99.4944141480939];
  bbx_y = [19.1317017270646, -98.632946651467];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["17"] = bbx;
  bbx_x = [20.6032209478144, -106.687726781448];
  bbx_y = [23.0845033392953, -103.720895546169];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["18"] = bbx;
  bbx_x = [23.1626831854073, -101.206762710012];
  bbx_y = [27.7991371864429, -98.4215760780924];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["19"] = bbx;
  bbx_x = [15.6571685974108, -98.5527073335255];
  bbx_y = [18.6696880653534, -93.8674267718396];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["20"] = bbx;
  bbx_x = [17.8609119303356, -99.0704942745153];
  bbx_y = [20.8399597469255, -96.7246830344269];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["21"] = bbx;
  bbx_x = [20.0150182872879, -100.59653571445];
  bbx_y = [21.6700054263226, -99.0430798533174];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["22"] = bbx;
  bbx_x = [17.8939855540657, -89.2965618140633];
  bbx_y = [21.6055041328782, -86.7104052700568];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["23"] = bbx;
  bbx_x = [21.1601538293591, -102.296038410036];
  bbx_y = [24.4915218276091, -98.3259670492722];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["24"] = bbx;
  bbx_x = [22.4671337656533, -109.447692603181];
  bbx_y = [27.0423059887849, -105.392220002523];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["25"] = bbx;
  bbx_x = [26.2969879325374, -115.053022327618];
  bbx_y = [32.4939131619264, -108.42427083532];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["26"] = bbx;
  bbx_x = [17.250893331235, -94.130025163867];
  bbx_y = [18.6509649531714, -90.9874591997836];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["27"] = bbx;
  bbx_x = [22.206965827776, -100.144950219012];
  bbx_y = [27.6791262156323, -97.1442236040225];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["28"] = bbx;
  bbx_x = [19.10507186002, -98.7083985865751];
  bbx_y = [19.7289174323247, -97.6254391011];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["29"] = bbx;
  bbx_x = [17.1369649102096, -98.6815466037805];
  bbx_y = [22.4717509147403, -93.6079398089036];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["30"] = bbx;
  bbx_x = [19.5511740956119, -92.3263000017498];
  bbx_y = [22.6137999994325, -87.5331452806868];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["31"] = bbx;
  bbx_x = [21.0418694024331, -104.353533038625];
  bbx_y = [25.1252355069575, -100.742324287397];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["32"] = bbx;
  bbx_x = [14.5320983619492, -118.407649550879];
  bbx_y = [32.7186535752625, -86.7104052700568];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["99"] = bbx;
}

/**
 * Decodes utf-8 encoded string back into multi-byte Unicode characters.
 */
function utf8Decode2(utf8String) {
  // console.log("va");
  // console.log(utf8String);
    if (typeof utf8String != 'string') throw new TypeError('parameter ‘utf8String’ is not a string');
    // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
    const unicodeString = utf8String.replace(
        /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
        function(c) {  // (note parentheses for precedence)
            var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
            return String.fromCharCode(cc); }
    ).replace(
        /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
        function(c) {  // (note parentheses for precedence)
            var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
            return String.fromCharCode(cc); }
    );
    return unicodeString;
}

/*Hover Features*/
function highlightFeatureBusiness(e) {
    var layer = e.target;
    layer.setStyle({weight: 2});
}

function getColorsM(values) {
		return values > clases_mugs[3]   ? '#e31a1c' :
			values > clases_mugs[2]   ? '#fd8d3c' :
			values > clases_mugs[1]   ? '#fecc5c' :
			values > clases_mugs[0]   ? '#ffffb2' :
			values > -1 ? '#fff' :
					 '#fff';
}
function getColorMugs(values) {
    if (values>=clases_mugs[3]) {
       return '#e31a1c';
    }else if (values>=clases_mugs[2]&&values<clases_mugs[3]) {
      return '#fd8d3c';
    }else if (values>clases_mugs[1]&&values<clases_mugs[2]) {
      return '#fecc5c';
    }else if (values<=clases_mugs[1]&&values>0) {
      return '#ffffb2';
    }else if (values==0) {
      return '#fff';
    }else {
      return 'blue';
    }
		// return values > clases_mugs[3]   ? '#e31a1c' :
		// 	values > clases_mugs[2]   ? '#fd8d3c' :
		// 	values > clases_mugs[1]   ? '#fecc5c' :
		// 	values > clases_mugs[0]   ? '#ffffb2' :
		// 	values > -1 ? '#fff' :
		// 			 '#fff';
}
/*Hover Features*/
function styleMugs(feature) {
  var values = getValuesMugs(feature.properties.Cve_EntMun);
  return {
 	        weight: 1,
 	        opacity: 1,
 	        color: '#525252',
 	        fillColor: getColorMugs(values),
 	        fillOpacity: 0.8
 		    };
}
var customLayerMugs = L.geoJson(null, {
    style: styleMugs,
    onEachFeature: onEachFeatureBusiness
});
function getValuesMugs(location_code){
    var values = 0;
    for (var clv in tematizing_mugs) {
    	if(location_code==tematizing_mugs[clv][2]){
			    values = tematizing_mugs[clv][1];
		  }
    }
    return values;
}

function onEachFeatureMugs(feature, layer) {
  // layer.bindPopup("<div><strong>Municipio:</strong> "+feature.properties.NOM_MUN+"</div><div><strong>Código postal:</strong> "+feature.properties.Cve_EntMun+"</div>");
    // layer.on({
    //     mouseover: highlightFeatureMugs,
    //     mouseout: resetHighlightMugs,
    //     click: zoomToFeatureMugs
    // });
}
function resetHighlightMugs(e) {
    topogeojsonmun.resetStyle(e.target);
}
function zoomToFeatureMugs(e) {
  // console.log(e.target.feature.properties);
  $('.mun-wage').html("Municipio: "+utf8Decode(e.target.feature.properties.NOM_MUN));
  business(e.target.feature.properties);
}
/*Hover Features*/
function highlightFeatureMugs(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        dashArray: '',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
// function remove_selection_purple() {
//     $.each(map._layers, function (ml) {
//         if (map._layers[ml].options.fillColor) {
//           if (map._layers[ml].options.fillColor=="#D41EB6") {
//             if (map._layers[ml].options.dashArray) {
//               // $('.tagQBus').removeClass('tag-selected');
//               map._layers[ml].setStyle({fillColor :map._layers[ml].options.dashArray});
//             }
//           }
//         }
//     })
// }
/*END tematizing BY MUGS*/
function changeCrops(){
  $('.background-reading-risk').show();
  var crop = $('#contactChoice4').val()
  var year = $('#contactChoice3').val()
  var edo = $('#contactChoice5').val()
  if (crop=='0') {
    alert('selecciona el cultivo')
    return
  }
  var query_data = {
     'year': year[0],
     'crop': crop,
     'edo': edo
   }
   // console.log(query_data);
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getCropSiapCharts" %}',
  type: 'POST',
  success : function(data) {
    console.log("ni mais palomero")
    console.log(data)

    var jsonObj = data[0]
    export_csv = data[3];
    tematizing_mugs = data[1];
    clases_mugs = data[2];
    if (edo=="99") {
      for (i = 0; i < tematizing_mugs.length; i++) {
        var location_code = tematizing_mugs[i][2].substr(0,2)
        topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/'+location_code+'.json', null, customLayerMugs).addTo(map);
      }
    }else {
      for (i = 0; i < tematizing_mugs.length; i++) {
        topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/'+edo+'.json', null, customLayerMugs).addTo(map);
      }
      //legend
        // $( "#lbl-legend-risk" ).html(getLeyendMapRisk(999,list_crops[crop]));
    }
    drawoBoobleCrop(jsonObj, year);
  },
  error : function(message) {
          console.log(message);
       }
  });
}
function getLeyendMapRisk(id_lay, title){
  // id_lay, title
	var classe0 = Math.round(clases_mugs[0] * 100) / 100;
	var classe1 = Math.round(clases_mugs[1] * 100) / 100;
	var classe2 = Math.round(clases_mugs[2] * 100) / 100;
	var classe3 = Math.round(clases_mugs[3] * 100) / 100;

	var classe00 = classe0+"-"+classe1;
	var classe11 = classe1+"-"+classe2;
	var classe22 = classe2+"-"+classe3;
	var classe33 = classe3+"+";

  $('.legend-r').show();
  $('#window-legend').show();
  $('.min-win-risk').show();
  $('.titles-leg').html(""+title);

  var legend_map = '<table width="50%;" id="legend-colors-mug">\
    <tr>\
    <td class="legend-color-mug legend-color-mug-4" id="4" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);"></td><td class="lbl-data">No Data</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug legend-color-mug-0" id="0" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);"></td><td class="lbl-data">'+classe00+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug legend-color-mug-1" id="1" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);"></td><td class="lbl-data">'+classe11+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug legend-color-mug-2" id="2" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);"></td><td class="lbl-data">'+classe22+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug legend-color-mug-3" id="3" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);"></td><td class="lbl-data">'+classe33+'</td>\
    </tr></table>';
    return legend_map;
}
//"BOX(-102.874176584546 21.6222664845356,-101.835289447401 22.4595896830525)"
function ChangeEdo() {
  var edo = $('#contactChoice5').val()
  var year = $('#contactChoice3').val()
  var cicle = $('#cicles').val()
  $('.background-reading-risk').show()
  var query_data = {
    'year': year[0],
    'edo': edo,
    'cicle': cicle
  }
     // makeTopo(edo)
     $.ajax({
     data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
        csrfmiddlewaretoken: '{{ csrf_token }}'
       },
    url: '{% url "getCropList" %}',
    type: 'POST',
    success : function(data) {
      $('.background-reading-risk').hide()
      $('#contactChoice4 option').remove()
      $('#contactChoice4')
        .append($('<option>', {value:'0'})
        .text('--SELECCIONA EL CULTIVO--'))
      for (var i = 0; i < data.length; i++) {
        var key = data[i][0]
        var value = data[i][1]
        list_crops[key] = value
        $('#contactChoice4')
        .append($('<option>', { value : key })
        .text(value))
      }


    },
    error : function(message) {
            console.log(message);
         }
    });


}
function removeTopo(){
  if (typeof slug  !== "undefined") {
    $('.legend-r').hide();
    topogeojsonmun.eachLayer(function (layer) {
      layer.remove();
    });
  }
}
function drawoBoobleCrop(jsonObj, year){
  console.log("vamo a graficar");
  var titles = ['Municipio', 'Valor de la producción', 'Cosecha', 'Estado', 'Rendimiento', 'location_code'];
  var obj = jsonObj.sort(function(a, b){return a-b});
  obj.unshift(titles);

  google.charts.load('current', {'packages':['corechart', 'controls']});
  google.charts.setOnLoadCallback(drawSeriesChart);

function drawSeriesChart() {

  var data = google.visualization.arrayToDataTable(obj);

  // Create a dashboard.
  var dashboard = new google.visualization.Dashboard(
      document.getElementById('dashboard_div'));

  // Create a range slider, passing some options
  var donutRangeSlider = new google.visualization.ControlWrapper({
    'controlType': 'NumberRangeFilter',
    'containerId': 'filter_div',
    'options': {
      'filterColumnLabel': 'Rendimiento'
    }
  });

  // var options = {
  //   title: 'Correlación entre Valor de la producción, Cosechada, Rendimiento ' +
  //          'municipios ('+year+')',
  //   hAxis: {title: 'Cosechada'},
  //   vAxis: {title: 'Valor de la producción'},
  //   bubble: {textStyle: {fontSize: 11}}
  // };
  //
  // var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div'));
  // chart.draw(data, options);

  // Create a pie chart, passing some options
  var pieChart = new google.visualization.ChartWrapper({
    'chartType': 'BubbleChart',
    'containerId': 'chart_div',
    'options': {
      'width': 900,
      'height': 500,
      'title': 'Correlación entre Valor de la producción, Cosechada, Rendimiento ' +
               'municipios ('+year+')',
      'pieSliceText': 'value',
      'legend': 'right'
    }
  });
//event
  function selectHandler() {
    var selectedItem = pieChart.getChart().getSelection()[0];
     if ( selectedItem ) {
         var location_code = pieChart.getDataTable().getValue(selectedItem.row, 5);
         console.log(location_code)
         tematizeMapForCrapMun(location_code)
     }
     }

     google.visualization.events.addListener(pieChart, 'select', selectHandler);

  // Establish dependencies, declaring that 'filter' drives 'pieChart',
  // so that the pie chart will only display entries that are let through
  // given the chosen slider range.
  dashboard.bind(donutRangeSlider, pieChart);

  // Draw the dashboard.
  dashboard.draw(data);

  $('.background-reading-risk').hide();

    }
}


function makeTopo(edo){
  map.fitBounds(bbx_edos[edo])
  removeTopo()
  if (edo=="99") {
    topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/republica/republic_mun.json',null,customLayerMugs).addTo(map)
  }else {
    topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/'+edo+'.json', null, customLayerBus).addTo(map);
  }
}
function downloadCSV(csv, title) {
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = title;
  hiddenElement.click();
}
function exportJSON(site, edo){
  var file_path = site+'uploaded/apps/edos_json/'+edo+'.json';
  console.log(file_path);
  var a = document.createElement('A');
  a.href = file_path;
  a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function exportTableToCSV() {
    var name_edo = $('#contactChoice5').find(":selected").text();

  var csv = 'Delitos del, Fuero Común, Secretariado, Ejecutivo del, Sistema Nacional, de Seguridad Pública\
      \nEstado:, '+name_edo+' \n Clv_edo,Location code \
    , Municipio, Bien legal, Tipo de robo, Subtipo\
    , Modalidad, Tipo, Total de denuncias, Año\n';
   export_csv.forEach(function(row) {
           csv += row.join(',');
           csv += "\n";
   });
   downloadCSV(csv, 'produccion_agricola.csv');
}
function drawDashBoard(jsonObj, year){

  // Load the Visualization API and the controls package.
  google.charts.load('current', {'packages':['corechart', 'controls']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawDashboard);

  // Callback that creates and populates a data table,
  // instantiates a dashboard, a range slider and a pie chart,
  // passes in the data and draws it.
  function drawDashboard() {

    // Create our data table.
    var data = google.visualization.arrayToDataTable([
      ['Name', 'Donuts eaten'],
      ['Michael' , 5],
      ['Elisa', 7],
      ['Robert', 3],
      ['John', 2],
      ['Jessica', 6],
      ['Aaron', 1],
      ['Margareth', 8]
    ]);

    // Create a dashboard.
    var dashboard = new google.visualization.Dashboard(
        document.getElementById('dashboard_div'));

    // Create a range slider, passing some options
    var donutRangeSlider = new google.visualization.ControlWrapper({
      'controlType': 'NumberRangeFilter',
      'containerId': 'filter_div',
      'options': {
        'filterColumnLabel': 'Donuts eaten'
      }
    });

    // Create a pie chart, passing some options
    var pieChart = new google.visualization.ChartWrapper({
      'chartType': 'PieChart',
      'containerId': 'chart_div',
      'options': {
        'width': 300,
        'height': 300,
        'pieSliceText': 'value',
        'legend': 'right'
      }
    });

    // Establish dependencies, declaring that 'filter' drives 'pieChart',
    // so that the pie chart will only display entries that are let through
    // given the chosen slider range.
    dashboard.bind(donutRangeSlider, pieChart);

    // Draw the dashboard.
    dashboard.draw(data);
  }
}

function tematizeMapForCrapMun(location_code){
  $('.background-reading-risk').show();
  var crop = $('#contactChoice4').val()
  var year = $('#contactChoice3').val()
  var edo = $('#contactChoice5').val()
  if (crop=='0') {
    alert('selecciona el cultivo')
    return
  }
  var query_data = {
     'year': year[0],
     'crop': crop,
     'location_code': location_code
   }
   console.log(query_data);
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getCropSiapLocationCode" %}',
  type: 'POST',
  success : function(data) {
    console.log("ni mais palomero")
    console.log(data)
    $('.background-reading-risk').hide()
    var jsonObj = data[0]
    export_csv = data[3];
    tematizing_mugs = data[1];
    clases_mugs = data[2];
    // drawoBoobleCrop(jsonObj, year);
    console.log(tematizing_mugs);
    var edo = location_code.substr(0,2)
    console.log(edo);
      for (i = 0; i < tematizing_mugs.length; i++) {
        console.log("evos");
        console.log(tematizing_mugs[i]);//clvmun
        topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/'+edo+'.json', null, customLayerMugs).addTo(map);
      }
      //legend
        // $( "#lbl-legend-risk" ).html(getLeyendMapRisk(999,list_crops[crop]));

  },
  error : function(message) {
          console.log(message);
       }
  });
}
