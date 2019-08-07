<script type="text/javascript">

var schemeNames = {sequential: ["BuGn","BuPu","GnBu","OrRd","PuBu","PuBuGn","PuRd","RdPu","YlGn","YlGnBu","YlOrBr","YlOrRd"],
					singlehue:["Blues","Greens","Greys","Oranges","Purples","Reds"],
					diverging: ["BrBG","PiYG","PRGn","PuOr","RdBu","RdGy","RdYlBu","RdYlGn","Spectral"],
					qualitative: ["Set1"] };
var selectedScheme = "BuGn",
	numClasses = 3;

$( "#clasify" ).draggable({ helper: "original" });
$( "#edit-symbol" ).draggable({ helper: "original" });

/* Constructores de los botones de seleccion de color */
$("#fill-color").spectrum({
	color: "#fff",
	showInput:true,
	showInitial: true,
	showButtons: true,
	showAlpha: true,
	containerClassName: 'r-color',
	replacerClassName: 'r-color',
	preferredFormat: "hex",
	cancelText: 'Cancelar',
    chooseText: 'Elegir',
    change: function(color) {
      $("#styleSave").show();
    }
});

$("#symbol-fill").spectrum({
	color: "#fff",
	showInput:true,
	showInitial: true,
	showButtons: true,
	showAlpha: true,
	containerClassName: 'r-color',
	replacerClassName: 'r-color',
	preferredFormat: "hex",
	cancelText: 'Cancelar',
    chooseText: 'Elegir'
});

$("#stroke-color").spectrum({
	color: "#fff",
	allowEmpty:true,
	showInput:true,
	showInitial: true,
	showButtons: true,
	showAlpha: true,
	containerClassName: 'r-color',
	replacerClassName: 'r-color',
	preferredFormat: "hex",
	cancelText: 'Cancelar',
    chooseText: 'Elegir',
    change: function(color) {
      if ( $("#style-type").val() == 'symbol') {
        $("#styleSave").show();
      }
    }
});

$("#symbol-stroke").spectrum({
	color: "#fff",
	allowEmpty:true,
	showInput:true,
	showInitial: true,
	showButtons: true,
	showAlpha: true,
	containerClassName: 'r-color',
	replacerClassName: 'r-color',
	preferredFormat: "hex",
	cancelText: 'Cancelar',
    chooseText: 'Elegir',
});

/* Colores iniciales para relleno y borde general */
$("#fill-color").spectrum("set", "#fff");
$("#stroke-color").spectrum("set", "#d0cfd4");

/*Slider fill opacity*/
$("#transparency-slider-b").mousedown(function(){
	var max = $("#transparency-track-b").width();
	var handle = $(this);
	function handleMove(e){
		var l = Math.max(3,3+Math.min(e.pageX - $("#transparency-track-b").offset().left,max));
		handle.css("left",l);
		$("#transparency-slider-b").attr('data-value',l/100);
		$("#fill-opacity").text(l+'%');
	};
	function handleUp(){
		$(document).off( "mousemove",handleMove );
		$(document).off( "mouseup",handleUp );
	};
	$(document).on( "mousemove",handleMove );
	$(document).on( "mouseup",handleUp );
});

/* Evento del selector de Tipo de Estilo */
$("#style-type").change(function(){
    $('#clasify').hide();
    $("#styleClasify").hide();
    $("#applyStrokeBtn").hide();
	setDataType($('option:selected', this).attr('name'));
});

$(".scheme-type").change(function(){
	setSchemeType($(this).attr("id"));
});

$("#num-classes").change(function(){
	setNumClasses($(this).val());
});

/* Eventos para mostrar/ocultar menu opacidad */
$("#opacity-enabled").change(function() {
  if($(this).is(":checked")) {
    var p_slider = $("#transparency-slider-b");
    p_slider.css("left",100);
    p_slider.attr('data-value', 100);
	$("#fill-opacity").text(100+'%');
    $("#opacityCtrl").show( "slow" );
  } else {
    $("#opacityCtrl").slideUp();
  }
});

/* Eventos para mostrar/ocultar menus de bordes */
$("#stroke-enabled").change(function() {
  if($(this).is(":checked")) {
    $( ".div-borde" ).show( "slow" );
    if ( $("#style-type").val() != 'symbol') {
        $("#applyStrokeBtn").show();
    }
  } else {
    $( ".div-borde" ).slideUp();
    if ( $("#style-type").val() != 'symbol') {
        $("#applyStrokeBtn").hide();
    }
  }
});

$("#symbol-stroke-enabled").change(function() {
  if ( $( ".div-stroke" ).is( ":hidden" ) ) {
    $( ".div-stroke" ).show( "slow" );
  } else {
    $( ".div-stroke" ).slideUp();
  }
});

/*Activar app*/
$('#styleCreate').click(function(event) {
    typename = $(".layer_select").attr('typename'); //Setea variable global

    $("#style-title").html($(".layer_select").attr('data-title'));
    $("#mapLayerListHandle").hide('fast');
    $("#addlegend").hide('fast');
    $("#addstyle").show('slow');
    if($( ".layerMenu" ).hasClass( "translateLayerListRight" )){
      $(".layerMenu").removeClass( "translateLayerListRight" ).addClass( "translateLayerListLeft" );
      $(".layerMenuNubOpen").removeClass( "layerMenuNubOpen" ).addClass( "layerMenuNubClosed" );
      $(".leaflet-left").removeClass( "leaflet-control-openmenu" );
    }
    /* Ocultando elementos no necesarios para edicion de estilos */
    $("#leftMenuActivationTab").hide();
    $(".leaflet-control-easyPrint").hide();
    $(".leaflet-draw").hide();
    $(".headerButtons").hide();
    $(".headerButtons").hide();
    $("#remoteServices").hide();
    $("#selectedRegionDropDownContainer").hide();

    unload = true;

    $.ajax({
      url: '{% url "getGeomType" %}',
      type: 'POST',
      data: {
          'typename': typename,
          csrfmiddlewaretoken: '{{ csrf_token }}'
      },
      dataType: 'json',
      success: function(result) {
          geom_type = result.geom_type; //Setea variable global, no modificar
          var styles = result.layer_styles;
          var default_style = result.default_style;
          /* Ajusta estilo de inicio */
          $("#style").empty().append('<option value="newStyle">Nuevo...</option>');
          var def_styleOpt = '<option value="'+ default_style +'" name="default_style">'+ default_style +'</option>';
          $("#style").append(def_styleOpt);
          $.each(styles, function(i, val) {
            if(val != default_style ) {
                var styleOpt = '<option value="'+ val +'">'+ val +'</option>';
                $("#style").append(styleOpt);
            }
          });
          var legend_id = $(".layer_select").attr('id')
          var style_name = $('#'+legend_id).attr('data-title');

          if ( styles.indexOf(style_name) > -1 ) {
            $("#style").val(style_name);
            getSLD_data(geom_type, style_name);
          } else {
            $("#style").val(default_style);
            getSLD_data(geom_type, default_style);
          }
      },
      error : function(xhr,errmsg,err) {
          console.log('Error en el servidor')
          console.log(xhr.status + ": " + xhr.responseText);
      }
    });
});

/*Cancelar*/
$('#styleCancel').click(function() {
    if( window.location.href.indexOf('?layer=') != -1 ) {
        window.location.replace('/layers/'+typename);
    } else {
        unload = false;
        newStyle = false;
        if ($(".div-borde").is( ":visible" )) {
            $(".chevron").trigger('click');
        }
        $("#addstyle").hide('fast');
        $("#mapLayerListHandle").show('slow');
        $("#addlegend").show('slow');
        $('#clasify').hide();
        $('#edit-symbol').hide();
        $("#newStyleWindow").hide();

        if($( ".layerMenu" ).hasClass( "translateLayerListLeft" )){
          $(".layerMenu").removeClass( "translateLayerListLeft" ).addClass( "translateLayerListRight" );
          $(".layerMenuNubOpen").removeClass( "layerMenuNubClosed" ).addClass( "layerMenuNubOpen" );
          $(".leaflet-left").addClass( "leaflet-control-openmenu" );
        }

        /* Reactivando elementos de interfaz */
        $("#leftMenuActivationTab").show();
        $(".leaflet-control-easyPrint").show();
        $(".leaflet-draw").show();
        $(".headerButtons").show();
        $(".headerButtons").show();
        $("#remoteServices").show();
        $("#selectedRegionDropDownContainer").show();
    }
});

function setNumClasses(n)
{
	numClasses = n;
	showSchemes();
}

var selectedDataType;

/* Funcion que selecciona tipo de estilo */
function setDataType(type) {
	selectedDataType = type;
	var idLayer = $('#result_text :input[value="'+ typename +'"]').attr('data-layerid');
	var typeVal = $("#style-type").val();

    if (geometry_type=='ST_Point' || geom_type=='ST_MultiPoint') {
        $("#symbol-type").show();
    } else {
        $("#symbol-type").hide();
    }

	switch(selectedDataType) {
		case "unico":
			$("#scheme").hide('fast');
			$("#cat-scheme").hide('fast');
			$("#div-tiporampa").hide('fast');
			$('#style-attr').hide('fast');
			$(".div-modo").hide('fast');
			$(".div-clases").hide('fast');
			$("#unique-symbol").show('slow');
			$("#opacity").hide();
			if (geometry_type=='ST_MultiLineString') {
		        $("#unique-symbol").hide();
		        $("#stroke-color-td").show();
		    }
			$("#styleSave").show();
			$("#edit-stroke").show('slow');
			showSchemes();
			break;
		case "categorizado":
			$("#div-tiporampa").hide('fast');
			$(".div-modo").hide('fast');
			$(".div-clases").hide('fast');
			$("#unique-symbol").hide('fast');
			$("#styleSave").hide();
			$("#scheme").hide();
			if (geometry_type=='ST_MultiLineString') {
		        $("#stroke-color-td").hide();
		        if ( $( ".div-stroke" ).is( ":hidden" ) ) {
                   $( ".div-stroke" ).show( "slow" );
                   $(".chevronB").addClass('fa-chevron-down');
                   $(".chevronB").removeClass('fa-chevron-up');
                }
		    }
		    $("#opacity").show();
			getAttr(idLayer, typeVal);
			break;
		case "graduado":
		    $("#unique-symbol").hide('fast');
		    $("#cat-scheme").hide('fast');
		    $("#styleSave").hide();
		    if (geometry_type=='ST_MultiLineString') {
		        $("#stroke-color-td").hide();
		        if ( $( ".div-stroke" ).is( ":hidden" ) ) {
                   $( ".div-stroke" ).show( "slow" );
                   $(".chevronB").addClass('fa-chevron-down');
                   $(".chevronB").removeClass('fa-chevron-up');
                }
		    }
		    $("#opacity").show();
            getAttr(idLayer, typeVal);
			break
	}
}

var selectedSchemeType;
function setSchemeType(type) {
	selectedSchemeType = type;

	$("#num-classes option").removeAttr( "disabled" );
	switch(selectedSchemeType)
	{
		case "sequential":
			if( $( "#num-classes" ).val() >= 10 )
			{
				$( "#num-classes" ).val( 9 );
				numClasses = 9;
			}
			$( "#num-classes option[name=10], #num-classes option[name=11], #num-classes option[name=12]" ).attr( "disabled", "disabled" );
			break;
		case "diverging":
			if( $( "#num-classes" ).val() >= 12 )
			{
				$( "#num-classes" ).val( 11 );
				numClasses = 11;
			}
			$( "#num-classes option[name=12]" ).attr( "disabled", "disabled" );
			break;
	}
	showSchemes();
}

function showSchemes() {
	$("#ramps").empty();
	$("#cat-ramp").empty();
	if (selectedSchemeType == "sequential"){
	    for (var i in schemeNames[selectedSchemeType]){
            var ramp = $("<div class='ramp "+schemeNames[selectedSchemeType][i]+"' id='"+schemeNames[selectedSchemeType][i]+"'></div>"),
                svg = "<svg width='15' height='75'>";
            for ( var n = 0; n < 5; n++ ){
                svg += "<rect fill="+colorbrewer[schemeNames[selectedSchemeType][i]][5][n]+" width='15' height='15' y='"+n*15+"'/>";
            }
            svg += "</svg>";
            $("#ramps").append(ramp.append(svg).click( function(){
                if ( $(this).hasClass("selected") ) return;
                $("#styleClasify").show();
                $("#styleSave").hide();
                setScheme( $(this).attr("class").substr(5) );
            }));
        }
		$("#scheme1").css("width","160px");
		$("#multi").show().text("Multi-hue:");
		$("#scheme2").css("width","110px");
		$("#single").show().text("Single hue:");

		$("#singlehue").empty().css("display","inline-block");
		for ( i in schemeNames.singlehue){
			//if ( checkFilters(schemeNames.singlehue[i]) == false ) continue;
			var ramp = $("<div class='ramp "+schemeNames.singlehue[i]+"' id='"+schemeNames.singlehue[i]+"'></div>"),
				svg = "<svg width='15' height='75'>";
			for ( var n = 0; n < 5; n++ ){
				svg += "<rect fill="+colorbrewer[schemeNames.singlehue[i]][5][n]+" width='15' height='15' y='"+n*15+"'/>";
			}
			svg += "</svg>";
			$("#singlehue").append(ramp.append(svg).click( function(){
				if ( $(this).hasClass("selected") ) return;
				$("#styleClasify").show();
                $("#styleSave").hide();
				setScheme( $(this).attr("class").substr(5) );
			}));
		}
	} else if (selectedSchemeType == "qualitative") {
        var ramp = $("<div class='"+schemeNames[selectedSchemeType][i]+"' id='"+schemeNames[selectedSchemeType][i]+"'></div>");
        var svg = "<svg width='75' height='15'>";
        for (var n = 0; n < 5; n++){
            svg += "<rect fill="+colorbrewer[schemeNames[selectedSchemeType][0]][5][n]+" width='15' height='15' x='"+n*15+"'/>";
        }
        svg += "</svg><p class='text-muted' style='height:3px;'>Colores Aleatorios</p>";
        $("#cat-ramp").append(ramp.append(svg));
	} else {
		$("#scheme1").css("width","100%");
		$("#multi").hide();
		$("#singlehue").empty();
		$("#single").hide();
	}

	$(".score-icon").show();
	$("#color-system").show();
	if ( $(".ramp."+selectedScheme)[0] ){
		setScheme( selectedScheme );
	} else if ( $("#ramps").children().length ) setScheme( $("#ramps .ramp:first-child").attr("class").substr(5) );
	else clearSchemes();
}

function clearSchemes()
{
	$("#counties g path").css("fill","#ccc");
	$("#color-chips").empty();
	$("#color-values").empty();
	$("#ramps").css("width","100%");
	$("#scheme-name").html("");
	$(".score-icon").hide();
	$("#color-system").hide();
	$("#ramps").append('"<p>No hay esquemas de color que se ajustan a estos criterios.</p><p>Por favor, elija un menor'
	    + 'número de clases de datos, un tipo de datos diferente, y / o un menor número de opciones de filtrado.</p>"');
}

function setScheme(s)
{
	$("#county-map g").removeClass(selectedScheme).addClass(s);
	$(".ramp.selected").removeClass("selected");
	selectedScheme = s;
	$(".ramp."+selectedScheme).addClass("selected");
	$("#scheme-name").html(numClasses+"-class "+selectedScheme);
	////////////////applyColors();
	///////////////drawColorChips();
	$("#permalink").val("http://colorbrewer2.org/?type="+selectedSchemeType+"&scheme="+selectedScheme+"&n="+numClasses);
	window.location.hash = "type="+selectedSchemeType+"&scheme="+selectedScheme+"&n="+numClasses;

	//////////////updateValues();

	var cssString = "";
	for ( var i = 0; i < numClasses; i ++ ){
		cssString += "."+selectedScheme+" .q"+i+"-"+numClasses+"{fill:" + colorbrewer[selectedScheme][numClasses][i] + "}";
		if ( i < numClasses - 1 ) cssString += " ";
	}
	$("#copy-css input").val(cssString);

	$(".score-icon").attr("class","score-icon");

	function getWord(w){
		if ( !w ) return "not ";
		if ( w == 1 ) return "";
		if ( w == 2 ) return "possibly not ";
	}
}

$(".styleeditor-stroke").click(function() {
  $(".styleeditor-stroke").removeClass('active');
  $(this).addClass('active');
  if ( $("#style-type").val() == 'symbol') {
      $("#styleSave").show();
  }
});

function getAttr(idLayer, type) {
    if($('#data-attr').length){
        $('#style-attr').empty();
    }

    data = {
      'style_layerid':idLayer,
	  'dataType':type
    }

	$.ajax({
	    url: '{% url "get_featureinfostyle" %}',
	    type: 'POST',
	    data: {
	           'style_data': JSON.stringify(data),
	           csrfmiddlewaretoken: '{{ csrf_token }}'
	          },
	    dataType: 'json',
	    success: function(data) {
	    	if (!$.isEmptyObject(data)){
                var attr_list = []
                var pcontent = '<label for="data-attr">Atributo</label><select class="form-control" id="data-attr">'
	            + '<option value="null">Seleccione</option>';

                $.each(data, function(k, value) {
                   attr_list.push(value);
                });

                attr_list = attr_list.sort( function(a, b) {
                       if(a.description & b.description){
                           var atl = a.description.toLowerCase();
                           var btl = b.description.toLowerCase();
                       } else {
                           var atl = a.attribute.toLowerCase();
                           var btl = b.attribute.toLowerCase();
                       }
                       if(atl < btl) return -1;
                       if(atl > btl) return 1;
                       return 0;
                       })

                $.each(attr_list, function(index, val) {
                    if(val.description){
                        pcontent += '<option value="'+val.attribute+'">'+val.description+'</option>';
                    } else {
                        pcontent += '<option value="'+val.attribute+'">'+val.attribute+'</option>';
                    }
                });
                pcontent += '</select>';
                $( "#style-attr" ).html(pcontent);

                if (type == 'graduated') {
                    $('#style-attr').show('slow');
                    $("#scheme").show();
                    $("#div-tiporampa").show('slow');
                    $("#sequential").attr('checked',true);
                    $(".div-modo").show('slow');
                    $(".div-clases").show('slow');
                    setSchemeType('sequential');
                } else {
                    $('#style-attr').show('slow');
			        $("#cat-scheme").show('slow');
			        setSchemeType('qualitative');
                }
            } else {
                $("#edit-stroke").hide();
                $('#noExistAttrMsg').show().delay(5000).fadeOut();
            }
	    },
	    error: function() {
	        console.log('There is an error in the response');
	    }
	});
};


/* Duplicar capa */
$("#duplicateLayer").click(function() {
    var idLayerSelect = $(".layer_select").attr('id').slice(1);
    var object_id = $('#'+idLayerSelect);
    if (object_id.length) {
        var dataId = idLayerSelect;
        var dataInfo = object_id.attr('data-info');
        var typename = object_id.val();
        var title = object_id.attr('title');
        var checkId;
        var leafletId;

        var overlay = L.tileLayer.betterWms(object_id.attr('href'), {
              layers: typename,
              format: 'image/png',
              transparent: true,
            });

        map.addLayer(overlay);
        checkboxes.push(overlay);

        $.each(checkboxes, function(i, val) {
          if (overlay._leaflet_id == val._leaflet_id) {
            leafletId = val._leaflet_id;
            checkId = i;
            var zIndex = 100+i;
            val.setZIndex(zIndex);
          }
        });
        imglegend = object_id.attr('href')+'?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer='+typename+'&transparent=true" title="'+title;
        theLegend = '<div id="l'+dataId+"_"+checkId+'" leaflet-id="'+leafletId+'" typename="'+typename+'" data-title="'+title+'" class="rowlegend">'
        + '<div class="l-title"><i data-toggle="tooltip" title="Desactivar" class="fa fa-check-square" data-id="l'+dataId+"_"+checkId+'"></i> '+title+'</div>'
        + '<i data-toggle="tooltip" title="Eliminar" data-id="l'+dataId+"_"+index+'" class="delcopy fa fa-times"></i>'
        + '<div class="thumb"><a class="thumbnail2" href="#" data-image-id="" data-title="'+title+'" data-image="'+imglegend+'" data-target="#image-gallery"><img class="img-responsive" src="'+imglegend+'"/></a>'
        + '</div></div>';

        $( "#addlegend" ).prepend(theLegend);
        imgGallery();
    }
});

$("#addlegend").on("click", ".delcopy", function() {
    var dataId = $(this).attr('data-id');
    var leafletId = $("#"+dataId).attr("leaflet-id");

    $("#"+dataId).fadeOut(200, function(){ $(this).remove();});
    for (var i = 0; i < checkboxes.length; i++) {
      if (leafletId == checkboxes[i]._leaflet_id) {
        map.removeLayer(checkboxes[i]);
        checkboxes.splice(i,1);
      }
    }
  });
</script>