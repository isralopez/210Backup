<script type="text/javascript">
/*Control de busqueda google*/
  var GoogleSearch = L.Control.extend({
    onAdd: function() {
      var element = document.createElement("input");

      element.id = "searchBox";

      return element;
    }
  });

  (new GoogleSearch).addTo(map);

  var input = document.getElementById("searchBox");

  var searchBox = new google.maps.places.SearchBox(input);

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    var group = L.featureGroup();

    places.forEach(function(place) {

      var marker = L.marker([
        place.geometry.location.lat(),
        place.geometry.location.lng()
      ]);
      group.addLayer(marker);
    });

    group.addTo(map);
    map.fitBounds(group.getBounds());

  });
</script>