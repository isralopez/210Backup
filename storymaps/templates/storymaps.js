<script type="text/javascript">
var progress = setInterval(function () {
    var $bar = $("#bar");
    $bar.width($bar.width() + 700);
  }, 800);

  $(window).load(function() {
    $("#bar").width($(this).width());
    $(".loader").fadeOut(2000);
    $("#map").css('height', $(this).height()-181);
  });
  $( window ).resize(function() {
    $("#map").css('height', $(this).height()-181);
  });
/*Eliminar  footer*/
$('#footer').css('display', 'none');

/*Mostrar Boton compartir storymap*/
$('#share-storymap').css('display', 'block');


var narratives = {{narratives|safe}};
var terrain = L.esri.basemapLayer("DarkGray");
var southWest = L.latLng(-90, -180),
      northEast = L.latLng(90, 180),
      bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
        center: [20, -101],
        zoom: 5,
        animate: true,
        layers: [terrain],
        maxBounds: bounds,
        maxZoom: 12,
        minZoom: 3
      });

var marker = [];
var icons = [];
$.each(narratives, function(i, value) {
            icons[i] = L.icon({
                iconUrl: value.image,
                iconSize:     [50, 50], // size of the icon
                iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
                popupAnchor:  [0, -15] // point from which the popup should open relative to the iconAnchor
            });

            lat_lng = value.coverage.split(',')

            marker[i] = L.marker([lat_lng[0], lat_lng[1]], {icon: icons[i]}).addTo(map);
            marker[i].on('click', function() {
                if(value.ext_url!=null && value.ext_url!=''){
                    PopupCenter(value.ext_url,'','900','720');
                } else {
                    window.location.href = '/storymaps/narratives/'+value.id;
                }
            });
            marker[i].on('mouseover', function(e) {
                e.target.bindPopup(value.title).openPopup();
            });
            marker[i].on('mouseout', function(e) {
                e.target.closePopup();
            });
        });

function PopupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
}
</script>