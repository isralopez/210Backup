"use strict";
var old_layer;
var margin = {
    top: 10,
    right: 15,
    bottom: 10,
    left: 15
};
var width = 739 - margin.left - margin.right;
var height = 608 - margin.top - margin.bottom;

var formatNumber = d3.format("$,.0f"); // zero decimal places
var format = function format(d) {
    return formatNumber(d);
};


d3.sankey = function () {
    var sankey = {};
    var nodeWidth = 30;
    var nodePadding = 8;
    var size = [1, 1];
    var nodes = [];
    var links = [];

    sankey.nodeWidth = function sNodeWidth(nArg) {
        if (nArg == null) {
            return nodeWidth;
        }
        nodeWidth = +nArg;
        return sankey;
    };

    sankey.nodePadding = function sNodePadding(nArg) {
        if (nArg == null) {
            return nodePadding;
        }
        nodePadding = +nArg;
        return sankey;
    };

    sankey.nodes = function sNodes(nArg) {
        if (nArg == null) {
            return nodes;
        }
        nodes = nArg;
        return sankey;
    };

    sankey.links = function sLinks(nArg) {
        if (nArg == null) {
            return links;
        }
        links = nArg;
        return sankey;
    };

    sankey.size = function sSize(nArg) {
        if (nArg == null) {
            return size;
        }
        size = nArg;
        return sankey;
    };

    sankey.link = function () {
        var curvature = 0.5;

        function link(d) {
            var x0 = d.source.x + d.source.dx;
            var x1 = d.target.x;
            var xi = d3.interpolateNumber(x0, x1);
            var x2 = xi(curvature);
            var x3 = xi(1 - curvature);
            var y0 = d.source.y + d.sy + d.dy / 2;
            var y1 = d.target.y + d.ty + d.dy / 2;
            return "M" + x0 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x1 + "," + y1;
        }

        link.curvature = function (nArg) {
            if (nArg == null) {
                return curvature;
            }
            curvature = +nArg;
            return link;
        };

        return link;
    };

    function center(node) {
        return node.y + node.dy / 2;
    }

    function value(link) {
        return link.value;
    }

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
        nodes.forEach(function (node) {
            node.sourceLinks = [];
            node.targetLinks = [];
        });
        links.forEach(function (link) {
            var source = link.source;
            var target = link.target;
            if (typeof source === "number") {
                link.source = nodes[link.source];
                source = link.source;
            }
            if (typeof target === "number") {
                link.target = nodes[link.target];
                target = link.target;
            }
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
        });
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
        nodes.forEach(function (node) {
            node.value = Math.max(d3.sum(node.sourceLinks, value), d3.sum(node.targetLinks, value));
        });
    }

    function moveSinksRight(x) {
        nodes.forEach(function (node) {
            if (!node.sourceLinks.length) {
                node.x = x - 1;
            }
        });
    }

    function scaleNodeBreadths(kx) {
        nodes.forEach(function (node) {
            node.x *= kx;
        });
    }

    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
        var remainingNodes = nodes;
        var nextNodes = undefined;
        var x = 0;

        var breadthFunc = function breadthFunc(node) {
            node.x = x;
            node.dx = nodeWidth;
            node.sourceLinks.forEach(function (link) {
                nextNodes.push(link.target);
            });
        };

        while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(breadthFunc);
            remainingNodes = nextNodes;
            x += 1;
        }

        moveSinksRight(x);
        scaleNodeBreadths((width - nodeWidth) / (x - 1));
    }

    function computeNodeDepths(iterations) {
        var nodesByBreadth = d3.nest().key(function (d) {
            return d.x;
        }).sortKeys(d3.ascending).entries(nodes).map(function (d) {
            return d.values;
        });

        function relaxLeftToRight(alpha) {
            function weightedSource(link) {
                return center(link.source) * link.value;
            }

            nodesByBreadth.forEach(function (innerNodes) {
                innerNodes.forEach(function (node) {
                    if (node.targetLinks.length) {
                        var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                        node.y += (y - center(node)) * alpha;
                    }
                });
            });
        }

        function relaxRightToLeft(alpha) {
            function weightedTarget(link) {
                return center(link.target) * link.value;
            }

            nodesByBreadth.slice().reverse().forEach(function (innerNodes) {
                innerNodes.forEach(function (node) {
                    if (node.sourceLinks.length) {
                        var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                        node.y += (y - center(node)) * alpha;
                    }
                });
            });
        }

        function resolveCollisions() {
            nodesByBreadth.forEach(function (innerNodes) {
                var node = undefined;
                var dy = undefined;
                var y0 = 0;
                var n = innerNodes.length;
                var i = undefined;

                // Push any overlapping nodes down.
                /* nodes.sort(ascendingDepth);*/
                for (i = 0; i < n; ++i) {
                    node = innerNodes[i];
                    dy = y0 - node.y;
                    if (dy > 0) node.y += dy;
                    y0 = node.y + node.dy + nodePadding;
                }

                // If the bottommost node goes outside the bounds, push it back up.
                dy = y0 - nodePadding - size[1];
                if (dy > 0) {
                    node.y -= dy;
                    y0 = node.y;

                    // Push any overlapping nodes back up.
                    for (i = n - 2; i >= 0; --i) {
                        node = innerNodes[i];
                        dy = node.y + node.dy + nodePadding - y0;
                        if (dy > 0) node.y -= dy;
                        y0 = node.y;
                    }
                }
            });
        }

        function initializeNodeDepth() {
            var ky = d3.min(nodesByBreadth, function (innerNodes) {
                return (size[1] - (innerNodes.length - 1) * nodePadding) / d3.sum(innerNodes, value);
            });

            nodesByBreadth.forEach(function (innerNodes) {
                innerNodes.forEach(function (node, i) {
                    node.y = i;
                    node.dy = node.value * ky;
                });
            });

            links.forEach(function (link) {
                link.dy = link.value * ky;
            });
        }

        initializeNodeDepth();
        resolveCollisions();
        for (var alpha = 1; iterations > 0; --iterations) {
            relaxRightToLeft(alpha *= 0.99);
            resolveCollisions();
            relaxLeftToRight(alpha);
            resolveCollisions();
        }
    }

    function computeLinkDepths() {
        function ascendingSourceDepth(a, b) {
            return a.source.y - b.source.y;
        }

        function ascendingTargetDepth(a, b) {
            return a.target.y - b.target.y;
        }

        nodes.forEach(function (node) {
            node.sourceLinks.sort(ascendingTargetDepth);
            node.targetLinks.sort(ascendingSourceDepth);
        });
        nodes.forEach(function (node) {
            var sy = 0;
            var ty = 0;
            node.sourceLinks.forEach(function (link) {
                link.sy = sy;
                sy += link.dy;
            });
            node.targetLinks.forEach(function (link) {
                link.ty = ty;
                ty += link.dy;
            });
        });
    }

    sankey.layout = function (iterations) {
        computeNodeLinks();
        computeNodeValues();
        computeNodeBreadths();
        computeNodeDepths(iterations);
        computeLinkDepths();
        return sankey;
    };

    sankey.relayout = function () {
        computeLinkDepths();
        return sankey;
    };

    return sankey;
};

function makeSankey(data) {
    // append the svg canvas to the page
    var svg = d3.select("#sankey-viz").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).attr('viewBox', "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom)).attr("class", "sankey-viz-svg").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set the sankey diagram properties
    var sankey = d3.sankey().nodeWidth(25).nodePadding(8).size([width, height]);

    var path = sankey.link();

    var legend = d3.select("#sankey-table");

    // set up graph in same style as original example but empty
    var graph = {
        nodes: [],
        links: []
    };

    data.forEach(function (d) {
        graph.nodes.push({
            name: d.source
        });
        graph.nodes.push({
            name: d.target
        });
        graph.links.push({
            source: d.source,
            target: d.target,
            value: +d.value
        });
    });

    // return only the distinct / unique nodes
    graph.nodes = d3.keys(d3.nest().key(function (d) {
        return d.name;
    }).map(graph.nodes));
    graph.nodes.sort(function (x, y) {
        return d3.ascending(x.value, y.value);
    });

    // loop through each link replacing the text with its index from node
    graph.links.forEach(function (d, i) {
        graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
        graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
    });

    // now loop through each nodes to make nodes an array of objects rather than an array of strings
    graph.nodes.forEach(function (d, i) {
        var code_mun;
        data.forEach(function (r) { if(r.source === d){ code_mun = r.code_mun }});
        graph.nodes[i] = {
            name: d,
            code_mun: code_mun
        };
    });

    sankey.nodes(graph.nodes).links(graph.links).layout(200);

    // add in the links
    var link = svg.append("g").selectAll(".link").data(graph.links).enter().append("path").attr("class", "link").attr("d", path).attr("id", function (d, i) {
        d.id = i;
        return "link-" + i;
    }).style("stroke-width", function (d) {
        return Math.max(1, d.dy);
    }).sort(function (a, b) {
        return b.dy - a.dy;
    });

    link.append("title").text(function (d) {
        var ExpImp = $('input[name="ExpImp"]:checked').val();
        if (ExpImp === 'imp') {
            return d.source.name + " ← " + d.target.name + "\n" + format(d.value);
        } else if (ExpImp === 'exp') {
            return d.source.name + " → " + d.target.name + "\n" + format(d.value);
        }
    });

    function highlightLink(id, opacity) {
        d3.select("#link-" + id).style("stroke-opacity", opacity);
    }

    function unhighlightLink(id, opacity) {
        d3.select("#link-" + id).style("stroke-opacity", opacity);
    }

    var lastClickedNode = null;

    function removeHighlight(node, savedThis) {
        var remainingNodes = [];
        var nextNodes = [];

        if (savedThis == null) {
            return;
        }

        var strokeOpacity = 0;
        if (d3.select(savedThis).attr("data-clicked") === "1") {
            d3.select(savedThis).attr("data-clicked", "0");
            strokeOpacity = 0.1;
        } else {
            d3.select(savedThis).attr("data-clicked", "1");
            strokeOpacity = 0.3;
        }

        var traverse = [{
            linkType: "sourceLinks",
            nodeType: "target"
        }, {
            linkType: "targetLinks",
            nodeType: "source"
        }];

        traverse.forEach(function (step) {
            node[step.linkType].forEach(function (nodeLink) {
                remainingNodes.push(nodeLink[step.nodeType]);
                unhighlightLink(nodeLink.id, strokeOpacity);
            });

            var traverseFunc = function traverseFunc(innerNode) {
                innerNode[step.linkType].forEach(function (nodeLink) {
                    nextNodes.push(nodeLink[step.nodeType]);
                    unhighlightLink(nodeLink.id, strokeOpacity);
                });
            };

            while (remainingNodes.length) {
                nextNodes = [];
                remainingNodes.forEach(traverseFunc);
                remainingNodes = nextNodes;
            }
        });
    }

    function dragmove(d) {
        d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
        sankey.relayout();
        link.attr("d", path);
    }

    var savedThis = null;

    function highlightNodeLinks(innerNode) {
        cluckMun(innerNode.code_mun);
        if (lastClickedNode != null) {
            removeHighlight(lastClickedNode, savedThis);
        }

        lastClickedNode = innerNode;
        savedThis = this;

        var remainingNodes = [];
        var nextNodes = [];


        var strokeOpacity = 0;
        if (d3.select(this).attr("data-clicked") === "1") {
            d3.select(this).attr("data-clicked", "0");
            strokeOpacity = 0.1;
        } else {
            d3.select(this).attr("data-clicked", "1");
            strokeOpacity = 0.3;
        }


        var traverse = [{
            linkType: "sourceLinks",
            nodeType: "target"
        }, {
            linkType: "targetLinks",
            nodeType: "source"
        }];

        traverse.forEach(function (step) {
            innerNode[step.linkType].forEach(function (nodeLink) {
                remainingNodes.push(nodeLink[step.nodeType]);
                highlightLink(nodeLink.id, strokeOpacity);
            });

            var traverseFunc = function traverseFunc(remainingNode) {
                remainingNode[step.linkType].forEach(function (nodeLink) {
                    nextNodes.push(nodeLink[step.nodeType]);
                    highlightLink(nodeLink.id, strokeOpacity);
                });
            };

            while (remainingNodes.length) {
                nextNodes = [];
                remainingNodes.forEach(traverseFunc);
                remainingNodes = nextNodes;
            }
        });
    }

    var node = svg.append("g").selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node")
    .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    }).on("click", highlightNodeLinks);
    // .on("mouseout", removeHighlight)
    /* .call(d3.behavior.drag()
        .origin((d) => d)
        .on("drag", dragmove)); */

    node.append("rect").attr("height", function (d) {
        return d.dy;
    }).attr("width", sankey.nodeWidth()).style("fill", function (d) {
        return '#'+ ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
    });

    node.append("text").attr("x", -6).attr("y", function (d) {
        return d.dy / 3;
    }).attr("dy", ".35em").attr("text-anchor", "end").attr("transform", null).text(function (d) {
        return d.name;
    }).filter(function (d) {
        return d.x < width / 2;
    }).attr("x", 6 + sankey.nodeWidth()).attr("text-anchor", "start");

    $('.background-reading').toggle(1000);
}

function RadioSankeyImp() {
    $('.background-reading').show();
    var year = $('#contactChoice3').val();
    var edo = $('#contactChoice5').val();
    d3.json("{% url 'import_products' %}?year="+year+"&edo="+edo, function (error2, prod) {
        SelectProd(prod);
        var code = $('#contactChoice4').val();
        d3.json("{% url 'import_json' %}?year="+year+"&edo="+edo+"&code="+code, function (error1, data) {
            makeSankey(data);
        });
    });
}

function RadioSankeyExp() {
    $('.background-reading').show();
    var year = $('#contactChoice3').val();
    var edo = $('#contactChoice5').val();
    d3.json("{% url 'export_products' %}?year="+year+"&edo="+edo, function (error2, prod) {
        SelectProd(prod);
        var code = $('#contactChoice4').val();
        d3.json("{% url 'export_json' %}?year="+year+"&edo="+edo+"&code="+code, function (error1, data) {
            makeSankey(data);
        });
    });
}

RadioSankeyExp();

$(document).ready(function () {
    $("input[type='radio']").change(function () {
        var ExpImp = $('input[name="ExpImp"]:checked').val();
        d3.selectAll('#sankey-viz > svg').remove();
        if (ExpImp === 'imp') {
            RadioSankeyImp();
        } else if (ExpImp === 'exp') {
            RadioSankeyExp();
        }
    });
});

function ChangeYear() {
    var ExpImp = $('input[name="ExpImp"]:checked').val();
    d3.selectAll('#sankey-viz > svg').remove();
    if (ExpImp === 'imp') {
        RadioSankeyImp();
    } else if (ExpImp === 'exp') {
        RadioSankeyExp();
    }
}

function ChangeCode() {
    var ExpImp = $('input[name="ExpImp"]:checked').val();
    d3.selectAll('#sankey-viz > svg').remove();
    if (ExpImp === 'imp') {
        RadioSankeyImp();
    } else if (ExpImp === 'exp') {
        RadioSankeyExp();
    }
}

function ChangeEdo() {
    var ExpImp = $('input[name="ExpImp"]:checked').val();
    d3.selectAll('#sankey-viz > svg').remove();
    if (ExpImp === 'imp') {
        RadioSankeyImp();
    } else if (ExpImp === 'exp') {
        RadioSankeyExp();
    }
}

function SelectProd(prod) {
    var code = $('#contactChoice4').val();
    $('#contactChoice4').html('');
    $.each( prod, function( key, value ) {
        let selected = '';
        if(code==value.value) {
            selected = "selected";
        }
        $('#contactChoice4').append('<option value="'+value.value+'" '+selected+'>'+value.name.substring(0, 70)+'</option>');
    });
}


/** Mapa **/

var southWest = L.latLng(10, -100),
      northEast = L.latLng(20, -90),
      bounds = L.latLngBounds(southWest, northEast);

var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> <a href="https://centrogeo.org.mx/">CentroGeo</a>'
  });
var gray = L.esri.basemapLayer("DarkGray");

var map = L.map('map', {
        center: [24.26, -101],
        zoom: 5,
        animate: true,
        layers: [gray],
        //maxBounds: bounds,
        maxZoom: 10,
        minZoom: 5
      });

/** Capa Mun **/

var layers_mun = [];

var customLayerBus = L.geoJson(null, {
    style: styleBus,
    onEachFeature: onEachFeatureBusiness
});

function styleBus(feature) {
  return {
 	        weight: 0.5,
 	        opacity: 1,
 	        color: '#D41EB6',
 	        fillColor: '#D41EB6',
 	        fillOpacity: 0,
 	        dashArray: '3',
 		    };
}

function resetHighlightBusiness(e) {
    topogeojsonmun.resetStyle(e.target);

}

function highlightFeatureBusiness(e) {


    var layer = e.target;
    layer.setStyle({
        weight: 1,
        dashArray: '',
        fillOpacity: 0.5
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function zoomToFeatureBusiness(e) {
  //console.log(e.target.feature.properties);
  map.fitBounds(e.target.getBounds());
}

function onEachFeatureBusiness(feature, layer) {
    layers_mun.push(layer);
  layer.bindPopup('<div><strong>Municipio: </strong>'+feature.properties.NOM_MUN+'</div><div><strong>Exportaciones e importaciones: </strong><i class="fa fa-area-chart" id="id'+feature.properties.Cve_EntMun+'" onclick="graMun(this.id)" title="Exportaciones e importaciones" aria-hidden="true"></i></div>');
    layer.on({
        mouseover: highlightFeatureBusiness,
        mouseout: resetHighlightBusiness,
        click: zoomToFeatureBusiness
    });
}


var topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/mun_2012.json', null, customLayerBus).addTo(map);

function cluckMun(code_mun){
    topogeojsonmun.eachLayer(function (layer) {
        if(layer.feature.properties.Cve_EntMun == code_mun) {
            //old_layer.setStyle({fillColor :'#D41EB6'})
            if(typeof old_layer !== "undefined"){
                old_layer.setStyle({fillOpacity: 0})
                old_layer.setStyle({dashArray: '3'})
            }
            old_layer = layer;
            //layer.setStyle({fillColor :'blue'})
            layer.setStyle({fillOpacity: 0.5});
            layer.setStyle({dashArray: ''});
            map.fitBounds(layer.getBounds());
        }
    });
}


google.charts.load('current', {'packages':['corechart']});

function graMun(id){
google.charts.setOnLoadCallback(drawChart(id.substring(2, 7)));
}

function drawChart(code) {
    var jsonData = $.ajax({
      url: "{% url 'import_export_json' %}?code="+code,
      dataType: "json",
      async: false
      }).responseText;
    // Create our data table out of JSON data loaded from server.
    var data = new google.visualization.DataTable(jsonData);

    var options = {
      title: 'Exportaciones e importaciones totales del municipio, expresado en millones de dolares (USD)',
      hAxis: {title: 'Año',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0},
      colors:['#216DD4','#17FF9D'],
      width: 650,
      height: 250
    };

    topogeojsonmun.eachLayer(function (layer) {
        if(layer.feature.properties.Cve_EntMun == code) {
            $('#AreaChartModal .modal-body-title').html(layer.feature.properties.NOM_MUN);
        }
    });
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);
    document.getElementById('AreaChartModal').style.display='block';
}


/* SHARE */
$(".share-viz-button").mouseenter(function() {
    $("#sharePopup").show();
    setTimeout(function() {
        $("#sharePopup").hide();
    }, 6000);
});