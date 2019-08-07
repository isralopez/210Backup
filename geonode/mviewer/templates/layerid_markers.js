<script type="text/javascript">
var marker_id;
var marker_narrative = [];
var layerid = {{layerid|safe}};
var markers = {{markers|safe}};
var southWest = L.latLng(-90, -180),
      northEast = L.latLng(90, 180),
      bounds = L.latLngBounds(southWest, northEast);

var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  });
var gray = L.esri.basemapLayer("DarkGray");
var frame = $('#cke_1_contents iframe');

var layer = L.tileLayer.wms(layerid.ows, {
                layers: layerid.name,
                format: 'image/png',
                styles: layerid.style,
                transparent: true
              });

var map = L.map('map', {
        center: [24, -101],
        zoom: 5,
        animate: true,
        layers: [gray, layer],
        maxBounds: bounds,
        maxZoom: 12,
        minZoom: 3
      });

map.fitBounds({{bounds|safe}});

$.each(markers, function(i, v) {
    var options = {
      icon: v.icon,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      innerIconAnchor: [0, 6],
      innerIconStyle: 'font-size:14px;',
      borderColor: v.color,
      textColor: v.color,
    };
    if (v.shape != 'circle') {options['iconShape']=v.shape}
    if (v.transparent == 'true') {options['backgroundColor']='transparent'}

    marker_narrative[i] = L.marker([v['lat'], v['lng']], {
      icon: L.BeautifyIcon.icon(options),
      draggable: true
    }).addTo(map)

    /* Evento para mover marker */
    marker_narrative[i].on('dragend', function(event){
       var position = event.target.getLatLng();

       $.ajax({
            type: 'GET',
            url: '{% url "change_marker_position" %}',
            data: {'markid': v.id, 'lat': position.lat, 'lng': position.lng},
            success: function (data) {
                console.log(data);
            },
            error: function(message) {
                console.log(message);
            }
        });
    });

    marker_narrative[i].on('mouseover', function(e) {
        var popup_html = '<label>Editar</label><br><div class="popup-content"><span class="popup-edit">'
            + '<i class="fa fa-file-text-o abc" title="Narrativa" aria-hidden="true" data-id="'+v.id+'"></i></span>'
            + '<span class="popup-edit"><i class="fa fa-map-marker" title="Marcador" aria-hidden="true" data-id="'+ v.id+'"></i></span>'
            + '<span class="popup-edit"><i class="fa fa-trash" title="Eliminar" aria-hidden="true" data-id="'+ v.id
            + '" data-leafletId="'+ marker_narrative[i]._leaflet_id +'"></i></span></div>';
        e.target.bindPopup(popup_html).openPopup();
    });
});

/* Editar narrativa de marcador */
$('#map').on('click', '.fa-file-text-o', function() {
    var mark_id = $(this).attr('data-id');
    var frame = $('#cke_1_contents iframe');
    $.each(markers, function(i, val) {
        if (val.id == mark_id) {
            $("#id_title").val(val.title);
            frame[0].contentWindow.document.body.innerHTML = val.narrative;
        }
    });
    marker_id = mark_id;
    $('#marker-narrative-modal').modal('toggle');
});

/* Eliminar marcador y narrativa */
$('#map').on('click', '.fa-trash', function() {
    var mark_id = $(this).attr('data-id');
    var leafletId = $(this).attr('data-leafletId');

    $.ajax({
        type: 'GET',
        url: '{% url "remove_layerid_marker" %}',
        data: {'marker_id': mark_id, 'regid': layerid.id },
        success: function (data) {
            for (var i = 0; i < marker_narrative.length; i++) {
                if (leafletId == marker_narrative[i]._leaflet_id) {
                    map.removeLayer(marker_narrative[i]);
                }
            }
        },
        error: function(message) {
            console.log(message);
        }
    });
});

/* Editar icono de marcador */
$('#map').on('click', '.fa-map-marker', function() {
    var mark_id = $(this).attr('data-id');

    $.each(markers, function(i, v) {
        if (v.id == mark_id) {
            if (v.icon) {
                $('#id_icon').val(v.icon).change();
                $("#icon-color").spectrum("set", v.color);
                $("#icon-shape").val(v.shape);
                if (v.transparent == 'true') {
                    $("#icon-transparent").prop('checked', true);
                } else {
                    $("#icon-transparent").prop('checked', false);
                }
            } else {
                $('#id_icon').val('info').change();
                $("#icon-color").spectrum("set", "#df1e1e");
                $("#icon-shape").val('circle');
                $("#icon-transparent").prop('checked', false);
            }
        }
    });
    marker_id = mark_id;
    $('#change-icon-modal').modal('toggle');
    $("#s2id_id_icon").removeAttr("style")
});

var MarkerDrawer = new L.Draw.Marker(map, {draggable: true});

/* Buscador de lugares */
var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();

var searchControl = L.esri.Geocoding.geosearch({
	providers: [arcgisOnline]
	}).addTo(map);

var results = L.layerGroup().addTo(map);

/* Activa la herramienta de crear marcadores */
$('.marker-crowd').on("click", function(e){
	MarkerDrawer.enable();
});

map.on('draw:created', drawMarker);

function drawMarker(e) {
    var marker_position = e.layer.getLatLng();
    var lat = marker_position.lat;
    var lng = marker_position.lng;

    $.ajax({
        type: 'GET',
        url: '{% url "add_layerid_marker" %}',
        data: {'regid': layerid.id, 'lat': lat, 'lng':lng},
        success: function (mark_id) {
            markers.push({'id': mark_id,'lat': lat, 'lng': lng, 'narrative': null});
            marker_narrative.push(e.layer);
            var last_marker = marker_narrative[marker_narrative.length-1];
            var last_info = markers[markers.length-1];

            last_marker.addTo(map);
            marker_id = mark_id;

            last_marker.on('mouseover', function(e) {
                var popup_html = '<label>Editar</label><br><div class="popup-content"><span class="popup-edit">'
                                 + '<i class="fa fa-file-text-o abc" title="Narrativa" aria-hidden="true" data-id="'+mark_id+'"></i></span>'
                                 + '<span class="popup-edit"><i class="fa fa-map-marker" title="Marcador" aria-hidden="true" data-id="'+mark_id+'"></i></span>'
                                 + '<span class="popup-edit"><i class="fa fa-trash" title="Eliminar" aria-hidden="true" data-id="'+ mark_id
                                 + '" data-leafletId="'+ last_marker._leaflet_id +'"></i></span></div>';
                e.target.bindPopup(popup_html).openPopup();
            });

            var frame = $('#cke_1_contents iframe');
            frame[0].contentWindow.document.body.innerHTML = '<p><br></p>';
            $('#marker-narrative-modal').modal('toggle');
        },
        error: function(message) {
            console.log(message);
        }
    });
}

var frm = $('#marker-narrative-form');

frm.submit(function () {
    var nar_title = $("#id_title").val();
    var frame = $('#cke_1_contents iframe');
    var frameContent = frame[0].contentWindow.document.body.innerHTML;

    $.ajax({
        type: 'POST',
        url: '{% url "add_marker_narrative" %}',
        data: {'title': nar_title, 'content': frameContent, 'marker_id': marker_id,
             csrfmiddlewaretoken: '{{ csrf_token }}'
            },
        success: function (data) {
//            $.each(markers, function(i, val) {
//                if (val.id == marker_id) {
//                    val.narrative = frameContent;
//                }
//            });
            $('#marker-narrative-modal').modal('toggle');
            location.reload();
        },
        error: function(message) {
            console.log(message);
        }
    });
    return false;
});

var icon_frm = $('#marker-icon-form');

icon_frm.submit(function () {
    var icon_sel = $('#id_icon').val();
    var icon_color = $('#icon-color').val();
    var icon_shape = $('#icon-shape').val();
    var transparent = false;

    if($('#icon-transparent').is(":checked")) {
        transparent = true;
    }

    $.ajax({
        type: 'POST',
        url: '{% url "change_icon_marker" %}',
        data: {'icon': icon_sel, 'color': icon_color, 'shape': icon_shape, 'marker_id': marker_id,
               'transparent': transparent, csrfmiddlewaretoken: '{{ csrf_token }}'
            },
        success: function (data) {
            /*$.each(markers, function(i, val) {
                if (val.id == marker_id) {

                }
            });*/
            $('#marker-narrative-modal').modal('toggle');
            location.reload();
        },
        error: function(message) {
            console.log(message);
        }
    });
    return false;
});

/* Constructor de boton de seleccion de color */
$("#icon-color").spectrum({
	color: "#000",
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
      //$("#styleSave").show();
    }
});
</script>