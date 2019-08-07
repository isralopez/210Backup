<script type="text/javascript">
 var datas;
 var arr_years;
 var masive_index = 0;
 var nivel = "";
 var indicator = "";
 var theming = "";
 var tematic = "";
 var source = "";
 var csv = "";
 var clases;
 var id_route = 0;
 var isDisplayMenu = false;
var agenda = new Array();
var isMap2030 = true;

agenda['1'] = "<li><a class='jso' id='1' href='#'>Proporción de la población con ingresos inferiores a 1.25 dólares diarios</a></li>";
agenda['2'] = "<li><a class='jso' id='2' href='#'>Proporción de la población con acceso a la seguridad social</a></li>";
agenda['3'] = "<li><a class='jso' id='3' href='#'>Proporción de la población con acceso a la seguridad</a></li>";

agenda['10'] = "<li><a class='jso' id='10' href='#'>Proporción de la población con inseguridad alimentaria severa y moderada</a></li>";

agenda['11'] = "<li><a class='jso' id='11' href='#'>Demanda insatisfecha de métodos anticonceptivos modernos (porcentaje)</a></li>";
agenda['12'] = "<li><a class='jso' id='12' href='#'>Prevalencia de uso de métodos anticonceptivos modernos</a></li>";

agenda['13'] = "<li><a class='jso' id='13' href='#'>Proporción de nacimientos asistidos por personal sanitario calificado</a></li>";
agenda['14'] = "<li><a class='jso' id='14' href='#'>Porcentaje de partos por cesárea respecto al total de partos</a></li>";
agenda['15'] = "<li><a class='jso' id='15' href='#'>Tasa de mortalidad en niños menores de 5 años</a></li>";
agenda['16'] = "<li><a class='jso' id='16' href='#'>Tasa de mortalidad neonatal por cada mil nacidos vivos</a></li>";
agenda['17'] = "<li><a class='jso' id='17' href='#'>Porcentaje de cobertura de vacunación con esquema completo al año de edad</a></li>";
agenda['18'] = "<li><a class='jso' id='18' href='#'>Tasa de incidencia asociada a la tuberculosis todas las formas</a></li>";
agenda['19'] = "<li><a class='jso' id='19' href='#'>Tasa de letalidad por dengue hemorrágico</a></li>";
agenda['20'] = "<li><a class='jso' id='20' href='#'>Tasa de mortalidad por enfermedades cardiovasculares</a></li>";
agenda['21'] = "<li><a class='jso' id='21' href='#'>Tasa de mortalidad por cáncer de mama</a></li>";
agenda['22'] = "<li><a class='jso' id='22' href='#'>Tasa de mortalidad por cáncer de próstata</a></li>";
agenda['23'] = "<li><a class='jso' id='23' href='#'>Tasa de mortalidad por diabetes</a></li>";
agenda['24'] = "<li><a class='jso' id='24' href='#'>Tasa de mortalidad por enfermedad pulmonar obstructiva cronica (epoc)</a></li>";
agenda['25'] = "<li><a class='jso' id='25' href='#'>Tasa de suicidio en niños y jóvenes</a></li>";
agenda['26'] = "<li><a class='jso' id='26' href='#'>Tasa de mortalidad por accidentes de tráfico de vehículo de motor (ATVM)</a></li>";
agenda['27'] = "<li><a class='jso' id='27' href='#'>Cobertura estimada de servicios de salud</a></li>";

agenda['30'] = "<li><a class='jso' id='30' href='#'>Razón de paridad educativa</a></li>";

agenda['40'] = "<li><a class='jso' id='40' href='#'>Razón de paridad educativa</a></li>";
agenda['41'] = "<li><a class='jso' id='41' href='#'>Porcentaje de mujeres propietarias de la vivienda que habitan</a></li>";
agenda['42'] = "<li><a class='jso' id='42' href='#'>Población ocupada por quintil de ingresos laborales por sexo</a></li>";
agenda['43'] = "<li><a class='jso' id='43' href='#'>Porcentaje de mujeres sin ingresos propios.</a></li>";
agenda['44'] = "<li><a class='jso' id='44' href='#'>Mujeres que han sufrido violencia por parte de su actual o útima pareja</a></li>";
agenda['45'] = "<li><a class='jso' id='45' href='#'>Mujeres que han sufrido violencia por parte de cualquier agresor distinto a su pareja</a></li>";
agenda['46'] = "<li><a class='jso' id='46' href='#'>Mujeres casadas o viven en pareja</a></li>";
agenda['47'] = "<li><a class='jso' id='47' href='#'>Matrimonios de menores de 12 a 14 años</a></li>";
agenda['48'] = "<li><a class='jso' id='48' href='#'>Matrimonios de menores de 15 a 17 años</a></li>";
agenda['49'] = "<li><a class='jso' id='49' href='#'>Mujeres con algún hijo nacido vivo</a></li>";
agenda['50'] = "<li><a class='jso' id='50' href='#'>Mujeres en las alcaldías</a></li>";
agenda['51'] = "<li><a class='jso' id='51' href='#'>Mujeres que han sufrido violencia por parte de cualquier agresor en los útimos 12 meses.</a></li>";

agenda['60'] = "<li><a class='jso' id='60' href='#'>Porcentaje de aguas residuales tratadas</a></li>";
agenda['61'] = "<li><a class='jso' id='61' href='#'>Abastecimiento de agua</a></li>";
agenda['62'] = "<li><a class='jso' id='62' href='#'>Servicios de saneamiento mejorados</a></li>";

agenda['70'] = "<li><a class='jso' id='70' href='#'>Porcentaje de la población con servicio eléctrico</a></li>";
agenda['71'] = "<li><a class='jso' id='71' href='#'>Viviendas particulares donde se utiliza leña o carbón para cocinar</a></li>";
agenda['72'] = "<li><a class='jso' id='72' href='#'>Viviendas con disponibilidad de focos ahorradores</a></li>";
agenda['73'] = "<li><a class='jso' id='73' href='#'>Viviendas con disponibilidad de focos ahorradores</a></li>";

agenda['80'] = "<li><a class='jso' id='80' href='#'>Indice de puestos de trabajo registrados en el IMSS</a></li>";
agenda['81'] = "<li><a class='jso' id='81' href='#'>Tasa de informalidad laboral</a></li>";
agenda['82'] = "<li><a class='jso' id='82' href='#'>Tasa neta de participación</a></li>";
agenda['83'] = "<li><a class='jso' id='83' href='#'>Tasa de desocupación</a></li>";
agenda['84'] = "<li><a class='jso' id='84' href='#'>Tasa de ocupación infantil</a></li>";
agenda['85'] = "<li><a class='jso' id='85' href='#'>PIB per cápita</a></li>";
agenda['86'] = "<li><a class='jso' id='86' href='#'>Población no económicamente activa que no asiste a la escuela</a></li>";

agenda['90'] = "<li><a class='jso' id='90' href='#'>Usuarios de Internet</a></li>";

agenda['100'] = "<li><a class='jso' id='100' href='#'>Reducción de desigualdadesÍndice de Gini del ingreso (antes y después de transferencias)</a></li>";
agenda['101'] = "<li><a class='jso' id='101' href='#'>Coeficiente de la brecha de la pobreza (intensidad de la pobreza)</a></li>";
agenda['102'] = "<li><a class='jso' id='102' href='#'>Profundidad de la pobreza</a></li>";

agenda['110'] = "<li><a class='jso' id='110' href='#'>Proporción de la población urbana que habita en viviendas precarias</a></li>";
agenda['111'] = "<li><a class='jso' id='111' href='#'>Rezago habitacional por condiciones de espacio, materiales e instalaciones de la vivienda</a></li>";
agenda['112'] = "<li><a class='jso' id='112' href='#'>Densidad de población (bruta)</a></li>";
agenda['113'] = "<li><a class='jso' id='113' href='#'>Densidad de población (bruta)</a></li>";
agenda['114'] = "<li><a class='jso' id='114' href='#'>Accesibilidad al Espacio Público Abierto</a></li>";

function setFillColor(color_select, id){
	var arr_data = datas[masive_index];
    var values = 0;

    topogeojsonmun.eachLayer(function (layer) {  
	for (var clv in arr_data) {
    	if(clv.length==1){
    		var str_clsv = "0"+clv;
    		clv = parseInt(str_clsv);
    	}
    	if(layer.feature.properties.CVE_ENT==clv){
    		values = arr_data[clv];
    		
    		if(id==0){
    			if(values<=clases[1]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}else if(id==1){

    			if(values>clases[1]&&values<clases[2]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}

    		}else if(id==2){
    			if(values>=clases[2]&&values<clases[3]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}else{
    			if(values>=clases[3]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}
		}
	}
	});
}

function highlightFromLegend(id){
	$('.legend-color-'+id).css("background-color","#F5F507");
	setFillColor("#F5F507", id);
}
function clearHighlight(id){
	$('.legend-color-0').css("background-color","#ddfff6");
	$('.legend-color-1').css("background-color","#7fd");
	$('.legend-color-2').css("background-color","#00cc99");
	$('.legend-color-3').css("background-color","#086");
	var arr_data = datas[masive_index];
    var values = 0;
	topogeojsonmun.eachLayer(function (layer) {  
	for (var clv in arr_data) {
    	if(clv.length==1){
    		var str_clsv = "0"+clv;
    		clv = parseInt(str_clsv);
    	}
    	if(layer.feature.properties.CVE_ENT==clv){
    		values = arr_data[clv];
    		
    		if(id==0){
    			if(values<=clases[1]){
				    layer.setStyle({fillColor:"#E4FCF6",dashArray:null});
	    		}
    		}else if(id==1){
    			if(values>clases[1]&&values<clases[2]){
				    layer.setStyle({fillColor:"#9DFCE4",dashArray:null});
	    		}

    		}else if(id==2){
    			if(values>=clases[2]&&values<clases[3]){
				    layer.setStyle({fillColor:"#4AD8B4",dashArray:null});
	    		}
    		}else{
    			if(values>=clases[3]){
				    layer.setStyle({fillColor:"#4aa991",dashArray:null});
	    		}
    		}
		}
	}
	});
}

$(document).ready(function(){

$("#chart-container").draggable();

function wait(){
	$("#wait").css("display", "block");
}
function goDisplay(){
	$("#wait").css("display", "none");
}
 
function pushRadios(arr_years){
	for (i = 0; i < arr_years.length; i++) {
        if(i==0){
			$(".radio-years").append("<input class='radio-button' type='radio' id='radio"+i+"' name='radios' checked> <label for='radio"+i+"'>"+arr_years[i]+"</label> ");
        }else{
        	$(".radio-years").append("<input class='radio-button' type='radio' id='radio"+i+"' name='radios'> <label for='radio"+i+"'>"+arr_years[i]+"</label> ");
        }
	}
}
function getMun(e) {
	if (typeof entMun != "undefined") { map.removeLayer(entMun) };
	$.getJSON( "data/"+e.target.feature.properties.CLV_EDO+'.json', function( data ) {
		entMun = L.geoJson(data, {style: styleMun, onEachFeature: onEachFeatureMun}).addTo(map);
	});
}
function resetHighlight(e) {
    topogeojsonmun.resetStyle(e.target);

}
function getSubtema(){
  var subtemas = "<div class='btn-group'><a class='btn btn-primary' style='background: #0787B0; border-color: #0787B0; border-radius: 0;'' href='#''>";
  subtemas += "<i class='fa fa-globe' aria-hidden='true'></i>Indicadores</a><a class='btn btn-primary dropdown-toggle' style='background: #0787B0; border-color: #0787B0; border-radius: 0;' data-toggle='dropdown' href='#'><span class='fa fa-caret-down' title='Toggle dropdown menu'></span></a>";
  subtemas += "<ul class='dropdown-menu'><li>";
    for (var clv in agenda) {
      if(tematic == "Fin de la pobreza"){
        if(clv<10){
          subtemas += "<li><a href='#'>"+agenda[clv]+"</a></li>";
        }
      }else if(tematic == "Hambre Cero"){
        if(clv==10){
          subtemas += "<li><a href='#'>"+agenda[clv]+"</a></li>";
        }
      }else if(tematic == "Salud y Bienestar"){
        if(clv>=11&&clv<=29){
          subtemas += "<li><a href='#'>"+agenda[clv]+"</a></li>";
        }
      }else if(tematic == "Educación de Calidad"){
        if(clv==30){
          subtemas += "<li><a href='#'>"+agenda[clv]+"</a></li>";
        }
      }else if(tematic == "Igualdad de Genero"){
        if(clv>=40&&clv<60){
          subtemas += "<li><a href='#'>"+agenda[clv]+"</a></li>";
        }
      }else if(tematic == "Agua limpia y saneamiento"){
        if(clv>=60&&clv<70){
          subtemas += "<li><a href='#'>"+agenda[clv]+"</a></li>";
        }
      }else if(tematic == "Energía asequible y no contaminante"){
        if(clv>=70&&clv<80){
          subtemas += "<li><a href='#'>"+agenda[clv]+"</a></li>";
        }
      }else if(tematic == "Trabajo decente y crecimiento económico"){
        if(clv<90&&clv>80){
          subtemas += "<li><a href='#'>"+agenda[clv]+"</a></li>";
        }
      }else if(tematic == "Energía asequible y no contaminante"){
        if(clv==90){
          subtemas += "<li><a href='#'>"+agenda[clv]+"</a></li>";
        }
      }else if(tematic == "Reducción de las desigualdades"){
        if(clv>=100&&clv<110){
          subtemas += "<li><a href='#'>"+agenda[clv]+"</a></li>";
        }
      }else{
        if(clv>=110){
          subtemas += "<li><a href='#'>"+agenda[clv]+"</a></li>";
        }
      }
    	
    }
	subtemas += "</li></ul></div>";
	return subtemas;
}
function getLeyendMap(){
	var classe0 = Math.round(clases[0] * 100) / 100; 
	var classe1 = Math.round(clases[1] * 100) / 100; 
	var classe2 = Math.round(clases[2] * 100) / 100; 
	var classe3 = Math.round(clases[3] * 100) / 100; 

	var classe00 = classe0+"-"+classe1; 
	var classe11 = classe1+"-"+classe2;
	var classe22 = classe2+"-"+classe3;
	var classe33 = classe3+"+";

    var legend_map = '<table id="legend-colors">';
    legend_map += '<tbody>';
    legend_map += '<tr>';
    legend_map += '<td class="legend-color legend-color-0" onmouseover="highlightFromLegend(0)" onmouseout="clearHighlight(0);"></td>';
    legend_map += '<td class="legend-color legend-color-1" onmouseover="highlightFromLegend(1)" onmouseout="clearHighlight(1);"></td>';
    legend_map += '<td class="legend-color legend-color-2" onmouseover="highlightFromLegend(2)" onmouseout="clearHighlight(2);"></td>';
    legend_map += '<td class="legend-color legend-color-3" onmouseover="highlightFromLegend(3)" onmouseout="clearHighlight(3);"></td>';
    legend_map += '</tr>';
    legend_map += '<tr>';
    legend_map += '<td class="legend-breaks legend-breaks-0">'+classe00+'</td>';
    legend_map += '<td class="legend-breaks legend-breaks-1">'+classe11+'</td>';
    legend_map += '<td class="legend-breaks legend-breaks-2">'+classe22+'</td>';
    legend_map += '<td class="legend-breaks legend-breaks-3">'+classe33+'</td>';
    legend_map += '</tr>';
    legend_map += '</tbody>';
    legend_map += '</table>';
    return legend_map;
}
/*Hover Features*/
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        //color: 'white',
        dashArray: '',
        fillOpacity: 0.9
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    //$("#nameEdoMun").html(layer.feature.properties.NOM_EDO);
    //var edo = [layer.feature.properties];
    //graficaPie(edo);
}
function updateTwoChart(properties){
   $('#chart-container').css("height","440px");
    jsonObj = [];

  for (i = 0; i < arr_years.length; i++) {
      var arr_data = datas[i];
      for (var clv in arr_data) {
          if(clv.length==1){
            var str_clsv = "0"+clv;
            clv = parseInt(str_clsv);
          }
          if(properties.CVE_ENT==clv){
          values = arr_data[clv];
          item = {};
              item["c"] = [{v: arr_years[i]}, {v: values}];
              jsonObj.push(item);
        } 
        }
    }

    var data_col = [{id: 'task', label: 'Anio', type: 'string'},
                 {id: 'hours', label: indicator, type: 'number'}];

   google.charts.load('current', {'packages':['corechart']});
     google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = new google.visualization.DataTable({
          cols: data_col,
          rows: jsonObj
            });

    var options = {
      title: properties.NOM_EDO,
      titleTextStyle: {
          color: '#b9babf',
          fontName: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          fontSize: 14},
      isStacked: true,
      height: 310,
      width: 450,
      legend: {title: '74440',position: 'top', maxLines: 1},
      hAxis: {title: 'Año',  titleTextStyle: {
          color: '#b9babf',
          fontName: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          fontSize: 14
        },
        direction: -1, 
        slantedText: true, 
        slantedTextAngle: 90 // here you can even use 180 
      },
      vAxis: {minValue: 0},//, title: 'okok', titleTextStyle: {color: '#FF0000'}
      colors: ['#990099', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
     
      scales: {
        xAxes: [{
            type: 'linear',
            position: 'top',
        }]
    }
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    $('#chart_div').css("display","block");
    chart.draw(data, options);

    $('.map-legend').html(getLeyendMap());


  }
} 
function updateChart(properties){
  $('#chart-container').css("height","400px");
    jsonObj = [];

 	for (i = 0; i < arr_years.length; i++) {
		 	var arr_data = datas[i];
		 	for (var clv in arr_data) {
		    	if(clv.length==1){
		    		var str_clsv = "0"+clv;
		    		clv = parseInt(str_clsv);
		    	}
		    	if(properties.CVE_ENT==clv){
					values = arr_data[clv];
					item = {};
        	 		item["c"] = [{v: arr_years[i]}, {v: values}];
        	 		jsonObj.push(item);
				} 
		    }
		}

    var data_col = [{id: 'task', label: 'Anio', type: 'string'},
                 {id: 'hours', label: indicator, type: 'number'}];

	 google.charts.load('current', {'packages':['corechart']});
     google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	var data = new google.visualization.DataTable({
          cols: data_col,
          rows: jsonObj
            });

    var options = {
      title: properties.NOM_EDO,
      titleTextStyle: {
          color: '#b9babf',
          fontName: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          fontSize: 14},
      isStacked: true,
      height: 310,
      width: 450,
      legend: {title: '74440',position: 'top', maxLines: 1},
      hAxis: {title: 'Año',  titleTextStyle: {
          color: '#b9babf',
          fontName: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          fontSize: 11
        },
        direction: -1, 
        slantedText: true, 
        slantedTextAngle: 90 // here you can even use 180 
      },
      vAxis: {minValue: 0},//, title: 'okok', titleTextStyle: {color: '#FF0000'}
      colors: ['#990099', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
     //is3D: true,
     
      scales: {
        xAxes: [{
            type: 'linear',
            position: 'top'
        }]
    }
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    $('#chart_div').css("display","block");
    chart.draw(data, options);



  }
} 
 
function zoomToFeature(e) {
    //map.fitBounds(e.target.getBounds());
    //console.log(e.target.feature.properties);
    updateChart(e.target.feature.properties);
   if(id_route==83){
      updateTwoChart(e.target.feature.properties);
    }else{
      updateChart(e.target.feature.properties);
    }
}
function getColor(values) {
		return values > clases[3]   ? '#4aa991' :
			values > clases[2]   ? '#4AD8B4' :
			values > clases[1]   ? '#9DFCE4' :
			values > clases[0]   ? '#E4FCF6' :
			values > -1 ? '#fff' :
					 '#fff';
}
function onEachFeature(feature, layer) {
  var arr_data = datas[masive_index];
  var values = 0;
  for (var clv in arr_data) {
      if(clv.length==1){
        var str_clsv = "0"+clv;
        clv = parseInt(str_clsv);
      }
      if(feature.properties.CVE_ENT==clv){
      values = arr_data[clv];
    } 
    }
  layer.bindPopup("<div><strong>Estado:</strong> "+feature.properties.NOM_EDO+"</div>"+"<div><strong>Año:</strong> "+arr_years[masive_index]+"</div>"+"<div><strong>Valor:</strong> "+values+"</div>");
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
function getValues(clv_ent){
    var arr_data = datas[masive_index];
    var values = 0;
    for (var clv in arr_data) {
    	if(clv.length==1){
    		var str_clsv = "0"+clv;
    		clv = parseInt(str_clsv);
    	}
    	if(clv_ent==clv){
			values = arr_data[clv];
		} 
    }
    return values;
}
function style(feature, layer) {
	values = getValues(feature.properties.CVE_ENT);
     return {
	        weight: 1,
	        opacity: 1,
	        color: '#C4E3B6',
	        fillColor: getColor(values),
	        fillOpacity: 0.5
		    };
}
var customLayer = L.geoJson(null, {
    style: style, 
    onEachFeature: onEachFeature
});
function cleanChart(){
  $('.map-legend').html("");
  $('.chart_trimestre').html("");
  $('#chart_div').html("");
  $('#chart_div').css("display","none");
  $('#chart-container').css("height","85px");
  $(".radio-years").css("display","block");
  $('.radio-trimestre').html("");
}
function hazAjaxTrimestral(id_route) {

  $('#chart_div').css("display","none");
  $('#chart-container').css("height","125px");
	$.ajax({
	        data: {'id_route': id_route,//JSON.stringify(route),
	             csrfmiddlewaretoken: '{{ csrf_token }}'
	            },
	        url: '/interactive/maps/get_csv_trimestral/',
	        type: 'POST',
	        success : function(data) {
	        	datas= data[0];
	        	arr_years = data[1];
	        	if(typeof arr_years == "undefined"){
	        		alert("No hay datos para esta categoria");
	        	   return false;
	        	}
	        	nivel = data[2];
	        	clases = data[3];
	        	indicator = data[4];
	        	theming = data[5];
            tematic = data[6];

            source = "STPS";
	        	nivel=="estatal" ? nivel = "estados_agenda2030.json": nivel = "mun_agenda2030.json";
	        	$(".radio-years").html("");
             $("#remoteServices_subtema").css("display","block");
	        	for (i = 0; i < arr_years.length; i++) {
                  if(i==masive_index){
                    $(".radio-years").append("<input class='radio-button' type='radio' id='radio"+i+"' name='radios' checked> <label for='radio"+i+"'>"+arr_years[i]+"</label> ");
                  }else{
                    $(".radio-years").append("<input class='radio-button' type='radio' id='radio"+i+"' name='radios'> <label for='radio"+i+"'>"+arr_years[i]+"</label> ");
                  }
            }
            map.removeLayer(topogeojsonmun);
            topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}gov2030/'+nivel+'', null, customLayer).addTo(map);
            $(".container_chart").css("display","block");
	        },
	        error : function(message) {
	                console.log(message);
	             }
	        });
}
function hazAjax(id_route) {
  cleanChart();
  $.ajax({
          data: {'id_route': id_route,//JSON.stringify(route),
               csrfmiddlewaretoken: '{{ csrf_token }}'
              },
          url: '/interactive/maps/get_csv/',
          type: 'POST',
          success : function(data) {
            datas= data[0];
            arr_years = data[1];
            if(typeof arr_years == "undefined"){
              alert("No hay datos para esta categoria");
               return false;
            }
            nivel = data[2];
            clases = data[3];
            indicator = data[4];
            theming = data[5];
            tematic = data[6];
            source = data[7];
            csv = data[8];
            nivel=="estatal" ? nivel = "estados_agenda2030.json": nivel = "mun_agenda2030.json";
            $(".radio-years").html("");
             $("#remoteServices_subtema").css("display","block");
            $("#remoteServices_subtema").html(getSubtema());
            pushRadios(arr_years);
            topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}gov2030/'+nivel+'', null, customLayer).addTo(map);
            $('.map-legend-up').html("<span class='title_2030' title='Da clicka un estado para graficar'><span class='dowload_csv'><a href='"+csv+"' title='Descargar: "+tematic+" de: "+source+"'><i class='fa fa-download' aria-hidden='true'></i></a></span><strong> Fuente:: </strong> "+source+" <strong> :: </strong> "+tematic+"</span> <span class='icons_2030'><i id='hide_map2030' class='fa fa-eye-slash' aria-hidden='true' title='Ocultar Mapa'></i><i id='quit_map2030' title='Cerrar Agenda 2030' class='fa fa-times' aria-hidden='true'></i></span>");
            $(".container_chart").css("display","block");
            $('.map-legend').html(getLeyendMap());
            if(id_route==83){
              $('#chart-container').css("height","125px");
            $('.radio-trimestre').html("<span class='radio-tri'><strong>Trimestres:</strong> </span><label class='radio-tri'><input type='radio' name='radgroup' value='1' id='r1' checked>1er</label><label class='radio-tri'><input type='radio' name='radgroup' value='2' id='r2'>2do</label><label class='radio-tri'><input type='radio' name='radgroup'  id='r3' value='3'>3er</label><label class='radio-tri'><input type='radio' name='radgroup' value='4' id='r4'>4to</label>");
            }
          },
          error : function(message) {
                  console.log(message);
               }
          });
}
$('.jso').click(function(e){
	id_route = $(this).attr('id');
  $('#development').modal('toggle');
	hazAjax(id_route);
});
$('div.container_chart').on("click", "#hide_map2030", function(e){
  if (isMap2030){
      map.removeLayer(topogeojsonmun);
      isMap2030 = false;
  }else{
    topogeojsonmun.setStyle({color:"#ddfff6",dashArray:null});
    topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}gov2030/'+nivel+'', null, customLayer).addTo(map);
    isMap2030 = true;
  }
});
$('div.container_chart').on("click", "#quit_map2030", function(e){
    deleteAgenda2030();
});
function deleteAgenda2030(){
   map.removeLayer(topogeojsonmun);
   $(".radio-years").css("display","none");
   $(".container_chart").css("display","none");
   $("#remoteServices_subtema").css("display","none");
}

	var myJsonString = [];
	$('#remoteServices_subtema').on("click", "ul.dropdown-menu li a.jso", function(e){
  		id_route = $(this).attr('id');
  		hazAjax(id_route);
   });
    $(".radio-trimestre").on("click","input:radio[name=radgroup]:checked",function () {
        if ($("input[name='radgroup']:checked").val() == '1') {
            hazAjaxTrimestral(1);
        }else if ($("input[name='radgroup']:checked").val() == '2') {
            hazAjaxTrimestral(2);
        }else if ($("input[name='radgroup']:checked").val() == '3') {
            hazAjaxTrimestral(3);
        }else{
            hazAjaxTrimestral(4);
        }
    });
    $('.agenda2030').on("click", function(e){
      var id_poor = $(this).attr('id');
      if($("#"+id_poor+" .dropdown-menu").is(":visible")){
          $("#"+id_poor+" .dropdown-menu").hide();  
      }else{
        $("#"+id_poor+" .dropdown-menu").show();
      }

    });

    $('.radio-years').on("click", "input[type=radio].radio-button", function(e){
       var id_year = $(this).attr("id");
       var x = id_year.substring(5, 6);//5,7 more of two numbers
       for (i = 0; i < arr_years.length; i++) {
			if(x==i){
       			masive_index = x;
       			topogeojsonmun.setStyle({color:"#ddfff6",dashArray:null});
       			topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}gov2030/'+nivel+'', null, customLayer).addTo(map);
       		}
		}
         
    });
  });
</script>