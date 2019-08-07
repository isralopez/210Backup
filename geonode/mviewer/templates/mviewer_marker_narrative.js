<script type="text/javascript">
  var markers;
  var marker_index;
  var markers_narrative;

  function layerid_markers() {
    markers = []
    $.ajax({
        type: 'GET',
        url: '{% url "layerid_markers" %}',
        data: {'regid': regid},
        success: function (markers_info) {
            markers_narrative = markers_info;
            $.each(markers_info, function(i, v) {
                var options = {
                  icon: v.icon,
                  iconSize: [30, 30],
                  iconAnchor: [15,15],
                  innerIconAnchor: [0, 6],
                  innerIconStyle: 'font-size:14px;',
                  borderColor: v.color,
                  textColor: v.color
                };
                if (v.shape != 'circle') {options['iconShape']=v.shape}
                if (v.transparent == 'true') {options['backgroundColor']='transparent'}

                markers[i] = L.marker([v['lat'], v['lng']], {
                  icon: L.BeautifyIcon.icon(options),
                  draggable: true
                }).addTo(map)

                markers[i].on('click', function() {
                    marker_click(v.narrative);
                    marker_index = i;
                });

                markers[i].on('mouseover', function(e) {
                    if (v.title) {
                        var popup_html = '<label style="font-size:12px;">'+ v.title +'</label>';
                    } else {
                        var popup_html = '<label style="font-size:12px;">Clic muestra<br>contenido</label>';
                    }
                    e.target.bindPopup(popup_html).openPopup();
                });
            });
        },
        error: function(message) {
            console.log(message);
        }
    });
  }

  function marker_click (narrative) {
    $('#description-content').hide();
    $('#layer-narrative').hide();
    $('#marker-narrative').empty();
    $('#marker-narrative').append(narrative);
    $('#marker-narrative').show();
    $('#narrative-nav').show();

    if (!$("#sidebar-description").hasClass('active')) {
        $("#sidebar-description").addClass('active');
        $("#sidebar-description").toggle("slide", {direction: "right"});
    }
  }

  function remove_markers () {
    $.each(markers, function(i, v) {
        map.removeLayer(v);
    });
  }

  $('#close-narrative').click(function() {
    if ($('#info-tab-button').hasClass('active')) {
        $('#info-tab-button').removeClass('active');
        $('#info-tab-button').addClass('inactive');
    }
    $("#sidebar-description").toggle("slide", {direction: "right"});
    $("#sidebar-description").removeClass('active');
    $(".fa-file-text").removeClass('eyeon');
    $("#marker-narrative").hide();
    $('#narrative-nav').hide();
  });

  $('#prev-narrative').click(function() {
    if (marker_index==0) {
        marker_index = markers_narrative.length-1;
    } else {
        marker_index = marker_index-1;
    }
    var content = markers_narrative[marker_index].narrative;
    var lat = markers_narrative[marker_index].lat;
    var lng = markers_narrative[marker_index].lng;

    marker_click(content);
    map.panTo([lat, lng]);
  });

  $('#next-narrative').click(function() {
    if (marker_index == markers_narrative.length-1) {
        marker_index = 0;
    } else {
        marker_index = marker_index+1;
    }
    var content = markers_narrative[marker_index].narrative;
    var lat = markers_narrative[marker_index].lat;
    var lng = markers_narrative[marker_index].lng;

    marker_click(content);
    map.panTo([lat, lng]);
  });
</script>