<script type="text/javascript">
var NASAGIBS_ViirsEarthAtNight2012 = L.tileLayer('http://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
      attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
      bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
      minZoom: 1,
      maxZoom: 8,
      format: 'jpg',
      time: '',
      tilematrixset: 'GoogleMapsCompatible_Level'
    });
var NASAGIBS_ModisTerraTrueColorCR = L.tileLayer('http://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_CorrectedReflectance_TrueColor/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
      attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
      bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
      minZoom: 1,
      maxZoom: 9,
      format: 'jpg',
      time: '',
      tilematrixset: 'GoogleMapsCompatible_Level'
    });
var OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
});
var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 1,
  maxZoom: 16,
  ext: 'png'
});
var Stamen_TonerBackground = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
});
var Hydda_Full = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
var Stamen_TerrainBackground = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png'
});
var roadMutant = L.gridLayer.googleMutant({
      maxZoom: 24,
      type:'roadmap'
    });
var satMutant = L.gridLayer.googleMutant({
      maxZoom: 24,
      type:'satellite'
    });
var terrainMutant = L.gridLayer.googleMutant({
      maxZoom: 24,
      type:'terrain'
    });
var hybridMutant = L.gridLayer.googleMutant({
      maxZoom: 24,
      type:'hybrid'
    });
var styleMutant = L.gridLayer.googleMutant({
      styles: [
        {elementType: 'labels', stylers: [{visibility: 'off'}]},
        {featureType: 'water', stylers: [{color: '#444444'}]},
        {featureType: 'landscape', stylers: [{color: '#eeeeee'}]},
        {featureType: 'road', stylers: [{visibility: 'off'}]},
        {featureType: 'poi', stylers: [{visibility: 'off'}]},
        {featureType: 'transit', stylers: [{visibility: 'off'}]},
        {featureType: 'administrative', stylers: [{visibility: 'off'}]},
        {featureType: 'administrative.locality', stylers: [{visibility: 'off'}]}
      ],
      maxZoom: 24,
      type:'roadmap'
    });
var trafficMutant = L.gridLayer.googleMutant({
      maxZoom: 24,
      type:'roadmap'
    });
    trafficMutant.addGoogleLayer('TrafficLayer');


var transitMutant = L.gridLayer.googleMutant({
      maxZoom: 24,
      type:'roadmap'
    });
    transitMutant.addGoogleLayer('TransitLayer');

var topographic  = L.esri.basemapLayer("Topographic"),
    streets = L.esri.basemapLayer("Streets"),
    gray = L.esri.basemapLayer("Gray"),
    nationalgeographic = L.esri.basemapLayer("NationalGeographic"),
    oceans = L.esri.basemapLayer("Oceans"),
    shadedrelief = L.esri.basemapLayer("ShadedRelief"),
    imagery = L.esri.basemapLayer("Imagery"),
    year_url = 'http://imagery.arcgisonline.com/arcgis/rest/services/LandsatGLS/GLS2010_Enhanced/ImageServer';

var landsat10_321 = L.esri.imageMapLayer({url: year_url, opacity: 0.6, position: 'bottomright'}).setBandIds('3,2,1');
var landsat10_432 = L.esri.imageMapLayer({url: year_url, opacity: 0.6, position: 'bottomright'}).setBandIds('4,3,2');

var sismo19s = L.tileLayer.wms('http://idegeo.centrogeo.org.mx/geoserver/ows?', {
      layers: 'geonode:sismo19s',
      format: 'image/png',
      maxZoom: 24,
      attribution: '&copy; <a href="https://www.digitalglobe.com/">DigitalGlobe</a>'
    });

var baseLayers = {
      "Open Street Map": OpenStreetMap,
      "Satélite": imagery,
      "Satélite Google": satMutant,
      "Gris": gray,
      "Negro": CartoDB_DarkMatter,
      "Toner Stamen": Stamen_TonerBackground,
      "Modelo Del Terreno Stamen": Stamen_TerrainBackground,
      "Topográfico": topographic,
      "Carreteras": streets,
      "Oceanos": oceans,
      "Relieve": shadedrelief,
      "Stamen_Watercolor": Stamen_Watercolor,
      "Hydda_Full": Hydda_Full,
      "National Geographic": nationalgeographic,
      "NASA GIBS Viirs Earth At Night 2012": NASAGIBS_ViirsEarthAtNight2012,
      "NASA GIBS Modis Terra True Color CR": NASAGIBS_ModisTerraTrueColorCR,
      "LandSat 2010 Falso Color": landsat10_321,
      "LandSat 2010 Color Verdadero": landsat10_432,
      "roadMutant": roadMutant,
      "terrainMutant": terrainMutant,
      "hybridMutant": hybridMutant,
      "styleMutant": styleMutant,
      "Tráfico Google": trafficMutant,
      "transitMutant": transitMutant,
      "Sismo 19s": sismo19s
    };

var basemapsDict = {
      "osm": [OpenStreetMap, 'Open Street Map'],
      "gray": [gray, 'Gris'],
      "topographic": [topographic, 'Topográfico'],
      "streets": [streets,'Carreteras'],
      "oceans": [oceans, 'Oceanos'],
      "shadedRelief": [shadedrelief, 'Relieve'],
      "imagery": [imagery, 'Satélite'],
      "darkMatter": [CartoDB_DarkMatter, 'Negro'],
      "stamenToner": [Stamen_TonerBackground, 'Stamen Toner'],
      "stamenTerrain": [Stamen_TerrainBackground, 'Modelo Del Terreno Stamen'],
      "stamenWatercolor": [Stamen_Watercolor, 'Stamen Watercolor'],
      "natGeo": [nationalgeographic, 'National Geographic'],
      "satMutant": [satMutant, 'Satélite Google'],
      /*
      "Hydda_Full": Hydda_Full,
      "NASA GIBS Viirs Earth At Night 2012": NASAGIBS_ViirsEarthAtNight2012,
      "NASA GIBS Modis Terra True Color CR": NASAGIBS_ModisTerraTrueColorCR,
      "LandSat 2010 Falso Color": landsat10_321,
      "LandSat 2010 Color Verdadero": landsat10_432,
      "roadMutant": roadMutant,
      "terrainMutant": terrainMutant,
      "hybridMutant": hybridMutant,
      "styleMutant": styleMutant,
      "Tráfico Google": trafficMutant,
      "transitMutant": transitMutant,
      */
    };
</script>