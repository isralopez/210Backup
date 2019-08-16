/*
 * D3Custom: is a class for set and  manage elements of d3.
 */

class D3Custom {
  constructor(markers) {
  this.markers = markers;
}
/*
 * styleMarker: add styles for geojson (points)
 *return the options
 */
 styleMarker(){
   var geojsonMarkerOptions = {
      radius: 8,
      // fillColor: "#3178B1",
      // color: "#93B9D8",//Blue
      fillColor: '#980D37',
      color: '#FA6491',
      weight: 8,
      opacity: 0.4,
      fillOpacity: 0.6
   };
   return geojsonMarkerOptions;
 }
 /*
  * geojsonFeature: add the latitude and longitude
  * for the points and type point, return a geojson
  */
geojsonFeature(place, type, latlng){
  var geojson = {
         "type": "Feature",
         "properties": {
             "name": place,
             "amenity": type,
             "popupContent": type
         },
         "geometry": {
             "type": "Point",
             "coordinates": latlng
         }
     };
     return geojson;
}
/*
 * removeAllMarkers: remove all points (geojson)
 * to recibe the map element
 */
removeAllMarkers(map){
   map.removeLayer(markers);
   markers = new L.FeatureGroup();
}
/*
 * getMarkers: add points geojson in map element
 * to recibe the map element, and array with data of latitude and longitude
 */
getMarkers(map,goodDataChart){
  if(map.getZoom()>=14){
    for (var i = 0; i < goodDataChart.length; i++) {
      var lat = goodDataChart[i].lat;//get lat
      var lng = goodDataChart[i].lng;//get lng
      var latlng = [lng, lat];
      var place = "<strong>Lugar: </strong> "+goodDataChart[i].place;
      var type = "<strong>Tipo: </strong> "+goodDataChart[i].type;

      var marker = L.geoJson(dc.geojsonFeature(place, type, latlng), {
          pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, dc.styleMarker());
          }
      }).addTo(map);
      marker.bindPopup("<div style='color:#2E2749;'>"+place+" <br>"+type+"</div>");
      markers.addLayer(marker);
    }
    map.addLayer(markers);
  }

}
/*
 * getDateTimeZone: offset the time
 * to recibe a new Date
 * to return a new Date less one day
 */
getDateTimeZone(time){
	return new Date(time.getTime() + time.getTimezoneOffset()*60000);
}
}
