"use strict";
var isWait = false;
let tematizing_mugs = [];
let clases_mugs = [];
var export_csv = [];
let tematizing_edo = [];
let clases_edo = [];
var export_csv_edo = [];
var topo_edo;
var topo_mun;
var list_crops = {};
const TITLES = ['Municipio', 'Cosecha', 'Valor de la producción', 'Estado', 'Rendimiento', 'location_code'];
var edo_selected = ""
let coorelation_edo = null;
let coorelation_mun = null;
let acumulate_summary = null;
let $original_year = "2017";
let $crop_selected = "0";
let $cicle = "0"
let $variable = $('#tematizer_mun_var').val()
let location_code = 0;
let selected_fill_colors = {};
let selected_all_edos = {};

let cons = new Variables();
cons.setBbxL();
resizeMap();

/**Ready documment**/
$( document ).ready(function() {
  $('#anio_selected').html($original_year)
  document.getElementById("modalidad").style.display="none" 
  document.getElementById("contactChoice4").style.display="none"    

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
     updatingYears()
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
       var file_path = site+'uploaded/apps/republica/republic_mun.json';
       cons.exportJSON(file_path);
       //Export data CSV
       cons.exportTableToCSV("Republica Mexicana",list_crops[$crop_selected], export_csv_edo, false,"Produccion_agricola_edo.csv");
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
        var file_path = site+'uploaded/apps/edos_json/'+edo+'.json';
        cons.exportJSON(file_path);
        //Export data CSV
        cons.exportTableToCSV(edo,list_crops[$crop_selected], export_csv, true, "Produccion_agricola_mun.csv");
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

 });
function tematizerClone(){
     $variable = document.getElementById('tematizer_mun_var_clone').value;
     document.getElementById('tematizer_mun_var').selectedIndex = variable_to_thematize[$variable];
     changeVariables()
}
function tematizerVar(){
     $variable = document.getElementById('tematizer_mun_var').value;
     document.getElementById('tematizer_mun_var_clone').selectedIndex = variable_to_thematize[$variable]
     changeVariables()
}

function changeVariables(){
      isWait = true;
      var modalidad = $('#modalidad').val()
      removeTopo()
      resetStyles()
      if (!filters($crop_selected, $cicle, modalidad)) {
        return
      }
      var query_data = {
         'year': $original_year,
         'crop': $crop_selected,
         'edo': edo_selected,
         'variable': $variable,
         'ciclo': $cicle,
         'modalidad': modalidad
       }
      getTematizerEdo(query_data)
      if (edo_selected != "") {
         getTematizMun(query_data)
      }
}
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
  let loca_str = feature.properties.Cve_EntMun+","+cons.utf8Decode(feature.properties.NOM_MUN);
  layers_mun.push(layer);//onclick="graMun(this.id)"
  layer.bindPopup('<div><strong>Municipio: </strong>'+cons.utf8Decode(feature.properties.NOM_MUN)+'</div><div><strong>Info: </strong><i class="fa fa-info" style="cursor:pointer;" onclick="drawLineChartMun(this.id)" id="id'+loca_str+'" title="Total de Rendimiento por municipio" aria-hidden="true"></i></div><div></div>');
    layer.on({
        mouseover: highlightFeatureBusiness,
        mouseout: resetHighlightBusiness,
        click: zoomToFeatureBusiness
    });
}
function drawLineChartMun(id){
  isWait = false;
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
       document.getElementById('municipal').innerHTML = sumary[8]
    },
    error : function(message) {
            console.log(message);
         }
    });
 
}
function onEachFeatureEdo(feature, layer) {
    layers_mun.push(layer);//onclick="graMun(this.id)"
  // layer.bindPopup('<div><strong>Municipio: </strong>'+cons.utf8Decode(feature.properties.NOM_MUN)+'</div><div><strong>Historico: </strong><i class="fa fa-area-chart" onclick="drawLineChart(this.id)" id="id'+feature.properties.Cve_EntMun+'" title="Total de robos por municipio" aria-hidden="true"></i></div><div><strong>Reporte: </strong><i class="fa fa-file-pdf-o" onclick="report_view(this.id)" id="id'+feature.properties.Cve_EntMun+'" title="Ver Reporte" aria-hidden="true" style="cursor: pointer;"></i></div>');
    layer.on({
        mouseover: highlightFeatureBusiness,
        mouseout: resetHighlightBusiness,
        click: zoomToFeatureEdo
    });
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
 
function getChartEdo(query_data){
  query_data.edo = "99";
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getCorrelationChart" %}',
  type: 'POST',
  success : function(data) {
    if (data[0].length>0) {
        var jsonObj = data[0]
        //haz la gráfica a nivel nacional por estado
        drawoBoobleCrop(jsonObj, $original_year, list_crops[$crop_selected]);
        document.getElementById('dashboard_div').style.display = "block" 
      
    }else{
      document.getElementById('dashboard_div').style.display = "none" 
    }
  },
  error : function(message) {
          console.log(message);
       }
  });
}
function getChartMun(query_data){
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getCorrelationChartMun" %}',
  type: 'POST',
  success : function(data) {
    if (data[0].length>0) {
        var jsonObj = data[0]
        //haz la gráfica a nivel nacional por estado
        drawoBoobleCropMun(jsonObj, $original_year, list_crops[$crop_selected]);
        document.getElementById('dashboard_mun').style.display = "block" 
    }else{
      document.getElementById('dashboard_mun').style.display = "none" 
    }
  },
  error : function(message) {
          console.log(message);
       }
  });
}
function queryInReturn(query_data){
 $.ajax({
   data: {'query_data': JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getQueryReturn" %}',
  type: 'POST',
  success : function(data) {
    var modal = data[0];
    var cicles = data[1];
    if (!cicles) {
      alert("No hay ciclos cosechados para esta selección")
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
      if ($cicle==cic) {
        $('#cicles')
        .append($('<option selected="">', { value: cic })
        .text(cic))
      }else{
        addSelector('#cicles', cic, cic)
      }
    }
    //Query en retroceso
  },
  error : function(message) {
          console.log(message);
       }
  });
}
function getTematizerEdo(query_data){
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getCropSiapCharts" %}',
  type: 'POST',
  success : function(data) {
    tematizing_edo = data[0];
    clases_edo = data[1];
    //tematizar la republica de mexico a nivel estatal
    // Tematiza el estado 
    getResultEdo(tematizing_edo)
    //leyenda del mapa nacional con el año seleccionado
    $( "#lbl-legend-risk" ).html(getLeyendMapEdo(999,""+list_crops[$crop_selected]+"-"+$variable+"-"+$original_year+""));
  },
  error : function(message) {
          console.log(message);
       }
  });
} 
function getExportingData(query_data){
  query_data.edo = "99";  
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getDataExport" %}',
  type: 'POST',
  success : function(data) {
    export_csv_edo = data[0];
  },
  error : function(message) {
          console.log(message);
       }
  });
}
function getExportingDataMun(query_data){
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getDataExport" %}',
  type: 'POST',
  success : function(data) {
    export_csv = data[0];
  },
  error : function(message) {
          console.log(message);
       }
  });
}
/*Metodo a ejecutar cuando se seleccionan los años, se hace la consulta de todo con el año correspondiente*/
function updatingYears(){
    isWait = true;
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
	     'year': $original_year,
	     'crop': $crop_selected,
	     'edo': edo_selected,
	     'variable': $variable,
	     'ciclo': $cicle,
	     'modalidad': modalidad
	   }
	 //queryInReturn(query_data)
   getExportingData(query_data)
	 getChartEdo(query_data)
	 getTematizerEdo(query_data)
	 if (edo_selected != "") {
     getExportingDataMun(query_data)
		 getChartMun(query_data) 
		 getTematizMun(query_data)
	 }
  }
}

function getTematizMun(query_data){
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getTematizerMun" %}',
  type: 'POST',
  success : function(data) {
    if (data.length>0) {
      tematizing_mugs = data[0];
      clases_mugs = data[1];
      if (clases_mugs) {
        map.fitBounds(bbx_edos[edo_selected])
        setDisplayMun("block")
        //tematiza el municipio
        getResultsMun(edo_selected, tematizing_mugs)
        //legend
        legend_mun(query_data.variable, null, edo_selected, $original_year, list_crops[$crop_selected], true)
      }else {
        alert("No hay datos para este municipio")
        return
      }
    }else{
      setDisplayMun("none")
      alert("No hay datos para este municipio")
    }
  },
  error : function(message) {
          console.log(message);
       }
  });
}
/*END tematizing BY MUGS*/
function changeCrops(){
  setDisplayMun("none")
  isWait = true;
  $crop_selected = $('#contactChoice4').val()
  var edo = $('#contactChoice5').val()
  var modalidad = $('#modalidad').val()
  if (!filters($crop_selected, $cicle, modalidad)) {
    return
  }
  var query_data = {
     'year': $original_year,
     'crop': $crop_selected,
     'edo': edo,
     'variable': $variable,
     'ciclo': $cicle,
     'modalidad': modalidad
   }
 removeTopoMun()
 getExportingData(query_data)
 queryInReturn(query_data)
 getChartEdo(query_data)
 getTematizerEdo(query_data)
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
        if (selected_fill_colors[location_code]) {
          layer.setStyle({color:color_select,dashArray:null, weight: 5});
        }else{
          layer.setStyle({color:"#525252",dashArray:null, weight: 0.5});
        }
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
  var edo = $('#contactChoice5').val()
  var modal = $('#modalidad').val()
  $cicle = $('#cicles').val()
  if (!$cicle) {
    alert("Selecciona un ciclo")
    return
  }
  if (!modal) {
    alert("Selecciona una modalidad")
    return
  }
  if ($crop_selected=="0") {
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
      document.getElementById("modalidad").style.display="block" 
  
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
    var edo_temp = ""
    if (edo_selected=="") {
      edo_temp = edo
    }
    var query_data = {
       'year': $original_year,
       'crop': $crop_selected,
       'edo': edo_temp,
       'variable': $variable,
       'ciclo': $cicle,
       'modalidad': modal
     }
    getExportingData(query_data)
    getChartEdo(query_data)
    getTematizerEdo(query_data)
    if (edo_selected != "") {
       getExportingDataMun(query_data)
       getChartMun(query_data) 
       getTematizMun(query_data)
    }
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
      document.getElementById("contactChoice4").style.display="block"   
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
    var query_data = {
       'year': $original_year,
       'crop': $crop_selected,
       'edo': edo_temp,
       'variable': $variable,
       'ciclo': $cicle,
       'modalidad': modal
     }
    getExportingData(query_data)
    getChartEdo(query_data)
    getTematizerEdo(query_data)
    if (edo_selected != "") {
       getExportingDataMun(query_data)
       getChartMun(query_data) 
       getTematizMun(query_data)
    }
   }
}

function removeTopo(){
  removeTopoMun()
  removeTopoEdo()
}
function removeTopoMun(){
  if (typeof topo_mun  !== "undefined") {
    $('.legend-r').hide();
    topo_mun.eachLayer(function (layer) {
      layer.remove();
    });
  }
}
function removeTopoEdo(){
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
   selected_fill_colors = {};
   selected_all_edos = {};
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

  //Municipal
$( "#lbl-legend-risk" ).show()
$( ".legend-r" ).show()


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

  // Create a pie chart, passing some options
  var pieChart_mun = new google.visualization.ChartWrapper({
    'chartType': 'BubbleChart',
    'containerId': 'chart_mun',
    'options': {
      'width': '20%',
      'height': 418,
      'title': 'Correlación entre Valor de la producción, Cosechada, Rendimiento ' +
               'municipios ('+year+') de la variable '+crop+' a nivel estatal (El rendimiento es proporcional al tamaño de la circunferencia)',
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
  if (selected_fill_colors.hasOwnProperty(location_code)) {
    if(selected_fill_colors[location_code]){
      selected_fill_colors[location_code] = false;
    }else{
      selected_fill_colors[location_code] = true;
    }
  }else{
       selected_fill_colors[location_code] = true;
  }
  if (selected_fill_colors[location_code]) {
    drawLineChartMun("id"+location_code)
  }
  else{
      $('div .arrow-map-up').hide()
      $('.map_black_modal').hide()
  }
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


  // Create a pie chart, passing some options
  var pieChart = new google.visualization.ChartWrapper({
    'chartType': 'BubbleChart',
    'containerId': 'chart_div',
    'options': {
      'width': '20%',
      'height': 450,
      'title': 'Correlación entre Valor de la producción, Cosechada, Rendimiento ' +
               'municipios ('+year+') de la variable '+crop+' a nivel nacional (El rendimiento es proporcional al tamaño de la circunferencia)',
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

function getResultsMun(edo, tematizing_mugs){
  //primero verificamos si en nuestro objeto existe, si existe le pasamos como parametro un false
   if (selected_all_edos.hasOwnProperty(edo_selected)) {
        if(selected_all_edos[edo_selected]){
          selected_all_edos[edo_selected] = false;
        }else{
          selected_all_edos[edo_selected] = true;
        }
        }else{
          //Si no existe le pasamos true
             selected_all_edos[edo_selected] = true;
        }
        //para que despues podemos validar, si ya lo selecciono que lo tematize
  if (selected_all_edos[edo]) {
      if (tematizing_mugs) {
        for (i = 0; i < tematizing_mugs.length; i++) {
          topo_mun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/'+edo+'.json', null, customLayerMugs).addTo(map);
        }
      }
  }else{
    //Si no lo selecciono que lo elimine
      if (typeof topo_mun  !== "undefined") {
        topo_mun.eachLayer(function (layer) {
          if (edo_selected==layer.feature.properties.CVE_ENT) {
            layer.remove();
          }
        });
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
  var ciclo = $cicle
  var modalidad = $('#modalidad').val()
  // var edo = $('#contactChoice5').val()
  if (!filters(crop, ciclo, modalidad)) {
    return
  }
  var query_data = {
     'year': year,
     'crop': crop,
     'edo': edo,
     'variable': $variable,
     'ciclo': ciclo,
     'modalidad': modalidad
   }
 getExportingDataMun(query_data)
 getChartMun(query_data)
 getTematizMun(query_data)
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
