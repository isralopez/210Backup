 var topo_mex; 
     var topo_edo_mun;
     var topo_edo_con;
     function setFillColorSelected(color_select, location_code){
        topo_edo_mun.eachLayer(function (layer) {
        if(layer.feature.properties.STATE_FIPS==location_code){
                layer.setStyle({color:color_select,dashArray:null, weight: 5});
            }
    });
    }
    function ressetColors(){
        topo_edo_mun.eachLayer(function (layer) {
            layer.setStyle({color:"#525252",fillOpacity: 0.8, dashArray:null, opacity: 1, weight: 1});
    });
    }
    $(document).ready(function () {
        var windowSize = $(window).width();
        if (windowSize <= 1140) {
            $("#info3").show( "slow" );
        }
        var map;
        var $map = $('#map');
        var resize = function () {
            $map.height($(window).height() - $('div.navbar').outerHeight());

            if (map) {
                map.invalidateSize();
            }
        };

          function getColor(d) {
                return d == 'Terciario' ? '#E6E6E6' :
                       d == 'Primario'  ? '#2E2E2E' :
                       d == 'Secundario'  ? '#A4A4A4' :
                                  '#FFEDA0';
            }
            function styleEdo(feature) {
              return {
                      weight: 1,
                      opacity: 1,
                      color: '#525252',
                      fillOpacity: 0.8
                    };
            }
            function styleEu(feature) {
              return {
                      weight: 0.2,
                      opacity: 1,
                      color: '#e8dddd',
                      fillOpacity: 0.2
                    };
            }

            function resetHighlightBusiness(e) {
                topo_mex.setStyle({weight: 0.5});
            }
            function resetHighlightCondado(e){
                topo_edo_con.setStyle({weight: 0.2})
            }
            function highlightFeatureCondado(e) {
                var layer = e.target;
                layer.setStyle({weight: 1});
            }
            /*Hover Features*/
            function highlightFeatureBusiness(e) {
                var layer = e.target;
                layer.setStyle({weight: 2});
            }


            function zoomToFeatureBusiness(e) {
              map.fitBounds(e.target.getBounds());
            }

            function onEachFeatureCondado(feature, layer) {
                layer.bindPopup('<div><strong>Condado: </strong>'+feature.properties.NAME+'</div>');
                  layer.on({
                      mouseover: highlightFeatureCondado,
                      mouseout: resetHighlightCondado,
                      click: zoomToFeatureBusiness
                  });
              }
            function onEachFeatureBusiness(feature, layer) {
                  layer.on({
                      mouseover: highlightFeatureBusiness,
                      mouseout: resetHighlightBusiness,
                      click: zoomToFeatureBusiness
                  });
              }
               function onEachFeatureEU(feature, layer) {
                layer.bindPopup('<div><strong>Estado: </strong>'+feature.properties.STATE_NAME+'</div>');
                  layer.on({
                      mouseover: highlightFeatureBusiness,
                      mouseout: resetHighlightBusiness,
                      click: zoomToFeatureBusiness
                  });
              }

        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };

        var region = getUrlParameter('region');
        var tipo = getUrlParameter('tipo');
        var activos = getUrlParameter('activos');
        var url = window.location.search.split('&activos')[0];
        $("#atractores").attr('href', url+'&activos=atractores');
        $("#expulsores").attr('href', url+'&activos=expulsores');
        var activosColor;
        if(activos==null){
            activos = 'atractores';
        }
        if(activos=='atractores'){
            $("#atractores").attr('class', 'active');
            activosColor='#9400D3';
        }
        if(activos=='expulsores'){
            $("#expulsores").attr('class', 'active');
            activosColor='#FF4500';
        }

        $(window).on('resize', function () {
            resize();
        });

        resize();

        var southWest = L.latLng(12, -85),
            northEast = L.latLng(34, -120),
            bounds = L.latLngBounds(southWest, northEast);

        map = L.map('map').setView([37.8, -96], 4);
        //, { center: [22, -105], zoom: 4, minZoom: 4, maxZoom: 12, maxBounds: bounds });

        // Add the Stamen toner tiles as a base layer
        var baseLayer = new L.StamenTileLayer('toner-background', {
            detectRetina: true
        }).addTo(map);

        // Add a layer control
        var layerControl = L.control.layers().addTo(map);

        // Create a lookup of airports by code.  NOTE:  this is easy, but non-optimal, particularly with a large dataset
        // Ideally, the lookup would have already been created on the server or created and imported directly
        $.getScript('{{ STATIC_URL }}idegeo/apps/farming/data/centrosImmigrate.js', function( data, textStatus, jqxhr ) {
          var airportsLookup = L.GeometryUtils.arrayToMap(centros, 'code');

            // Sort flight data in descending order by the number of flights.  This will ensure that thicker lines get displayed
            // below thinner lines
          $.getScript('{{ STATIC_URL }}idegeo/apps/farming/data/orgDesEUImmmigrate.js', function( data, textStatus, jqxhr ) {
            origendest = origendest.filter(function (el) {
              return el.tipo === activos;
            });

            origendest = _.sortBy(origendest, function (value) {
                return -1 * value.cantidad;
            });

            // Group flight data by airline code
            var airlineLookup = _.groupBy(origendest, function (value) {
                return value.airline;
            });

            var maxCountAll = Number(origendest[0].cantidad);

            // Get the top count of flights
            origendest = _.filter(origendest, function (value) {
                return value.airline !== 'all';
            });

            var maxCount = Number(origendest[0].cantidad);

            var count = 0;

            // Get an airport location.  This function looks up an airport from a provided airport code
            var getLocation = function (context, locationField, fieldValues, callback) {
                var key = fieldValues[0];
                var airport = airportsLookup[key];
                var location;

                if (airport) {
                    var latlng = new L.LatLng(Number(airport.lat), Number(airport.lon));

                    location = {
                        location: latlng,
                        text: key,
                        center: latlng
                    };
                }

                return location;
            };

            var sizeFunction = new L.LinearFunction([1, 16], [253, 48]);

          
            var customLayerMex = L.geoJson(null, {
                style: styleEdo,
                onEachFeature: onEachFeatureBusiness
            });

            var customLayerEdo = L.geoJson(null, {
                style: styleEdo,
                onEachFeature: onEachFeatureEU
            });

             
            var customLayerEu = L.geoJson(null, {
                style: styleEu,
                onEachFeature: onEachFeatureCondado
            });
            var customLayer = L.geoJson(null, {
                // http://leafletjs.com/reference.html#geojson-style
                style: function(feature) {
                    return { opacity: 1,
                        weight: 2,
                        color: '#3B170B',
                        fillOpacity: 0 };
                }
            });
            var customLayer2 = L.geoJson(null, {
                // http://leafletjs.com/reference.html#geojson-style
                style: function(feature) {
                    return { fillColor: getColor(feature.properties.Tipo),
                        weight: 0,
                        opacity: 1,
                        color: '#b4ff33',
                        dashArray: '3',
                        fillOpacity: 0.7
                        };
                }
            });

            topo_mex = omnivore.topojson('{{MEDIA_URL}}gov2030/estados_agenda2030.json', null, customLayerMex)
                .addTo(map);

            
            topo_edo_mun = omnivore.topojson('{{ STATIC_URL }}idegeo/apps/farming/data/edos_eu.topojson', null, customLayerEdo)
                .addTo(map);

            topo_edo_con = omnivore.topojson('{{ STATIC_URL }}idegeo/apps/farming/data/condados.topojson', null, customLayerEu)
                .addTo(map);


            var options = {
                recordsField: null,
                locationMode: L.LocationModes.CUSTOM,
                fromField: 'origen',
                toField: 'destino',
                codeField: null,
                getLocation: getLocation,
                getEdge: L.Graph.EDGESTYLE.ARC,
                includeLayer: function (record) {
                    return false;
                },
                getIndexKey: function (location, record) {
                    return record.origen + '_' + record.destino;
                },
                setHighlight: function (style) {
                    style.opacity = 1.0;

                    return style;
                },
                unsetHighlight: function (style) {
                    style.opacity = 0.5;

                    return style;
                },
                layerOptions: {
                    fill: false,
                    opacity: 0.5,
                    weight: 0.5,
                    fillOpacity: 1.0,
                    distanceToHeight: new L.LinearFunction([0, 20], [1000, 300]),
                    markers: {
                        end: true
                    },

                    // Use Q for quadratic and C for cubic
                    mode: 'Q'
                },
                tooltipOptions: {
                    iconSize: new L.Point(80, 64),
                    iconAnchor: new L.Point(-5, 64),
                    className: 'leaflet-div-icon line-legend'
                },
                displayOptions: {
                    cantidad: {
                        weight: new L.LinearFunction([0, 2], [maxCount, 10]),
                        color: activosColor,
                        displayName: 'Cantidad'
                    }
                },
                onEachRecord: function (layer, record) {
                    /**layer.bindPopup($(L.HTMLUtils.buildTable(record)).wrap('<div/>').parent().html());**/
                }
            };

            var allLayer = new L.Graph(origendest, options);
            map.addLayer(allLayer);

            var airportsLayer = new L.MarkerDataLayer(airportsLookup, {
                recordsField: null,
                locationMode: L.LocationModes.LATLNG,
                latitudeField: 'lat',
                longitudeField: 'lon',
                displayOptions: {
                    'centromercado': {////direct_flights
                        color: new L.HSLHueFunction([0, 200], [253, 330], {
                            outputLuminosity: '60%'
                        })
                    },
                    'code': {
                        title: function (value) {
                            return value;
                        }
                    }
                },
                layerOptions: {
                    fill: false,
                    stroke: true,
                    weight: 0,
                    color: '#FF4500'
                },
                setIcon: function (record, options) {
                     var html = '';
                    var centromercado = L.Util.getFieldValue(record, 'centromercado');////direct_flights
                    if(centromercado == 1){
                        html = '<div><i style="color: #f7b1bd !important;" class="fa fa-circle"></i><span class="code">' + record.name + '</span></div>';
                    }else if(centromercado == 0){/**FFC0CB**/
                         html = '<div><i style="color: #9a0c0c !important;" class="fa fa-circle"></i><span class="code">' + record.name + '</span></div>';
                    }else if(centromercado == 2){/**FF1493**/
                         html = '<div><i style="color: #f18c44 !important;" class="fa fa-circle"></i><span class="code">' + record.name + '</span></div>';
                    } else if(centromercado == 3){/**FF1493**/
                         html = '<div><i style="color: rgba(51,182,255,0) !important; border-radius:250px !important; background: linear-gradient(to bottom, #dd1c77, #c994c7) !important;"class="fa fa-circle"></i><span class="code">' 
                         + record.name + '</span></div>';
                    }                                 /**D2691E**/

                    var $html = $(html);
                    var $i = $html.find('i');

                    L.StyleConverter.applySVGStyle($i.get(0), options);

                    var size = sizeFunction.evaluate(centromercado*190);
                    if(centromercado == 0){
                        size = 25;
                    }else{
                        size = 30;
                    }


                    $i.width(size);
                    $i.height(size);
                    $i.css('font-size', size + 'px');
                    $i.css('line-height', size + 'px');

                    var $code = $html.find('.code');

                    $code.width(size);
                    $code.height(size);
                    $code.css('line-height', size-5 + 'px');
                    $code.css('font-size', size / 3 + 'px');
                    $code.css('margin-top', -size / 3 + 'px');

                    var icon = new L.DivIcon({
                        iconSize: new L.Point(size, size),
                        iconAnchor: new L.Point(size / 2, size / 2),
                        className: 'airport-icon',
                        html: $html.wrap('<div/>').parent().html()
                    });

                    return icon;
                },
                onEachRecord: function (layer, record) {
                    layer.on('click', function () {
                        ressetColors()      
                        allLayer.options.includeLayer = function (newRecord) {
                             if (newRecord.origen === record.code) {
                                if (newRecord.origen.length==5) {
                                     setFillColorSelected("#ecaae9",newRecord.destino.substring(0,2))
                                }else{
                                    setFillColorSelected("red",newRecord.destino.substring(0,2))
                                }
                             }
                           /** return (newRecord.origen === record.code && activos==='expulsores') || (newRecord.destino === record.code && activos==='atractores');**/
                           return (newRecord.origen === record.code);
                        };
                        allLayer.reloadData();
                    });
                }
            });
            map.addLayer(airportsLayer);
            layerControl.addOverlay(airportsLayer, 'Centros');

            });
        });
        if (windowSize <= 1140) {
            $(".leaflet-control-layers").hide( "slow" );
            map.scrollWheelZoom.disable();
        }
    });
    $( ".fa-external-link" ).click(function() {
        window.open(window.location.href, '_blank');
      });