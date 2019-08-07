<script type="text/javascript">
/* Variables Globales*/
var geometry_type;
var typename;
var idLayerSelect;
var newStyle = false;

var unload = false;
$(window).bind('beforeunload', function(){
 if (unload) {
    return '¿Abandonar?';
 }
});

function closeStyles(){
    unload = false;
    $("#addstyle").hide('fast');
	$("#mapLayerListHandle").show('slow');
	$("#addlegend").show('slow');

    if( window.location.href.indexOf('?layer=') != -1 ) {
        $("#returnBtn").attr('href', '/layers/'+typename );
        $("#returnBtn").show();
    } else {
        /* Abre el panel izquierdo */
        $(".layerMenu").removeClass( "translateLayerListLeft" ).addClass( "translateLayerListRight" );
        $(".layerMenuNubOpen").removeClass( "layerMenuNubClosed" ).addClass( "layerMenuNubOpen" );
        $(".leaflet-left").addClass( "leaflet-control-openmenu" );
        $("#leftMenuActivationTab").show();

        /* Reactiva elementos ocultos */
        $(".leaflet-control-easyPrint").show();
        $(".leaflet-draw").show();
        $(".headerButtons").show();
        $(".headerButtons").show();
        $("#remoteServices").show();
        $("#selectedRegionDropDownContainer").show();
    }
}

function setLayerStyle(idLayer) {
    var style = $("#style").val();
    var leafletId = $('#'+idLayer).attr('leaflet-id');
    for (var i = 0; i < checkboxes.length; i++) {
        if (leafletId == checkboxes[i]._leaflet_id) {
            //delete(checkboxes[i].wmsParams.styles);
            checkboxes[i].setParams({'styles': style})
        }
    }
    if (newStyle) {
        $('#'+idLayer).attr('data-title', style)
        var check_html = '<i data-toggle="tooltip" title="Desactivar" class="fa fa-check-square" data-id="'+ idLayer +'"></i> ';
        $('#'+idLayer+' .l-title').text(style).prepend(check_html);
        $('#'+idLayer).find('.img-responsive').attr("style", style);
    }
    var src = $('#'+idLayer).find('.thumbnail2').attr('data-image');
    if(src.indexOf("style")>-1) {
        var src_split = src.split("style");
        src = src_split[0];
    }
    $('#'+idLayer).find('.img-responsive').attr("src", src +"&style="+ encodeURI(style)+ "&transparent=true" +"&?"+new Date().getTime());
    closeStyles();
    $("#style-type").val('symbol').prop('selected',true).trigger('change');
}

function setPointType(point_type) {
    var type_str;
    switch(point_type) {
        case 'circle':
            type_str = '<circle cx="7" cy="7" r="6"'
            break;
        case 'triangle':
            type_str = '<polygon points="0,12 12,12 6,0"'
            break;
        case 'rectangle':
            type_str = '<rect width="15" height="15"'
            break;
        case 'star':
            type_str = '<polygon points="10,1 4,20 19,8 1,8 16,20"'
            break;
    }
    return type_str;
}

function create_style(type, clasify, styleData){
    var idLayer = $(".layer_select").attr('id');
    var layer_name = $('#'+idLayer).attr('data-title');
    var style_name = $("#style").val();
    var geom_type = geometry_type;
    var stroke = null;
    var stroke_str = '';

    if ($("#stroke-enabled").is(":checked")) {
        var stroke = $('#stroke-color').val();
        var stroke_type = $('#stroke-type .active').attr('data-value');
        var stroke_width = $('#stroke-width').val();
        var stroke_opacity = $("#stroke-color").spectrum("get")._a
        var stroke_dasharray = $("#stroke-type .active").attr('data-dasharray');
        var str_dash = '';

        if (stroke_dasharray) {
            str_dash = 'stroke-dasharray="'+stroke_dasharray+'"';
        }
        stroke_str = 'stroke="'+ stroke + '" stroke-opacity="'+ stroke_opacity +'" stroke-width="'+ stroke_width +'" '+ str_dash;
    }

    data = {
      'layer_name': layer_name,
      'typename': typename,
      'geom_type': geom_type,
      'style_name': style_name
    }
    if(clasify) {
        data['clasify'] = true
    } else {
        data['style_data'] = styleData
    }

    switch(type) {
        case "symbol":
            data['fill_color'] = $('#fill-color').val();
            var fill_opacity = $("#fill-color").spectrum("get")._a
            data['fill_opacity'] = fill_opacity
            if (stroke) {
              data['stroke'] = stroke
              data['stroke_type'] = stroke_type
              data['stroke_width'] = stroke_width
              data['stroke_opacity'] = stroke_opacity
            }

            if (geom_type=='ST_Point' || geom_type=='ST_MultiPoint') {
		        data['point_type'] = $('#point-type-select').val();
		        data['point_size'] = $('#point-size').val();
		    }

			$.ajax({
              url: '{% url "symbol" %}',
              type: 'POST',
              data: {
                  'layer_data': JSON.stringify(data),
                  csrfmiddlewaretoken: '{{ csrf_token }}'
              },
              dataType: 'json',
              success: function(result) {
                  setLayerStyle(idLayer);
              },
              error : function(xhr,errmsg,err) {
                  console.log('Error en el servidor')
                  console.log(xhr.status + ": " + xhr.responseText);
              }
            });
			break;
		case "categorized":
		    var data_attr = $('#data-attr').val();
		    data['data_attr'] = data_attr;

            if(data_attr == 'null'){
                $('#noAttrMsg').show().delay(3000).fadeOut();
                break
            }

			$.ajax({
              url: '{% url "categorized" %}',
              type: 'POST',
              data: {
                'layer_data': JSON.stringify(data),
                csrfmiddlewaretoken: '{{ csrf_token }}'
                },
              dataType: 'json',
              success: function(result) {
                  if ('exceeded' in result){
                    $('#clasify').show();
                    $('#exceededMsg').show().delay(6000).fadeOut();
                    $("#styleSave").hide();
                    $("#applyStrokeBtn").hide();
                  } else if ('values' in result) {
                    var values = result.values;
                    var colors = result.fill_color;
                    var element = '<tr><th colspan="2">Simbolo</th><th>Valor</th><th>Leyenda</th></tr>';

                    if (geom_type=='ST_MultiPolygon') {
                        $.each(values, function(i, val) {
                            element += '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
                            + '<td class="text-center styleFill"><svg width="15" height="15" style="margin-top:5px;"><rect'
                            +' class="symbol" fill="'+ colors[i]+'" fill-opacity="1.0" width="15" height="15"'+ stroke_str + '>'
                            + '<title>Doble clic para editar</title></rect>'
                            + '</td><td><input type = "text" class = "form-control editable input-sm stvalue" value="'
                            + val +'" readonly></td><td><input type = "text" class="form-control editable input-sm stlgd" value="'+val+'" readonly></td></tr>';
                        });
                    } else if (geom_type=='ST_Point' || geom_type=='ST_MultiPoint') {
                        var point_type = $("#point-type-select").val();
                        var point_size = $("#point-size").val();
                        var type_str = setPointType(point_type);

                        $.each(values, function(i, val) {
                            element += '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
                            + '<td class="text-center styleFill"><svg width="20" height="20" style="margin-top:5px;">'+ type_str
                            + ' class="symbol" fill="'+ colors[i]+'" fill-opacity="1.0"'+ stroke_str + '>'
                            + '<title class="pointData" size="'+point_size+'" type="'+point_type+'">Doble clic para editar</title></>'
                            + '</td><td><input type = "text" class = "form-control editable input-sm stvalue" value="'
                            + val +'" readonly></td><td><input type = "text" class="form-control editable input-sm stlgd" value="'+val+'" readonly></td></tr>';
                        });
                    } else if (geom_type=='ST_MultiLineString') {
                        $.each(values, function(i, val) {
                            element += '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
                            + '<td class="text-center styleFill"><svg width="20" height="20" style="margin-top:5px; margin-left:-10px;">'
                            + '<rect width="20" height="20" fill="white"/>'
                            + '<line class="symbol" x1="0" y1="10" x2="20" y2="10" stroke="'+ colors[i]
                            + '" stroke-opacity="'+ stroke_opacity +'" stroke-width="'+ stroke_width +'" '+ str_dash + '>'
                            + '<title>Doble clic para editar</title></line>'
                            + '</td><td><input type = "text" class = "form-control editable input-sm stvalue" value="'
                            + val +'" readonly></td><td><input type = "text" class="form-control editable input-sm stlgd" value="'+val+'" readonly></td></tr>';
                        });
                    } else {
                        console.log('Tipo de Geometria no identificado')
                    }
                    $('#clasify-data').append(element);
                    $('#clasify').show();
                    $('#styleClasify').hide();
                    $("#styleSave").show();
                  } else {
                    setLayerStyle(idLayer);
                  }
              },
              error : function(xhr,errmsg,err) {
                  console.log('Error en el servidor')
                  console.log(xhr.status + ": " + xhr.responseText);
              }
            });
			break;
		case "graduated":
		    var data_attr = $('#data-attr').val();

            if(data_attr == 'null'){
                $('#noAttrMsg').show().delay(3000).fadeOut();
                break
            }

            var stats_method = $('#stats-method').val();
            var num_classes = $('#num-classes').val();
            var ramp_id = $('#scheme .ramp.selected').attr('id');
            var ramp_colors = colorbrewer[ramp_id][num_classes]
            var ramp_colors_hex = []

            $.each(ramp_colors, function(i, val) {
                var color = tinycolor(val);
                ramp_colors_hex.push(color.toHexString());
            });

            data['data_attr'] = data_attr;
            data['stats_method'] = stats_method;
            data['num_classes'] = num_classes,
            data['ramp_colors'] = ramp_colors_hex;

			$.ajax({
              url: '{% url "graduated" %}',
              type: 'POST',
              data: {
                'layer_data': JSON.stringify(data),
                csrfmiddlewaretoken: '{{ csrf_token }}'
              },
              dataType: 'json',
              success: function(result) {
                  if ('values' in result) {
                    var values = result.values;
                    var colors = ramp_colors_hex;
                    var element = '<tr><th colspan="2">Simbolo</th><th>Valores</th><th>Leyenda</th></tr>';

                    if (geom_type=='ST_MultiPolygon') {
                        for(i=0; i < values.length-1;i++){
                            element += '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
                            + '<td class="text-center styleFill"><svg width="15" height="15" style="margin-top:5px;"><rect'
                            +' class="symbol" fill="'+ colors[i]+'" fill-opacity="1.0" width="15" height="15"'+ stroke_str + '>'
                            + '<title>Doble clic para editar</title></rect>'
                            + '</td><td><input type="text" class="form-control editable input-sm stvalue1" value="'+values[i]+'" readonly>'
                            + '<label class="hyphen">-</label><input type="text" class="form-control editable input-sm stvalue2" value="'+values[i+1]+'" readonly>'
                            + '</td><td><input type = "text" class="form-control editable input-sm stlgd" value="'
                            + values[i].toFixed(2) + ' - '+ values[i+1].toFixed(2) +'" readonly></td></tr>';
                        }
                    } else if (geom_type=='ST_Point' || geom_type=='ST_MultiPoint') {
                        var point_type = $("#point-type-select").val();
                        var point_size = $("#point-size").val();
                        var type_str = setPointType(point_type);

                        for(i=0; i < values.length-1;i++){
                            element += '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
                            + '<td class="text-center styleFill"><svg width="20" height="20" style="margin-top:5px;">'+ type_str
                            + ' class="symbol" fill="'+ colors[i]+'" fill-opacity="1.0" '+ stroke_str + '>'
                            + '<title class="pointData" size="'+point_size+'" type="'+point_type+'">Doble clic para editar</title></></td>'
                            + '<td><input type="text" class="form-control editable input-sm stvalue1" value="'+values[i]+'" readonly>'
                            + '<label class="hyphen">-</label><input type="text" class="form-control editable input-sm stvalue2" value="'+values[i+1]+'" readonly>'
                            + '</td><td><input type = "text" class="form-control editable input-sm stlgd" value="'
                            + values[i].toFixed(2) + ' - '+ values[i+1].toFixed(2) +'" readonly></td></tr>';
                        }
                    } else if (geom_type=='ST_MultiLineString') {
                        for(i=0; i < values.length-1;i++){
                            element += '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
                            + '<td class="text-center styleFill"><svg width="20" height="20" style="margin-top:5px; margin-left:-10px;">'
                            + '<rect width="20" height="20" fill="white"/>'
                            + '<line class="symbol" x1="0" y1="10" x2="20" y2="10" stroke="'+ colors[i]
                            + '" stroke-opacity="'+ stroke_opacity +'" stroke-width="'+ stroke_width +'" '+ str_dash + '>'
                            + '"><title>Doble clic para editar</title></line>'
                            + '</td><td><input type="text" class="form-control editable input-sm stvalue1" value="'+values[i]+'" readonly>'
                            + '<label class="hyphen">-</label><input type="text" class="form-control editable input-sm stvalue2" value="'+values[i+1]+'" readonly>'
                            + '</td><td><input type = "text" class="form-control editable input-sm stlgd" value="'
                            + values[i].toFixed(2) + ' - '+ values[i+1].toFixed(2) +'" readonly></td></tr>';
                        }
                    } else {
                        console.log('Tipo de Geometria no identificado')
                    }
                    $('#clasify-data').append(element);
                    $('#clasify').show();
                    $('#styleClasify').hide();
                    $("#styleSave").show();
                  } else {
                    setLayerStyle(idLayer);
                  }
              },
              error : function(xhr,errmsg,err) {
                  console.log('Error en el servidor')
                  console.log(xhr.status + ": " + xhr.responseText);
              }
            });
			break;
    }
}

/* Evento que aplica estilo a capa */
$("#styleSave").click(function() {
    var data_attr = $('#data-attr').val();
    if(data_attr == 'null'){
        $('#noAttrMsg').show().delay(3000).fadeOut();
    } else {
        $("#style-table").hide();
        $("#style_load").show();
        var type = $("#style-type").val();
        var point_data;
        if (type == "symbol"){
            create_style(type, false, null);
        } else if (type == "categorized") {
            var styleData = [];
            $(".styleData").each(function(i) {
                var sym = $(this).find(".symbol");

                var sfill = sym.attr('fill');
                var sfill_opacity = sym.attr('fill-opacity');

                var sstroke = sym.attr('stroke');
                var sstroke_opacity = sym.attr('stroke-opacity');
                var sstroke_width = sym.attr('stroke-width');
                var sstroke_dasharray = sym.attr('stroke-dasharray');

                var svalue = $(this).find("input.stvalue").val();
                var slgd = $(this).find("input.stlgd").val();

                var stroke = [sstroke, sstroke_opacity, sstroke_width, sstroke_dasharray]

                if (geometry_type=='ST_Point' || geom_type=='ST_MultiPoint') {
                    var point = $(this).find(".pointData");
                    var point_data = [point.attr('type'), point.attr('size')];
                }
                styleData.push([sfill, sfill_opacity, svalue, slgd, stroke, point_data]);
            });
            create_style(type, false, styleData);
            $('#clasify').hide();
            $('#edit-symbol').hide();
        } else {
            var styleData = [];
            $(".styleData").each(function(i) {
                var sym = $(this).find(".symbol");
                var sfill = sym.attr('fill');
                var sfill_opacity = sym.attr('fill-opacity');
                var sstroke = sym.attr('stroke');
                var sstroke_opacity = sym.attr('stroke-opacity');
                var sstroke_width = sym.attr('stroke-width');
                var sstroke_dasharray = sym.attr('stroke-dasharray');

                var svalue1 = $(this).find("input.stvalue1").val();
                var svalue2 = $(this).find("input.stvalue2").val();
                var slgd = $(this).find("input.stlgd").val();

                var fill = [sfill, sfill_opacity];
                var stroke = [sstroke, sstroke_opacity, sstroke_width, sstroke_dasharray]
                var values = [svalue1, svalue2]

                if (geometry_type=='ST_Point' || geom_type=='ST_MultiPoint') {
                    var point = $(this).find(".pointData");
                    var point_data = [point.attr('type'), point.attr('size')];
                }

                styleData.push([fill, values, slgd, stroke, point_data]);
            });
            create_style(type, false, styleData);
            $('#clasify').hide();
            $('#edit-symbol').hide();
        }
    }
});

/* Selector de atributo de capa */
$("#style-attr").on('change','#data-attr', function() {
    $("#styleClasify").show();
    $("#styleSave").hide();
});

/* Boton de clasificar */
$('#clasifyBtn').click(function() {
    $('#clasify-data').empty();
    create_style($("#style-type").val(), true, null);
});

$("#stats-method, #num-classes").change(function() {
    $("#styleClasify").show();
    $("#styleSave").hide();
});

$('#applyOpacity').click(function() {
    var fill_opa = $("#transparency-slider-b").attr("data-value");
    $(".styleData").each(function(i) {
      var sym = $(this).find('.symbol');
      sym.attr('fill-opacity', fill_opa);
    });
    $("#styleSave").show();
});

$('#applyStrokeBtn').click(function() {
    var stroke = $('#stroke-color').val();
    var stroke_width = $('#stroke-width').val();
    var stroke_opacity = $("#stroke-color").spectrum("get")._a
    var stroke_dasharray = $("#stroke-type .active").attr('data-dasharray');

    $(".styleData").each(function(i) {
      var sym = $(this).find('.symbol');
      if (geometry_type!='ST_MultiLineString') {
        sym.attr('stroke', stroke);
      }
      sym.attr('stroke-width', stroke_width);
      sym.attr('stroke-opacity', stroke_opacity);

      if (stroke_dasharray) {
        sym.attr('stroke-dasharray', stroke_dasharray);
      } else {
        sym.removeAttr('stroke-dasharray');
      }
    });
    $("#styleSave").show();
});

$('#point-type-select, #point-size').change( function() {
    var type = $("#style-type").val();
    if (type == "symbol"){
        $("#styleSave").show();
    } else {
        $("#styleClasify").show();
        $("#styleSave").hide();
    }
});

/* ====================================== */
/* Eventos de la ventana de clasificacion */
/* ====================================== */

/* Cerrar ventana de clasificacion*/
$('#close-window').click(function() {
    $('#clasify-data').empty();
    $('#clasify').hide();
});

/* Hace editables campos de clasificacion*/
$("#clasify-data").on('dblclick','.editable', function() {
    $(".stvalue").addClass("editable");
    $(".stlgd").addClass("editable");
    $(".editable").attr("readonly", true);
    $(this).attr("readonly", false);
    $(this).removeClass("editable");
});

/* Editar simbolo */
$("#clasify-data").on("dblclick", ".symbol", function() {
    $("#clasify-overlay").show();
    var fill = tinycolor($(this).attr('fill'));
    var fill_opacity = $(this).attr('fill-opacity');

    $(this).attr('class', 'symbol fillSelected');
    $(this).closest('td').attr('class', 'text-center styleFill tdSelected');
    $(this).closest('tr').css({'background': 'rgba(8, 159, 207, 0.5)'});

    if (fill_opacity) {
      fill._a = fill_opacity;
    } else {
      fill._a = 1
    }
    $("#symbol-fill").spectrum("set", fill);

    if ($(this).attr('stroke')) {
      var stroke = tinycolor($(this).attr('stroke'));
      var stroke_opacity = $(this).attr('stroke-opacity');
      var stroke_width = $(this).attr('stroke-width');
      var stroke_dasharray = $(this).attr('stroke-dasharray');

      $("#symbol-stroke-enabled").prop('checked', true).trigger('change');

      if (stroke_opacity) {
        stroke._a = stroke_opacity;
      } else {
        stroke._a = 1
      }
      $("#symbol-stroke").spectrum("set", stroke);
      $("#symbol-stroke-width").val(stroke_width);
      if (stroke_dasharray) {
          $("#symbol-stroke-type div.active").removeClass('active');
          $("#symbol-stroke-type div[data-dasharray='"+ stroke_dasharray +"']").addClass('active');
      }
    }
    if (geometry_type=='ST_MultiLineString') {
        $("#edit-fill").hide();
    } else {
        $("#edit-fill").show();
    }
    if (geometry_type=='ST_Point' || geom_type=='ST_MultiPoint') {
        $("#spoint-type").show();
        $("#spoint-type-select").val($(this).find(".pointData").attr("type"));
        $("#spoint-size").val($(this).find(".pointData").attr("size"));
    } else {
        $("#spoint-type").hide();
    }
    $('#edit-symbol').show();
    $('#edit-symbol-stroke').show();
    $('#styleClasify').hide();
    $('#styleSave').show();
});

$("#clasify-data").on("dblclick", ".pre-symbol", function() {
    $(this).next(".symbol").trigger("dblclick");
});

$("#clasifyAdd").click( function() {
    if ($("#style-type").val()== 'categorized') {
        var element = '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
        + '<td class="text-center styleFill"><svg width="15" height="15" style="margin-top:5px;"><rect id=" "'
        + ' class="symbol" fill="#000" fill-opacity="1.0" width="15" height="15" stroke="#d0cfd4" stroke-opacity="1.0" stroke-width="0.26">'
        + '<title>Doble clic para editar</title></rect>'
        + '</td><td><input type = "text" class = "form-control editable input-sm stvalue" value="aaa" readonly></td>'
        + '<td><input type="text" class="form-control editable input-sm stlgd" value="aaa" readonly></td></tr>';
    } else {
        var element = '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
        + '<td class="text-center styleFill"><svg width="15" height="15" style="margin-top:5px;"><rect id=" "'
        + ' class="symbol" fill="#000" fill-opacity="1.0" width="15" height="15" stroke="#d0cfd4" stroke-opacity="1.0" stroke-width="0.26">'
        + '<title>Doble clic para editar</title></rect>'
        + '</td><td><input type="text" class="form-control editable input-sm stvalue1" value="0" readonly>'
        + '<label class="hyphen">-</label><input type="text" class="form-control editable input-sm stvalue2" value="0" readonly>'
        + '</td><td><input type = "text" class="form-control editable input-sm stlgd" value="0-0" readonly></td></tr>';
    }
    $('#clasify-data').append(element);
});

$("#clasifyDel").click( function() {
    $('.clasify-row:checked').closest('tr').remove();
});

$("#clasifyDelAll").click( function() {
    $('#clasify-data').empty();
});

$("#symbolCancel").click( function() {
    $("#clasify-overlay").hide();
    $(".styleData").removeAttr('style');
    $(".tdSelected").attr('class', 'text-center styleFill');
    $(".fillSelected").attr('class', 'symbol');
    $('#edit-symbol').hide();
});

$("#symbolApply").click( function() {
    var sym_fill = $("#symbol-fill").spectrum("get");

    if (geometry_type=='ST_Point' || geom_type=='ST_MultiPoint') {
        var point_type = $('#spoint-type-select').val();
        var point_size = $('#spoint-size').val();
        var ptype_origin = $(".fillSelected .pointData").attr("type");

        if (point_type != ptype_origin) {
            $(".tdSelected").empty();
            var type_str = setPointType(point_type);
            var new_element = '<svg width="20" height="20" style="margin-top:5px;">'+type_str
              + ' class="symbol fillSelected" fill="#fff" fill-opacity="1">'
              + '<title class="pointData" size="'+point_size+'" type="'+point_type+'">Doble clic para editar</title></>';
            $(".tdSelected").append(new_element);
        } else {
            $(".fillSelected .pointData").attr("type", point_type);
            $(".fillSelected .pointData").attr("size", point_size);
        }
    }

    $(".fillSelected").attr('fill', sym_fill.toHexString());
    $(".fillSelected").attr('fill-opacity', sym_fill._a);

    if ($("#symbol-stroke-enabled").is(":checked")) {
      var sym_stroke = $('#symbol-stroke').val();
      var sym_stroke_type = $('#symbol-stroke-type .active').attr('data-dasharray');
      var sym_stroke_width = $('#symbol-stroke-width').val();
      var sym_stroke_opacity = $("#symbol-stroke").spectrum("get")._a

      $(".fillSelected").attr('stroke', sym_stroke);
      $(".fillSelected").attr('stroke-dasharray', sym_stroke_type);
      $(".fillSelected").attr('stroke-width', sym_stroke_width);
      $(".fillSelected").attr('stroke-opacity', sym_stroke_opacity);
    }

    $(".tdSelected").attr('class', 'text-center styleFill');
    $(".fillSelected").attr('class', 'symbol');
    $('#edit-symbol').hide();
    $(".styleData").removeAttr('style');
    $("#clasify-overlay").hide();
});

/* Obtener Estilos de capa */
function getSLD_data(geom_type, style_name) {
	$("#style_load").show();
	$("#style-table").hide();
	geometry_type = geom_type;

    data = {
      'geom_type': geom_type,
      'style_name': style_name
    }

    $.ajax({
      url: '{% url "edit_style" %}',
      type: 'POST',
      data: {
          'layer_data': JSON.stringify(data),
          csrfmiddlewaretoken: '{{ csrf_token }}'
      },
      dataType: 'json',
      success: function(data) {
          if (data[0].unique) {
              var fill = tinycolor(data[0].fill);
              if ('fill-opacity' in data[0]) {
                fill._a = data[0]['fill-opacity'];
              } else {
                fill._a = 1
              }
              $("#style-type").val('symbol').prop('selected',true).trigger('change');
              $("#fill-color").spectrum("set", fill);

              if (geom_type=='ST_Point' || geom_type=='ST_MultiPoint') {
                $("#symbol-type").show();
                $('#point-type-select').val(data[0]['point_type']);
		        $('#point-size').val(data[0]['point_size']);
              }
          } else {
              var str_dash = '';
              $('#clasify-data').empty();
              var element = '<tr><th colspan="2">Simbolo</th><th>Valor</th><th>Leyenda</th></tr>';
              $("#opacity").show();

              if ( !data[0].not_cat ) {
                  if (geom_type=='ST_MultiPolygon') {
                      $.each(data, function(i, val) {
                          if (!('fill-opacity' in val)){
                            val['fill-opacity'] = '1.0'
                          }
                          stroke_str = ifStroke(val);

                          element += '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
                          + '<td class="text-center styleFill"><svg width="15" height="15" style="margin-top:5px;"><rect width="15" height="15"'
                          + ' class="symbol" fill="'+ val.fill +'" fill-opacity="'+ val['fill-opacity'] +'"'+ stroke_str +'>'
                          + '<title>Doble clic para editar</title></rect>'
                          + '</td><td><input type = "text" class = "form-control editable input-sm stvalue" value="'
                          + val.value +'" readonly></td><td><input type = "text" class="form-control editable input-sm stlgd" value="'+val.legend+'" readonly></td></tr>';
                      });
                  } else if (geom_type=='ST_Point' || geom_type=='ST_MultiPoint') {
                      $("#point-type-select").val(data[0].point_type);
                      $("#point-size").val(data[0].point_size);

                      $.each(data, function(i, val) {
                          if (!('fill-opacity' in val)){
                            val['fill-opacity'] = '1.0'
                          }

                          type_str = setPointType(val.point_type);
                          stroke_str = ifStroke(val);

                          element += '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
                          + '<td class="text-center styleFill"><svg width="20" height="20" style="margin-top:5px;">'+type_str
                          + ' class="symbol" fill="'+ val.fill +'" fill-opacity="'+ val['fill-opacity'] +'"' + stroke_str +'>'
                          + '<title class="pointData" size="'+val.point_size+'" type="'+val.point_type+'">Doble clic para editar</title></circle>'
                          + '</td><td><input type = "text" class = "form-control editable input-sm stvalue" value="'
                          + val.value +'" readonly></td><td><input type = "text" class="form-control editable input-sm stlgd" value="'+val.legend+'" readonly></td></tr>';
                      });
                  } else if (geom_type=='ST_MultiLineString') {
                    $.each(data, function(i, val) {
                          stroke_str = ifStroke(val);

                          element += '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
                          + '<td class="text-center styleFill"><svg width="20" height="20" style="margin-top:5px; margin-left:-10px;">'
                          + '<rect width="20" height="20" fill="white"/>'
                          + '<line class="symbol" x1="0" y1="10" x2="20" y2="10"'+ stroke_str +'>'
                          + '<title>Doble clic para editar</title></line>'
                          + '</td><td><input type = "text" class = "form-control editable input-sm stvalue" value="'
                          + val.value +'" readonly></td><td><input type = "text" class="form-control editable input-sm stlgd" value="'+val.legend+'" readonly></td></tr>';
                    });
                  }
                  $("#style-type").val('categorized').prop('selected',true).trigger('change');
              } else {
                  if (geom_type=='ST_MultiPolygon') {
                      $.each(data, function(i, val) {
                          if (!('fill-opacity' in val)){
                            val['fill-opacity'] = '1.0'
                          }

                          stroke_str = ifStroke(val);

                          element += '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
                          + '<td class="text-center styleFill"><svg width="15" height="15" style="margin-top:5px;"><rect width="15" height="15"'
                          +' class="symbol" fill="'+ val.fill +'" fill-opacity="'+ val['fill-opacity'] +'"'+ stroke_str +'>'
                          + '<title>Doble clic para editar</title></rect>'
                          + '</td><td><input type="text" class="form-control editable input-sm stvalue1" value="'+val.min_value+'" readonly>'
                          + '<label class="hyphen">-</label><input type="text" class="form-control editable input-sm stvalue2" value="'+val.max_value+'" readonly>'
                          + '</td><td><input type = "text" class="form-control editable input-sm stlgd" value="'
                          + val.legend +'" readonly></td></tr>';
                      });
                  } else if (geom_type=='ST_Point' || geom_type=='ST_MultiPoint') {
                    $("#point-type-select").val(data[0].point_type);
                    $("#point-size").val(data[0].point_size);

                    $.each(data, function(i, val) {
                          if (!('fill-opacity' in val)){
                            val['fill-opacity'] = '1.0'
                          }

                          type_str = setPointType(val.point_type);
                          stroke_str = ifStroke(val);

                          element += '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
                          + '<td class="text-center styleFill"><svg width="20" height="20" style="margin-top:5px;">'+type_str
                          + ' class="symbol" fill="'+ val.fill +'" fill-opacity="'+ val['fill-opacity'] +'"'+stroke_str  +'>'
                          + '<title class="pointData" size="'+val.point_size+'" type="'+val.point_type+'">Doble clic para editar</title></></td>'
                          + '<td><input type="text" class="form-control editable input-sm stvalue1" value="'+val.min_value+'" readonly>'
                          + '<label class="hyphen">-</label><input type="text" class="form-control editable input-sm stvalue2" value="'+val.max_value+'" readonly>'
                          + '</td><td><input type = "text" class="form-control editable input-sm stlgd" value="'
                          + val.legend +'" readonly></td></tr>';
                    });
                  } else if (geom_type=='ST_MultiLineString') {
                    $.each(data, function(i, val) {
                          if (!('fill-opacity' in val)){
                            val['fill-opacity'] = '1.0'
                          }
                          stroke_str = ifStroke(val);

                          element += '<tr class="styleData"><td><input type="checkbox" class="clasify-row" style="margin:5px;"></td>'
                          + '<td class="text-center styleFill"><svg width="20" height="20" style="margin-top:5px; margin-left:-10px;">'
                          + '<rect class="pre-symbol" width="20" height="20" fill="white"/>'
                          + '<line class="symbol" x1="0" y1="10" x2="20" y2="10"'+stroke_str +'>'
                          + '<title>Doble clic para editar</title></line>'
                          + '</td><td><input type="text" class="form-control editable input-sm stvalue1" value="'+val.min_value+'" readonly>'
                          + '<label class="hyphen">-</label><input type="text" class="form-control editable input-sm stvalue2" value="'+val.max_value+'" readonly>'
                          + '</td><td><input type = "text" class="form-control editable input-sm stlgd" value="'
                          + val.legend +'" readonly></td></tr>';
                    });
                  }
                  $("#style-type").val('graduated').prop('selected',true).trigger('change');
                  $("#num-classes").val(data.length);
              }
              $("#clasifyAttrName").text(data[0].attribute);
              setTimeout(function(){
                $("#data-attr").val(data[0].attribute);
                var attr_text = $("#data-attr option[value='"+data[0].attribute+"']").text();
                if (attr_text){$("#clasifyAttrName").text(attr_text);}
                }, 200);
              $('#clasify-data').append(element);
              $('#clasify').show();
          }

          if (data[0].stroke) {
              $("#stroke-enabled").prop('checked', true).trigger('change');
              var stroke = tinycolor(data[0].stroke);
              $("#stroke-color").spectrum("set", stroke);

              if ('stroke-opacity' in data[0]) {
                stroke._a = data[0]['stroke-opacity'];
              } else {
                stroke._a = 1
              }
              if ('stroke-width' in data[0]) {
                $("#stroke-width").val(data[0]['stroke-width']);
              } else {
                $("#stroke-width").val('1.0');
              }
              if ('stroke-dasharray' in data[0]) {
                  $("#stroke-type div.active").removeClass('active');
                  $("#stroke-type div[data-dasharray='"+ data[0]['stroke-dasharray'] +"']").addClass('active');
              }
          } else {
            $("#stroke-enabled").prop('checked', false).trigger('change');
          }

          isLineInitial();
          $("#style_load").hide();
          $("#style-table").show();
          $("#styleSave").hide();
      },
      error : function(xhr,errmsg,err) {
          console.log('Error al leer el estilo de la capa: ')
          console.log(xhr.status + ": " + xhr.responseText);

          $("#style-type").val('symbol').prop('selected',true).trigger('change');
          $('#noStyleLoadMsg').show().delay(5000).fadeOut();
          isLineInitial();
          $("#style_load").hide();
          $("#style-table").show();
          $("#styleSave").hide();
      }
    });
}

function ifStroke(val){
    var stroke_str = '';

    if ( 'stroke' in val ) {
        var str_dash = '';

        if (!('stroke-opacity' in val)){
          val['stroke-opacity'] = '1.0';
        }
        if (!('stroke-width' in val)){
          val['stroke-width'] = '1.0';
        }
        if ('stroke-dasharray' in val) {
          str_dash = ' stroke-dasharray="'+ val['stroke-dasharray']+'"';
        }

        stroke_str = 'stroke="'+ val['stroke'] + '" stroke-opacity="'+ val['stroke-opacity'] +'" stroke-width="'+ val['stroke-width'] +'"'+ str_dash;
    }
    return stroke_str;
}

function isLineInitial() {
    if (geom_type=='ST_MultiLineString') {
      $("#unique-symbol").hide();
      if ( $(".div-borde").is( ":hidden" ) ) {
        $("#stroke-enabled").prop('checked', true).attr("disabled", true).trigger('change');
        if ( $("#style-type").val() == 'categorized') {
          $("#applyStrokeBtn").show();
        }
      }
    }
}

/* Funciones para simbolo unico */
$('#stroke-width').change(function() {
    if ( $("#style-type").val() == 'symbol') {
        $("#styleSave").show();
    }
});

/* Selector de Estilo */
$("#style").change( function() {
    var style = $(this).val();
    var idLayer = $(".layer_select").attr('id');

    if( style == 'newStyle' ){
        $("#clasify-overlay").show();
        $("#newStyleWindow").show();
        $("#clasify").hide();
        newStyle = true;
    } else {
        var leafletId = $('#'+idLayer).attr('leaflet-id');
        for (var i = 0; i < checkboxes.length; i++) {
            if (leafletId == checkboxes[i]._leaflet_id) {
                //delete(checkboxes[i].wmsParams.styles);
                checkboxes[i].setParams({'styles': style})
                $('#'+idLayer).attr('data-title', style)
                var check_html = '<i data-toggle="tooltip" title="Desactivar" class="fa fa-check-square" data-id="l'+idLayer+'"></i> ';
                $('#'+idLayer+' .l-title').text(style).prepend(check_html);
                var src = $('#'+idLayer).find('.thumbnail2').attr('data-image');
                if(src.indexOf("style")>-1) {
                    var src_split = src.split("style");
                    src = src_split[0];
                }
                $('#'+idLayer).find('.img-responsive').attr("src", src +"&style="+ encodeURI(style) +"&transparent=true" +"&?"+new Date().getTime());
                $('#'+idLayer).find('.img-responsive').attr("style", style);
            }
        }
        getSLD_data(geom_type, $(this).val());
    }
});

/* Boton aceptar de ventana de nuevo estilo*/
$("#addNewStyle").click( function() {
    var newTitle = $("#newStyleTitle").val();
    if(newTitle!=''){
        if(newTitle.indexOf('/')!= -1) {
             $("#errTitleMsg").show().delay(5000).fadeOut();
        } else {
            var newOpt = '<option value="'+ newTitle +'">'+ newTitle +'</option>';
            $("#style").append(newOpt);
            $("#style").val(newTitle);
            $("#newStyleWindow").hide();
            $("#clasify-overlay").hide();
        }
    } else {
        $("#noTitleMsg").show().delay(5000).fadeOut();
    }
});

/* Cerrar ventana de nuevo estilo*/
$("#clsNewStyle").click( function() {
    var idLayer = $(".layer_select").attr('id');
    var default_style = $("#style option[name='default_style']").val();

    $("#newStyleWindow").hide();
    $("#style").val(default_style);
    $("#clasify-overlay").hide();
    newStyle = false;
});
</script>