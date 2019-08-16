
"use strict";
var isWait = false;
var bbx_edos = [];
var bbx_x = [];
var bbx_y = [];
let tematizing_mugs = [];
let clases_mugs = [];
var export_csv = [];
let tematizing_edo = [];
let clases_edo = [];
var export_csv_edo = [];
var topo_edo;
var topo_mun;
var list_crops = {};
const edos_list = {
  '01':"Aguascalientes",
  '02':"Baja California",
  '03':"Baja California Sur",
  '04':"Campeche",
  '05':"Coahuila de Zaragoza",
  '06':"Colima",
  '07':"Chiapas",
  '08':"Chihuahua",
  '09':"CDMX",
  '10':"Durango",
  '11':"Guanajuato",
  '12':"Guerrero",
  '13':"Hidalgo",
  '14':"Jalisco",
  '15':"México",
  '16':"Michoacán de Ocampo",
  '17':"Morelos",
  '18':"Nayarit",
  '19':"Nuevo León",
  '20':"Oaxaca",
  '21':"Puebla",
  '22':"Querétaro",
  '23':"Quintana Roo",
  '24':"San Luis Potosí",
  '25':"Sinaloa",
  '26':"Sonora",
  '27':"Tabasco",
  '28':'Tamaulipas',
  '29':"Tlaxcala",
  '30':"Veracruz de Ignacio de la Llave",
  '31':"Yucatán",
  '32':"Zacatecas"
};
const TITLES = ['Municipio', 'Cosecha', 'Valor de la producción', 'Estado', 'Rendimiento', 'location_code'];
var edo_selected = ""
setBbxL();
resizeMap()
let coorelation_edo = null;
let coorelation_mun = null;
let acumulate_summary = null;
let $original_year = "2017";
let $crop_selected = "0";
let $cicle = "0"
let location_code = 0;

/**Ready documment**/
$( document ).ready(function() {
  $('#anio_selected').html($original_year)
  //document.getElementById("waitingfor").style.display="none"    

  $( "#mapkeypanel" ).draggable();
  $('#sliderpanel').draggable();

$.Slider = null;
$("#ex13").bootstrapSlider({
  ticks: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
  ticks_labels: ["2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"],
  tooltip_position:'bottom'
});

$('#ex13').slider().on('slideStart', function(ev){
    $original_year = $('#ex13').val();
});

$('#ex13').slider().on('slideStop', function(ev){
    isWait = true;
    var variable = $('#tematizer_mun_var').val()
    var ciclo = $cicle
    var modalidad = $('#modalidad').val()
    var crop = $crop_selected
    var year = $('#ex13').val();
    removeTopo()
    resetStyles()
    if($original_year != year) {
      $original_year = year
      $('#anio_selected').html($original_year)
      if (!filters(crop, ciclo, modalidad)) {
        return
      }
        var query_data = {
           'year': year,
           'crop': crop,
           'edo': edo_selected,
           'variable': variable,
           'ciclo': ciclo,
           'modalidad': modalidad
         }
         $.ajax({
         data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
            csrfmiddlewaretoken: '{{ csrf_token }}'
           },
        url: '{% url "updateYears" %}',
        type: 'POST',
        success : function(data) {
          var jsonObj = data[0]
          export_csv_edo = data[3];
          tematizing_edo = data[1];
          clases_edo = data[2];
          //Data for municipios
          var jsonObj2 = []
          if (data[4]) {
            var jsonObj2 = data[4][0]
          }
          export_csv = data[7];
          tematizing_mugs = data[5];
          clases_mugs = data[6];
          var obj = [];
          obj.push(jsonObj2)
          obj.push(export_csv)
          obj.push(tematizing_mugs)
          obj.push(clases_mugs)


          if (!clases_edo) {
            alert("No hay datos para este año")
            return
          }
          // Tematiza el estado 
          getResultEdo(tematizing_edo)
          // .html(getLeyendMapEdo(999,""+list_crops[crop]+"-superficie "+variable+"-"+year+""));
          if (jsonObj) {
            drawoBoobleCrop(jsonObj, year, list_crops[crop]);
          }

            //Municipal
            if (edo_selected!="") {
              if (clases_mugs) {
                //tematiza el municipio
                getResultsMun(edo_selected, tematizing_mugs)
                //legend
                legend_mun(variable, obj, edo_selected, year, list_crops[crop], true)
              }else {
                alert("No hay datos para este municipio")
                return
              }
              if (jsonObj2) {
                drawoBoobleCropMun(jsonObj2, year, list_crops[crop]);
              }
            }
            //Municipal
            $( "#lbl-legend-risk" ).show()
            $( ".legend-r" ).show()


        },
        error : function(message) {
                console.log(message);
             }
        });
    }
});
    //obtenemos el boundigng box de toda la republica mexicana
    map.fitBounds(bbx_edos["99"])

    removeSelector('#contactChoice4')
    addSelector('#contactChoice4', '0', '--SELECCIONA EL CULTIVO--')
    {% for i in crops %}
        var key = {{i.0|safe}}
        var value = "{{i.1|safe}}"
        list_crops[key] = value
        addSelector('#contactChoice4', key, value)
    {% endfor %}
    removeSelector('#cicles')
    addSelector('#cicles', '0', '--SELECCIONA EL CICLO--')
    {% for cic in ciclos %}
         var value = "{{cic.1|safe}}"
         addSelector('#cicles', value, value)
    {% endfor %}
    removeSelector('#modalidad')
    addSelector('#modalidad', '0', '--SELECCIONA LA MODALIDAD--')
    {% for m in modalidades %}
         var value = "{{m.1|safe}}"
         addSelector('#modalidad', value, value)
    {% endfor %}

    $('.download-data-risk').click(function(){
       var edo = $('#contactChoice5').val();
       var site = $('#download-r').attr('site');
       if (typeof site === 'undefined') {
         return;
       }
       //Export geometrty JSON
       exportJSON(site, edo);
       //Export data CSV
       exportTableToCSVEdo();
     });
     $('.download-data-mun').click(function(){
        var edo = $('#clvedo').text();
        var site = $('#download-mun').attr('site');
        if (typeof edo == 'undefined') {
          return;
        }
        if (typeof site === 'undefined') {
          return;
        }

        //Export geometrty JSON
        exportJSONEdo(site, edo);
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
     $('.min-win-mun').click(function(){
       $( "#mapkeypanel" ).css("height", "58px");
       $('.max-win-mun').show();
       $(this).hide();
     });
     $('.max-win-mun').click(function(){
         $( "#mapkeypanel" ).css("height", "auto");
         $('.min-win-mun').show();
         $(this).hide();
     });

     $('.min-win-year').click(function(){
       $( "#sliderpanel" ).css("height", "180px");
       $( "#sliderpanel" ).css("width", "258px");
       $('.max-win-year').show();
       $(this).hide();
     });
     $('.max-win-year').click(function(){
         $( "#sliderpanel" ).css("height", "auto");
         $( "#sliderpanel" ).css("width", "700px");
         $('.min-win-year').show();
         $(this).hide();
     });
     $('div .arrow-map-down').click(function(){
       $('div .map_black_modal').css("display","block")
       $(this).hide()
       $('div .arrow-map-up').show()
     });
     $('div .arrow-map-up').click(function(){
       $('div .map_black_modal').css("display","none")
       $(this).hide()
       $('div .arrow-map-down').show()
     });

    $('#restart').click(function(){
       window.location.reload();
    });
$('.historic_by_year').click(function(){
  var query_data = {
     'year': $original_year,
     'historic': false
   }
     $.ajax({
     data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
        csrfmiddlewaretoken: '{{ csrf_token }}'
       },
    url: '{% url "getValorNac" %}',
    type: 'POST',
    success : function(data) {
      console.log(data)
     drawHistoric(data, "del año "+$original_year)
       
    },
    error : function(message) {
            console.log(message);
         }
    });
       
    });
$('.historic').click(function(){
  var query_data = {
     'year': $original_year,
     'historic': true
   }
     $.ajax({
     data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
        csrfmiddlewaretoken: '{{ csrf_token }}'
       },
    url: '{% url "getValorNac" %}',
    type: 'POST',
    success : function(data) {
      console.log(data)
     drawHistoric(data, "(Acumulado)")
       
    },
    error : function(message) {
            console.log(message);
         }
    });
       
    });

    $('#tematizer_mun_var').click(function(){
      isWait = true;
      var variable = $('#tematizer_mun_var').val()
      var ciclo = $cicle
      var modalidad = $('#modalidad').val()
      var year = $('#ex13').val();
      var crop = $crop_selected
      removeTopo()
      resetStyles()
      if (!filters(crop, ciclo, modalidad)) {
        return
      }
      var query_data = {
         'year': year,
         'crop': crop,
         'edo': edo_selected,
         'variable': variable,
         'ciclo': ciclo,
         'modalidad': modalidad
       }
       $.ajax({
         data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
            csrfmiddlewaretoken: '{{ csrf_token }}'
           },
          url: '{% url "updateYears" %}',
          type: 'POST',
          success : function(data) {
            var jsonObj = data[0]
            export_csv_edo = data[3];
            tematizing_edo = data[1];
            clases_edo = data[2];
            //Data for municipios
            var jsonObj2 = data[4]
            export_csv = data[7];
            tematizing_mugs = data[5];
            clases_mugs = data[6];
            var obj = [];
            obj.push(jsonObj2)
            obj.push(export_csv)
            obj.push(tematizing_mugs)
            obj.push(clases_mugs)

            if (!clases_edo) {
              alert("No hay datos para este año");
              return
            }
            // Tematiza el estado 
            getResultEdo(tematizing_edo)
              $( "#lbl-legend-risk" ).html(getLeyendMapEdo(999,""+list_crops[crop]+"-superficie "+variable+"-"+year+""))
              //Municipal
              if (edo_selected!="") {
                if (clases_mugs) {
                  getResultsMun(edo_selected, tematizing_mugs)
                  //legend
                  legend_mun(variable, obj, edo_selected, year, list_crops[crop], true)
                }else {
                  alert("No hay datos para este municipio")
                }
              }
              //Municipal

          },
          error : function(message) {
                  console.log(message);
               }
          });
    });
  
 });

/**Ready documment**/
 $(document).ajaxStart(function(){
      if(isWait) {
    setTimeout(function(){
        document.getElementById('waitingfor').classList.add('background-reading-risk')
        document.getElementById('waiting').style.display = "block"
    }, 200);
        } 
  });

  $(document).ajaxComplete(function(){
    isWait = false;
    setTimeout(function(){
      document.getElementById('waitingfor').classList.remove('background-reading-risk') 
      document.getElementById('waiting').style.display = "none"
    }, 5000);
  });
/** Mapa **/
var southWest = L.latLng(10, -100),
      northEast = L.latLng(20, -90),
      bounds = L.latLngBounds(southWest, northEast);

var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> <a href="https://centrogeo.org.mx/">CentroGeo</a>'
  });
var gray = L.esri.basemapLayer("Gray");

var basemap2 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> <a href="https://centrogeo.org.mx/">CentroGeo</a>'
  });
var dark = L.esri.basemapLayer("Streets");

var map = L.map('map_edo', {
    center: [24.26, -101],
    zoom: 5,
    animate: true,
    layers: [basemap, gray],
    //maxBounds: bounds,
    maxZoom: 10
      });

basemap.addTo(map);

map.addLayer(basemap);
basemap.bringToBack();
//metemos el mapa para el municipio en modo hide
document.getElementById('map_edo').style.display = "none"

var map_edo = L.map('map_mun', {
        center: [24.26, -101],
        zoom: 5,
        animate: true,
        layers: [basemap, dark],
        //maxBounds: bounds,
        maxZoom: 5,
        minZoom: 2
      });
basemap2.addTo(map_edo);
map_edo.addLayer(basemap2);
basemap2.bringToBack();
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
    topo_edo.setStyle({weight: 0.5});
}
/*Hover Features*/
function highlightFeatureBusiness(e) {
    var layer = e.target;
    layer.setStyle({weight: 2});
}


function zoomToFeatureBusiness(e) {
  map.fitBounds(e.target.getBounds());
  location_code = e.target.feature.properties.CVE_ENT + e.target.feature.properties.CVE_MUN +"";
}
function zoomToFeatureEdo(e) {
  location_code = e.target.feature.properties.CVE_ENT + e.target.feature.properties.CVE_MUN +"";
  edo_selected = e.target.feature.properties.CVE_ENT
tematizeMapForCrapMun(location_code)
}
//el bueno
function onEachFeatureBusiness(feature, layer) {
  let loca_str = feature.properties.Cve_EntMun+","+utf8Decode2(feature.properties.NOM_MUN);
  layers_mun.push(layer);//onclick="graMun(this.id)"
  layer.bindPopup('<div><strong>Municipio: </strong>'+utf8Decode2(feature.properties.NOM_MUN)+'</div><div><strong>Info: </strong><i class="fa fa-info" style="cursor:pointer;" onclick="drawLineChartMun(this.id)" id="id'+loca_str+'" title="Total de Rendimiento por municipio" aria-hidden="true"></i></div><div></div>');
    layer.on({
        mouseover: highlightFeatureBusiness,
        mouseout: resetHighlightBusiness,
        click: zoomToFeatureBusiness
    });
}
function drawLineChartMun(id){
  let less_id = id.substring(2,id.length-1)
  let datos = less_id.split(",")
  var ciclo = $cicle
  var modalidad = $('#modalidad').val()
  if (!filters($crop_selected, ciclo, modalidad)) {
    return
  }
  var query_data = {
     'year': $original_year,
     'crop': $crop_selected,
     'location_code': location_code,
     'ciclo': ciclo,
     'modalidad': modalidad
   }
     $.ajax({
     data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
        csrfmiddlewaretoken: '{{ csrf_token }}'
       },
    url: '{% url "getSumaryCrop" %}',
    type: 'POST',
    success : function(data) {
       let sumary = data[0]
       $('div .arrow-map-up').show()
       $('.map_black_modal').show()
       document.getElementById('sembrada').innerHTML = sumary[0]
       document.getElementById('cosechada').innerHTML = sumary[1]
       document.getElementById('volumen').innerHTML = sumary[2]
       document.getElementById('valor').innerHTML = sumary[3]
       document.getElementById('rendimiento').innerHTML = sumary[4]
       document.getElementById('siniestrada').innerHTML = sumary[5]
       document.getElementById('precio').innerHTML = "$"+sumary[6]
       document.getElementById('unidad').innerHTML = sumary[7]
       document.getElementById('municipal').innerHTML = datos[1]
    },
    error : function(message) {
            console.log(message);
         }
    });
 
}
function onEachFeatureEdo(feature, layer) {
    layers_mun.push(layer);//onclick="graMun(this.id)"
  // layer.bindPopup('<div><strong>Municipio: </strong>'+utf8Decode2(feature.properties.NOM_MUN)+'</div><div><strong>Historico: </strong><i class="fa fa-area-chart" onclick="drawLineChart(this.id)" id="id'+feature.properties.Cve_EntMun+'" title="Total de robos por municipio" aria-hidden="true"></i></div><div><strong>Reporte: </strong><i class="fa fa-file-pdf-o" onclick="report_view(this.id)" id="id'+feature.properties.Cve_EntMun+'" title="Ver Reporte" aria-hidden="true" style="cursor: pointer;"></i></div>');
    layer.on({
        mouseover: highlightFeatureBusiness,
        mouseout: resetHighlightBusiness,
        click: zoomToFeatureEdo
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
		return values > clases_mugs[3]   ? '#49006a' :
			values > clases_mugs[2]   ? '#f768a1' :
			values > clases_mugs[1]   ? '#fa9fb5' :
			values > clases_mugs[0]   ? '#fcc5c0' :
			values > -1 ? '#fff' :
					 '#fff';
}
function getColorMugs(values) {
    if (values>=clases_mugs[3]) {
       return '#49006a';
    }else if (values>=clases_mugs[2]&&values<clases_mugs[3]) {
      return '#f768a1';
    }else if (values>clases_mugs[1]&&values<clases_mugs[2]) {
      return '#fa9fb5';
    }else if (values<=clases_mugs[1]&&values>0) {
      return '#fcc5c0';
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
function getColorEdo(values) {
    if (values>=clases_edo[3]) {
       return '#e31a1c';
    }else if (values>=clases_edo[2]&&values<clases_edo[3]) {
      return '#fd8d3c';
    }else if (values>clases_edo[1]&&values<clases_edo[2]) {
      return '#fecc5c';
    }else if (values<=clases_edo[1]&&values>0) {
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
function styleEdo(feature) {
  var values = getValuesEdo(feature.properties.CVE_ENT);
  return {
 	        weight: 1,
 	        opacity: 1,
 	        color: '#525252',
 	        fillColor: getColorEdo(values),
 	        fillOpacity: 0.8
 		    };
}
var customLayerEdo = L.geoJson(null, {
    style: styleEdo,
    onEachFeature: onEachFeatureEdo
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
function getValuesEdo(location_code){
    var values = 0;
    for (var clv in tematizing_edo) {
    	if(location_code==tematizing_edo[clv][2]){
			    values = tematizing_edo[clv][1];
		  }
    }
    return values;
}
function onEachFeatureMugs(feature, layer) {
  console.log("");
}
function resetHighlightMugs(e) {
    topo_edo.resetStyle(e.target);
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

function filters(crop,ciclo, modalidad){
  if (crop=='0') {
    alert('selecciona el cultivo')
    return false
  }
  if (ciclo=='0') {
    alert('selecciona el ciclo')
    return false
  }
  if (modalidad=='0') {
    alert('selecciona la modalidad')
    return false
  }
  return true
}
function setDisplayMun(display){
  document.getElementById('map_edo').style.display = display
  document.getElementById('dashboard_mun').style.display = display
  document.getElementById('mapkeypanel').style.display = display
}
/*END tematizing BY MUGS*/
function changeCrops(){
  setDisplayMun("none")
  isWait = true;
  $crop_selected = $('#contactChoice4').val()
  var year = $original_year
  var edo = $('#contactChoice5').val()
  var variable = $('#tematizer_mun_var').val()
  var ciclo = $cicle
  var modalidad = $('#modalidad').val()
  if (!filters($crop_selected, ciclo, modalidad)) {
    return
  }
  var query_data = {
     'year': year,
     'crop': $crop_selected,
     'edo': edo,
     'variable': variable,
     'ciclo': ciclo,
     'modalidad': modalidad
   }
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getCropSiapCharts" %}',
  type: 'POST',
  success : function(data) {
    var jsonObj = data[0]
    export_csv_edo = data[3];
    tematizing_edo = data[1];
    clases_edo = data[2];
    var modal = data[4];
    var cicles = data[5];
    if (!clases_edo) {
      alert("No hay cultivos cosechados para esta selección")
      return
    }
    //Query en retroceso for modal
    removeSelector('#modalidad')
    for (i = 0; i < modal.length; i++) { 
      var mod = modal[i][1];
      if (modalidad==mod) {
        $('#modalidad')
        .append($('<option selected="">', { value: mod })
        .text(mod))
      }else{
        addSelector('#modalidad', mod, mod)
      }
    }
    //Query en retroceso

    //Query en retroceso for cicles
    removeSelector('#cicles')
    for (i = 0; i < cicles.length; i++) { 
      var cic = cicles[i][1];
      if (ciclo==cic) {
        $('#cicles')
        .append($('<option selected="">', { value: cic })
        .text(cic))
      }else{
        addSelector('#cicles', cic, cic)
      }
    }
    //Query en retroceso

    //tematizar la republica de mexico a nivel estatal
    // Tematiza el estado 
    getResultEdo(tematizing_edo)
    //leyenda del mapa nacional con el año seleccionado
    $( "#lbl-legend-risk" ).html(getLeyendMapEdo(999,""+list_crops[$crop_selected]+"-rendimiento-"+year+""));
    if (jsonObj) {
      //haz la gráfica a nivel nacional por estado
      drawoBoobleCrop(jsonObj, year, list_crops[$crop_selected]);
    }
  },
  error : function(message) {
          console.log(message);
       }
  });
}
function setFillColorLblMug(color_select, id){
	var arr_data = tematizing_mugs;
    var values = 0;
    topo_edo.eachLayer(function (layer) {
	for (var clv in arr_data) {
    	if(layer.feature.properties.Cve_EntMun==arr_data[clv][2]){
    		values = arr_data[clv][1];
    		if(id==0){
    			if(values<=clases_mugs[1]&&values>0){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}else if(id==1){

    			if(values>clases_mugs[1]&&values<clases_mugs[2]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}

    		}else if(id==2){
    			if(values>=clases_mugs[2]&&values<clases_mugs[3]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}else if(id==3){
    			if(values>=clases_mugs[3]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}else if(id==4){
    			if(values==0){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}
		}
	}
	});
}
function setFillColorSelected(color_select, location_code){
    topo_mun.eachLayer(function (layer) {
    	if(layer.feature.properties.Cve_EntMun==location_code){
				layer.setStyle({color:color_select,dashArray:null, weight: 5});
		    }
	});
}
function setFillColorLblEdo(color_select, id){
	var arr_data = tematizing_edo;
    var values = 0;
    topo_edo.eachLayer(function (layer) {
	for (var clv in arr_data) {
    	if(layer.feature.properties.Cve_EntMun==arr_data[clv][2]){
    		values = arr_data[clv][1];
    		if(id==0){
    			if(values<=clases_mugs[1]&&values>0){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}else if(id==1){

    			if(values>clases_mugs[1]&&values<clases_mugs[2]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}

    		}else if(id==2){
    			if(values>=clases_mugs[2]&&values<clases_mugs[3]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}else if(id==3){
    			if(values>=clases_mugs[3]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}else if(id==4){
    			if(values==0){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}
		}
	}
	});
}
function clearHighlightBus(id){
	var arr_data = tematizing_mugs;
    var values = 0;
	topo_edo.eachLayer(function (layer) {
	for (var clv in arr_data) {

    	if(layer.feature.properties.Cve_EntMun==arr_data[clv][2]){
    		values = arr_data[clv][1];
    		if(id==0){
    			if(values>1&&values<clases_mugs[1]){
				    layer.setStyle({fillColor:"#ffffb2",dashArray:null});
	    		}
    		}else if(id==1){
    			if(values>clases_mugs[1]&&values<clases_mugs[2]){
				    layer.setStyle({fillColor:"#fecc5c",dashArray:null});
	    		}

    		}else if(id==2){
    			if(values>=clases_mugs[2]&&values<clases_mugs[3]){
				    layer.setStyle({fillColor:"#fd8d3c",dashArray:null});
	    		}
    		}else if(id==3){
    			if(values>=clases_mugs[3]){
				    layer.setStyle({fillColor:"#e31a1c",dashArray:null});
	    		}
    		}else if(id==4){
          if(values==0){
				    layer.setStyle({fillColor:"#fff",dashArray:null});
	    		}
    		}else {
          if(values==null){
				    layer.setStyle({fillColor:"blue",dashArray:null});
	    		}
    		}
		}
	}
	});

}

function highLightMgLbl(id){
	setFillColorLblMug("#F5F507", id);
}
function getLeyendMapEdo(id_lay, title){
  // id_lay, title
	var classe0 = Math.round(clases_edo[0] * 100) / 100;
	var classe1 = Math.round(clases_edo[1] * 100) / 100;
	var classe2 = Math.round(clases_edo[2] * 100) / 100;
	var classe3 = Math.round(clases_edo[3] * 100) / 100;

	var classe00 = classe0+"-"+classe1;
	var classe11 = classe1+"-"+classe2;
	var classe22 = classe2+"-"+classe3;
	var classe33 = classe3+"+";

  $('.legend-r').show();
  $('#window-legend').show();
  $('.min-win-risk').show();
  $('.titles-leg').html(""+title);

  var legend_map = '<table width="100%;" id="legend-colors-mug">\
    <tr>\
    <td class="legend-color-mug legend-color-mug-3" id="3" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);">'+classe33+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug legend-color-mug-2" id="2" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);">'+classe22+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug legend-color-mug-1" id="1" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);">'+classe11+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug legend-color-mug-0" id="0" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);">'+classe00+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug legend-color-mug-4" id="4" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);">No Data</td>\
    </tr></table>';
    return legend_map;
}
//"BOX(-102.874176584546 21.6222664845356,-101.835289447401 22.4595896830525)"
function ChangeCicle() {
  var crop = $crop_selected
  var edo = $('#contactChoice5').val()
  var year = $original_year
  // alert(year)
  $cicle = $('#cicles').val()
  if (!$cicle) {
    alert("Selecciona un ciclo")
    return
  }
  var modal = $('#modalidad').val()
  if (!modal) {
    alert("Selecciona una modalidad")
    return
  }
  if (crop=="0") {
    var query_data = {
      'year': $original_year,
      'edo': edo,
      'cicle': $cicle,
      'modal': modal
    }
     $.ajax({
     data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
        csrfmiddlewaretoken: '{{ csrf_token }}'
       },
    url: '{% url "getCropList" %}',
    type: 'POST',
    success : function(data) {
      removeSelector('#contactChoice4')
      addSelector('#contactChoice4', '0', '--SELECCIONA EL CULTIVO--')
      list_crops = {}
      for (var i = 0; i < data.length; i++) {
        var key = data[i][0]
        var value = data[i][1]
        list_crops[key] = value
        addSelector('#contactChoice4', key, value)
      list_crops = {}
      }


    },
    error : function(message) {
            console.log(message);
         }
    });

 }else{
    $('#contactChoice4').attr('disabled', 'disabled')
    var variable = $('#tematizer_mun_var').val()
    var edo_temp = ""
    if (edo_selected=="") {
      edo_temp = edo
    }
        var query_data = {
           'year': year,
           'crop': crop,
           'edo': edo_temp,
           'variable': variable,
           'ciclo': cicle,
           'modalidad': modal
         }
         console.log(query_data);
         $.ajax({
         data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
            csrfmiddlewaretoken: '{{ csrf_token }}'
           },
        url: '{% url "updateYears" %}',
        type: 'POST',
        success : function(data) {

          var jsonObj = data[0]
          export_csv_edo = data[3];
          tematizing_edo = data[1];
          clases_edo = data[2];
          //Data for municipios
          var jsonObj2 = []
          if (data[4]) {
            var jsonObj2 = data[4][0]
          }
          export_csv = data[7];
          tematizing_mugs = data[5];
          clases_mugs = data[6];
          var obj = [];
          obj.push(jsonObj2)
          obj.push(export_csv)
          obj.push(tematizing_mugs)
          obj.push(clases_mugs)


          if (!clases_edo) {
            alert("No hay datos para este año")
            return
          }
          // Tematiza el estado 
          getResultEdo(tematizing_edo)
          // .html(getLeyendMapEdo(999,""+list_crops[crop]+"-superficie "+variable+"-"+year+""));
          if (jsonObj) {
            drawoBoobleCrop(jsonObj, year, list_crops[crop]);
          }

            //Municipal
            if (edo_selected!="") {
              if (clases_mugs) {
                getResultsMun(edo_selected, tematizing_mugs)
                //legend
                legend_mun(variable, obj, edo_selected, year, list_crops[crop], true)
              }else {
                alert("No hay datos para este municipio")
                return
              }
              if (jsonObj2) {
                drawoBoobleCropMun(jsonObj2, year, list_crops[crop]);
              }
            }
            //Municipal
            $( "#lbl-legend-risk" ).show()
            $( ".legend-r" ).show()


        },
        error : function(message) {
                console.log(message);
             }
        });
 }
}
function ChangeModal() {
  var edo = $('#contactChoice5').val()
  var year = $original_year
  // alert(year)
  var cicle = $cicle
  if (!cicle) {
    alert("Selecciona un ciclo")
    return
  }
  var modal = $('#modalidad').val()
  if (!modal) {
    alert("Selecciona una modalidad")
    return
  }
  var crop = $crop_selected
  if (crop=="0") {
    var query_data = {
    'year': year,
    'edo': edo,
    'cicle': cicle,
    'modal': modal
  }
     $.ajax({
     data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
        csrfmiddlewaretoken: '{{ csrf_token }}'
       },
    url: '{% url "getCropList" %}',
    type: 'POST',
    success : function(data) {
      removeSelector('#contactChoice4')
      addSelector('#contactChoice4', '0', '--SELECCIONA EL CULTIVO--')
      list_crops = {}
      for (var i = 0; i < data.length; i++) {
        var key = data[i][0]
        var value = data[i][1]
        list_crops[key] = value
        addSelector('#contactChoice4', key, value)
      }


    },
    error : function(message) {
            console.log(message);
         }
    });
   }else{
    var edo_temp = ""
    if (edo_selected=="") {
      edo_temp = edo
    }
    var variable = $('#tematizer_mun_var').val()
        var query_data = {
           'year': year,
           'crop': crop,
           'edo': edo_temp,
           'variable': variable,
           'ciclo': cicle,
           'modalidad': modal
         }
         $.ajax({
         data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
            csrfmiddlewaretoken: '{{ csrf_token }}'
           },
        url: '{% url "updateYears" %}',
        type: 'POST',
        success : function(data) {
          var jsonObj = data[0]
          export_csv_edo = data[3];
          tematizing_edo = data[1];
          clases_edo = data[2];
          //Data for municipios
          var jsonObj2 = []
          if (data[4]) {
            var jsonObj2 = data[4][0]
          }
          export_csv = data[7];
          tematizing_mugs = data[5];
          clases_mugs = data[6];
          var obj = [];
          obj.push(jsonObj2)
          obj.push(export_csv)
          obj.push(tematizing_mugs)
          obj.push(clases_mugs)


          if (!clases_edo) {
            alert("No hay datos para este año")
            return
          }
          // Tematiza el estado 
          getResultEdo(tematizing_edo)
          // .html(getLeyendMapEdo(999,""+list_crops[crop]+"-superficie "+variable+"-"+year+""));
          if (jsonObj) {
            drawoBoobleCrop(jsonObj, year, list_crops[crop]);
          }

            //Municipal
            if (edo_selected!="") {
              if (clases_mugs) {
                getResultsMun(edo_selected, tematizing_mugs)
                //legend
                legend_mun(variable, obj, edo_selected, year, list_crops[crop], true)
              }else {
                alert("No hay datos para este municipio")
                return
              }
              if (jsonObj2) {
                drawoBoobleCropMun(jsonObj2, year, list_crops[crop]);
              }
            }
            //Municipal
            $( "#lbl-legend-risk" ).show()
            $( ".legend-r" ).show()


        },
        error : function(message) {
                console.log(message);
             }
        });
   }
}

function removeTopo(){
  if (typeof topo_mun  !== "undefined") {
    $('.legend-r').hide();
    topo_mun.eachLayer(function (layer) {
      layer.remove();
    });
  }
  if (typeof topo_edo  !== "undefined") {
    $('.legend-r').hide();
    topo_edo.eachLayer(function (layer) {
      layer.remove();
    });
  }
}
function resetStyles(){
   tematizing_mugs = [];
   clases_mugs = [];
   export_csv = [];
   tematizing_edo = [];
   clases_edo = [];
   export_csv_edo = [];
}
function drawoBoobleCropMun(jsonObj, year, crop){
   if (coorelation_mun===null) {
      coorelation_mun = setTitles(jsonObj, TITLES);//se guarda el objeto para un posible resize de la pantalla
  }else{
    //Si se va hacer un resize del window, en este caso solo se pasa el obj qu esta guardado en correlation_edo
    if (coorelation_mun.length==jsonObj.length) {
    }else{
      coorelation_mun = setTitles(jsonObj, TITLES);
    }
  }

  google.charts.load('current', {'packages':['corechart', 'controls']});
  google.charts.setOnLoadCallback(drawSeriesChartMun);

function drawSeriesChartMun() {

  var data_mun = google.visualization.arrayToDataTable(coorelation_mun);

  // Create a dashboard.
  var dashboard_mun = new google.visualization.Dashboard(
      document.getElementById('dashboard_mun'));

  // Create a range slider, passing some options
  var donutRangeSlider_mun = new google.visualization.ControlWrapper({
    'controlType': 'NumberRangeFilter',
    'containerId': 'filter_mun',
    'options': {
      'filterColumnLabel': 'Rendimiento',
      'ui': {'labelStacking': 'vertical'}
    }
  });
  // var options = {
  //         title: 'Correlación entre Valor de la producción, Cosechada, Rendimiento ' +
  //                  'municipios ('+year+') de la variable '+crop+' a nivel estatal',
  //         hAxis: {title: 'Cosechada'},
  //         vAxis: {title: 'Valor de la producción'},
  //         width: 'auto',
  //         height: 418,
  //         bubble:
  //           {
  //             textStyle: {
  //               fontSize: 9,
  //               auraColor: 'none',
  //               color: 'none'
  //             }
  //           }
  //       };
  //    var pieChart = new google.visualization.BubbleChart(document.getElementById('chart_mun'));
  //    pieChart.draw(data, options);
  // Create a pie chart, passing some options
  var pieChart_mun = new google.visualization.ChartWrapper({
    'chartType': 'BubbleChart',
    'containerId': 'chart_mun',
    'options': {
      'width': '20%',
      'height': 418,
      'title': 'Correlación entre Valor de la producción, Cosechada, Rendimiento ' +
               'municipios ('+year+') de la variable '+crop+' a nivel estatal',
       'hAxis': {title: 'Cosechada'},
       'vAxis': {title: 'Valor de la producción'},
       'bubble':{
         textStyle: {
           fontSize: 9,
           auraColor: 'none',
           color: 'none'
         }
       },
      'pieSliceText': 'value',
      'legend': 'right'
    }
  });
//event
  function selectHandlerMun() {
    var selectedItem = pieChart_mun.getChart().getSelection()[0];
     if ( selectedItem ) {
         isWait = true;
         location_code = pieChart_mun.getDataTable().getValue(selectedItem.row, 5);
         // edo_selected = location_code.substring(0,2)
         zoomToLocationCode(location_code)
     }
     }

     google.visualization.events.addListener(pieChart_mun, 'select', selectHandlerMun);

     // Establish dependencies, declaring that 'filter' drives 'pieChart',
     // so that the pie chart will only display entries that are let through
     // given the chosen slider range.
     dashboard_mun.bind(donutRangeSlider_mun, pieChart_mun);

     // Draw the dashboard.
     dashboard_mun.draw(data_mun);

    }
}
function zoomToLocationCode(location_code){
  setFillColorSelected("#f6ff00", location_code)

}
function setTitles(jsonObj, tit){
   let ob;
   ob = jsonObj.sort(function(a, b){return a-b})
   ob.unshift(tit)
   return ob
}
function drawoBoobleCrop(jsonObj, year, crop){
  if (coorelation_edo===null) {
      coorelation_edo = setTitles(jsonObj, TITLES);//se guarda el objeto para un posible resize de la pantalla
  }else{
    //Si se va hacer un resize del window, en este caso solo se pasa el obj qu esta guardado en correlation_edo
    if (coorelation_edo.length==jsonObj.length) {
    }else{
      coorelation_edo = setTitles(jsonObj, TITLES);
    }
  }
  google.charts.load('current', {'packages':['corechart', 'controls']});
  google.charts.setOnLoadCallback(drawSeriesChart);

function drawSeriesChart() {

  var data = google.visualization.arrayToDataTable(coorelation_edo);

  // Create a dashboard.
  var dashboard = new google.visualization.Dashboard(
      document.getElementById('dashboard_div'));

  // Create a range slider, passing some options
  var donutRangeSlider = new google.visualization.ControlWrapper({
    'controlType': 'NumberRangeFilter',
    'containerId': 'filter_div',
    'options': {
      'filterColumnLabel': 'Rendimiento',
      'ui': {'labelStacking': 'vertical'}
    }
  });
// auraColor: 'none'
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
      'width': '20%',
      'height': 450,
      'title': 'Correlación entre Valor de la producción, Cosechada, Rendimiento ' +
               'municipios ('+year+') de la variable '+crop+' a nivel nacional',
       'hAxis': {title: 'Cosechada'},
       'vAxis': {title: 'Valor de la producción'},
       'bubble':{
         textStyle: {
           fontSize: 9,
           auraColor: 'none',
           color: 'none'
         }
       },
      'pieSliceText': 'value',
      'legend': 'right'
    }
  });
//event
  function selectHandler() {
    var selectedItem = pieChart.getChart().getSelection()[0];
     if ( selectedItem ) {
         isWait = true;
         setDisplayMun("block")
         location_code = pieChart.getDataTable().getValue(selectedItem.row, 5);
         edo_selected = location_code.substring(0,2)
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
  var file_path = site+'uploaded/apps/republica/republic_mun.json';
  var a = document.createElement('A');
  a.href = file_path;
  a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function exportJSONEdo(site, edo){
  var file_path = site+'uploaded/apps/edos_json/'+edo+'.json';
  var a = document.createElement('A');
  a.href = file_path;
  a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function exportTableToCSV() {
  var crop = list_crops[$crop_selected]
  var csv = 'Producción, Agricola, SIAP, del, '+$original_year+'\
      \nEstado:, '+edos_list[edo_selected]+', por el , cultivo, '+crop+' \n Municipio,Suma del valor de la producción \
    , Estado, Promedio del rendimiento\n';
   export_csv.forEach(function(row) {
           csv += row.join(',');
           csv += "\n";
   });
   downloadCSV(csv, 'produccion_agricola_edo.csv');
}
function exportTableToCSVEdo() {
  var crop = $crop_selected
  var name_edo = $('#contactChoice5').find(":selected").text();

  var csv = 'Producción, Agricola, SIAP, del, '+$original_year+'\
      \nNivel:, Republica Mexicana, por el , cultivo, '+crop+'  \n Municipio,Suma del valor de la producción \
    , Estado, Promedio del rendimiento\n';
   export_csv_edo.forEach(function(row) {
           csv += row.join(',');
           csv += "\n";
   });
   downloadCSV(csv, 'produccion_agricola_rep.csv');
}

function getResultsMun(edo, tematizing_mugs){
  if (tematizing_mugs) {
    for (i = 0; i < tematizing_mugs.length; i++) {
      topo_mun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/'+edo+'.json', null, customLayerMugs).addTo(map);
    }
  }
}
function getResultEdo(tematiz){
  if (tematiz) {
    for (i = 0; i < tematiz.length; i++) {
       topo_edo = omnivore.topojson('{{MEDIA_URL}}gov2030/estados_agenda2030.json', null, customLayerEdo).addTo(map_edo);
    }
  }
}
function tematizeMapForCrapMun(location_code){
  var edo = location_code.substr(0,2)
  var crop = $crop_selected
  var year = $original_year
  var variable_for_mun = $('#tematizer_mun_var').val()
  var ciclo = $cicle
  var modalidad = $('#modalidad').val()
  // var edo = $('#contactChoice5').val()
  if (!filters(crop, ciclo, modalidad)) {
    return
  }
  var query_data = {
     'year': year,
     'crop': crop,
     'clvedo': edo,
     'variable': variable_for_mun,
     'ciclo': ciclo,
     'modalidad': modalidad
   }
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getCropSiapLocationCode" %}',
  type: 'POST',
  success : function(data) {
    setDisplayMun("block")
    map.fitBounds(bbx_edos[edo])
    var jsonObj = data[0]
    export_csv = data[3];
    tematizing_mugs = data[1];
    clases_mugs = data[2];
    if (!clases_mugs) {
      alert("No hay datos para este municipio")
      return
    }
    getResultsMun(edo, tematizing_mugs)
    if (jsonObj) {
      drawoBoobleCropMun(jsonObj, year, list_crops[crop]);
    }
      //legend
    legend_mun(variable_for_mun, data, edo, year, list_crops[crop], false)

  },
  error : function(message) {
          console.log(message);
       }
  });
}
function legend_mun(variable, data, edo, year, crop, is_minimus){
  $('#mapkeypanel').show()
  $('#ui-id-5').html(edos_list[edo])
  $('#clvedo').html(edo)
  $('#lead').html("Superficie "+variable+" de la variable "+crop+" del año "+ year)
  $('#keypanel').html(getLeyendMapMun(999,crop));

}
function getLeyendMapMun(id_lay, title){
	var classe0 = Math.round(clases_mugs[0] * 100) / 100;
	var classe1 = Math.round(clases_mugs[1] * 100) / 100;
	var classe2 = Math.round(clases_mugs[2] * 100) / 100;
	var classe3 = Math.round(clases_mugs[3] * 100) / 100;

	var classe00 = classe0+"-"+classe1;
	var classe11 = classe1+"-"+classe2;
	var classe22 = classe2+"-"+classe3;
	var classe33 = classe3+"+";

  $('.download').html("Descarga los datos a nivel municipal "+title);

  var legend_map = '<table width="100%;" id="legend-colors-mug">\
    <tr>\
    <td class="legend-color-mug alegend-color-mug-3" id="3" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);">'+classe33+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug alegend-color-mug-2" id="2" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);">'+classe22+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug alegend-color-mug-1" id="1" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);">'+classe11+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug alegend-color-mug-0" id="0" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);">'+classe00+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug alegend-color-mug-4" id="4" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);">No Data</td>\
    </tr></table>';
    return legend_map;
}
function drawHistoric(data, title){
  let tit = ['Cultivo', 'Valor de la producción']
  if (acumulate_summary===null) {
      acumulate_summary = setTitles(data, tit);//se guarda el objeto para un posible resize de la pantalla
  }else{
      let cultivo = acumulate_summary[0][0]
      if (cultivo != "Cultivo") {
        acumulate_summary = setTitles(data, tit);
      }
  }
google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {

      var data = google.visualization.arrayToDataTable(acumulate_summary);

      var materialOptions = {
        width: '100%',
        height: 800,
        title: 'Valor de la producción '+title,
        chartArea: {width: '50%'},
        hAxis: {
          title: 'Valor de la producción nivel nacional',
          minValue: 0
        },
        vAxis: {
          title: 'Cultivo'
        }
      };

      var materialChart = new google.visualization.BarChart(document.getElementById('chart_div_historic'));
      materialChart.draw(data, materialOptions);
    }
}
/*Este metodo se ejecuta cada vez que la pantalla cambia de tamaño*/
$(window).resize(function(){
  resizeMap()
  if (typeof $crop_selected !== "undefined") {
    let croped = list_crops[$crop_selected]
    if (coorelation_edo!=null) {
            drawoBoobleCrop(coorelation_edo, $original_year, croped);
    }
    if (coorelation_mun!=null) {
            drawoBoobleCropMun(coorelation_mun, $original_year, croped);
    }
    if (acumulate_summary!=null) {
          drawHistoric(acumulate_summary, "del año "+$original_year)
    }
  }
});
function resizeMap(){
  //Si el tamaño de la pantalla es de mobil vamos hacer que los años y el mapa del estado tomen su tamaño al 100%
  if (screen.width<=979) {
    document.getElementById("map_mun").style.width = "100%";
    document.getElementById("sliderpanel").style.width = "100%";
  }else{  //Si es una pantalla de más de 1000px tomarán los elementos la mita de su tamaño
    document.getElementById("map_mun").style.width = "50%";
    document.getElementById("sliderpanel").style.width = "60%";
  }
}
function removeSelector(id){
  $(id+' option').remove()
}
function addSelector(id, key, val){
    $(id)
        .append($('<option>', { value : key })
        .text(val))
}
