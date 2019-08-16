"use strict";
var bbx_edos = [];
var is_detail = false;
var topogeojsonmun;
var bbx_x = [];
var export_csv = [];
let months_full = {
  1 : 'Enero',
  2 : 'Febrero',
  3 : 'Marzo',
  4 : 'Abril',
  5 : 'Mayo',
  6 : 'Junio',
  7 : 'Julio',
  8 : 'Agosto',
  9 : 'Septiembre',
  10 : 'Octubre',
  11 : 'Noviembre',
  12 : 'Diciembre'
};

let mun_selected = 0;
var bbx_y = [];
let tematizing_mugs = [];
let clases_mugs = [];
var old_layer_mug;
let arr_location_codes = [];
var margin = {
    top: 10,
    right: 15,
    bottom: 10,
    left: 15
};

setBbx();
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
        var delito = "";
        var is_type = false;
        data.forEach(function (r) {
          if(r.source === d){
            is_type = false;
            code_mun = r.code_mun;
         }
         if(r.target === d){
           delito = r.target;
           is_type = true;
        }
       });
        graph.nodes[i] = {
            name: d,
            code_mun: code_mun,
            delito: delito,
            is_type: is_type
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
      return d.source.name + " → " + d.target.name + "\n" + d.value+" denuncias";
    });
    function highlightLink(id, opacity) {
        d3.select("#link-" + id).style("stroke-opacity", opacity);
    }

    function unhighlightLink(id, opacity) {
        d3.select("#link-" + id).style("stroke-opacity", opacity);
    }

    var lastClickedNode = null;
    // function overHigh(innerNode){
    //   if (innerNode.is_type) {
    //     console.log("if");
    //   }else {
    //     console.log("else");
    //   }
    // }
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
      if (innerNode.is_type) {
        getMunByRisk(innerNode.delito);
        d3.selectAll('#sankey-viz > svg').remove();
        doSnake();
      }else {
        cluckMun(innerNode.code_mun);
      }
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
    }).on("click", highlightNodeLinks)
     // .on("mouseout", overHigh);
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

    $('.background-reading-risk').hide(1000);
}

$(document).ready(function () {
  $( "#legend_risk" ).draggable();
  $('.background-reading-risk').show();
  // if (typeof bbx_edos[$('#contactChoice5').val() != 'undefined') {
    map.fitBounds(bbx_edos[$('#contactChoice5').val()]);
  // }
  topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/09.json', null, customLayerBus).addTo(map);
  // getMunByRisk("Robo");
  doSnake();

  $('#radioStacked1').click(function(){
    $('.viz-container2').hide();
    $('.viz-container').show();
  });
  $('#radioStacked2').click(function(){
    $('.viz-container').hide();
    $('.viz-container2').show();
  });

  $('#restart').click(function(){
    $('.background-reading-risk').show();
    d3.selectAll('#sankey-viz > svg').remove();
    doSnake();
    removeTopo();
    var edo = $('#contactChoice5').val();
    topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/'+edo+'.json', null, customLayerBus).addTo(map);
  });
  $('#menu0').on('click', function (e) {
  e.preventDefault();
  $(this).tab('show');
  });
  $('#menu1').on('click', function (e) {
  e.preventDefault();
  $(this).tab('show');
  });
  $('#detail').click(function(){
    var code = $('#contactChoice4').val();
    var edo = $('#contactChoice5').val();
    $('.background-reading-risk').show();
    $('#sankey-container').hide();
    $('#crime').show();
    $('#detail').hide();
    $('#years').hide();
    is_detail = true;
    d3.selectAll('#compare > svg').remove();
    compare_year(code, edo);
    $('#changes_div').show();
  });
  $('#crime').click(function(){
    $('.background-reading-risk').show();
    $('#sankey-container').show();
    $('#changes_div').hide();
    $('#crime').hide();
    $('#detail').show();
    $('#years').show();
    is_detail = false;
    d3.selectAll('#sankey-viz > svg').remove();
    doSnake();
  });
  $('.min-win-risk').click(function(){
    $( "#lbl-legend-risk" ).hide();
    $('.max-win-risk').show();
    $(this).hide();
  });
  $('.max-win-risk').click(function(){
      $( "#lbl-legend-risk" ).show();
      $('.min-win-risk').show();
      $(this).hide();
  });
  $('.download-data-risk').click(function(){
     var edo = $('#contactChoice5').val();
     var site = $('#download-r').attr('site');
     if (edo=="99") {
       return;
     }
     if (typeof site === 'undefined') {
       return;
     }

     //Export geometrty JSON
     exportJSON(site, edo);
     //Export data CSV
     exportTableToCSV();
   });
   $('#download_pdf').click(function(){
     var cve_edo = $('#contactChoice5').val();
     var cve_mun = mun_selected.substring(2,7);
     if (cve_mun==0){
       $('.background-reading-risk').hide();
       return;
     }
      //window.open("http://127.0.0.1:8000/apps/fuero_comun/getPDF/?location_code="+cve_mun+"","_blank");
    window.open("http://idegeo.centrogeo.org.mx/apps/fuero_comun/getPDF/?location_code="+cve_mun+"","_blank");
   });
});
function downloadCSV(csv, title) {
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = title;
  hiddenElement.click();
}
function exportJSON(site, edo){
  var file_path = site+'uploaded/apps/edos_json/'+edo+'.json';
  var a = document.createElement('A');
  a.href = file_path;
  a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function exportTableToCSV() {
    var name_edo = $('#contactChoice5').find(":selected").text();

  var csv = 'Delitos del, Fuero Común, Secretariado, Ejecutivo del, Sistema Nacional, de Seguridad Pública\
      \nEstado:, '+name_edo+' \n Clv_edo,Location code \
    , Municipio, Bien legal, Tipo de robo, Subtipo\
    , Modalidad, Tipo, Total de denuncias, Año\n';
   export_csv.forEach(function(row) {
           csv += row.join(',');
           csv += "\n";
   });
   downloadCSV(csv, 'denuncias.csv');
}
function ChangeType(){
  var typ = $('#typess').val();
  $('.background-reading-risk').show();

  var year = $('#contactChoice3').val();
  var code = $('#contactChoice4').val();
  var edo = mun_selected;
  if (edo==0){
    $('.background-reading-risk').hide();
    return;
  }
  var query_data = {
     'year': year[0],
     'code': code,
     'edo': edo,
     'type':typ
   }
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getYearsByType" %}',
  type: 'POST',
  success : function(data) {
    console.log(data);
    drawing(data);
    $('.background-reading-risk').hide();

  },
  error : function(message) {
          console.log(message);
       }
  });
}
function compare_year(codex, edox){
  var query_data = {
     'code': codex,
     'edo': edox
   }
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "compareDates" %}',
  type: 'POST',
  success : function(datas) {
    var titles = ["Delito", "total 2015", "total 2016", "total 2017", "total 2018"];
    var obj = datas.sort();
    obj.unshift(titles);
    google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawAxisTickColors);

function drawAxisTickColors() {
  var data = new google.visualization.DataTable();
      var data = google.visualization.arrayToDataTable(obj);
      var options = {
        title: 'Denuncias 2015-2018, '+$('#contactChoice5').find(":selected").text()+' , '+$('#contactChoice4').find(":selected").text(),
        chartArea: {width: '50%'},
        height: 700,
        hAxis: {
          title: 'Denuncia de delitos',
          minValue: 0,
          textStyle: {
            bold: true,
            fontSize: 12,
            color: '#4d4d4d'
          },
          titleTextStyle: {
            bold: true,
            fontSize: 18,
            color: '#4d4d4d'
          }
        },
        vAxis: {
          title: 'Tipo de delito',
          textStyle: {
            fontSize: 14,
            bold: true,
            color: '#848484'
          },
          titleTextStyle: {
            fontSize: 14,
            bold: true,
            color: '#848484'
          }
        }
      };
      var chart = new google.visualization.BarChart(document.getElementById('changes_div'));
      chart.draw(data, options);
    }
    $('.background-reading-risk').hide(1000);

  },
  error : function(message) {
          console.log(message);
       }
  });

}
function ChangeYear() {
  if (!is_detail) {
    d3.selectAll('#sankey-viz > svg').remove();
    doSnake();
    removeTopo();
    var edo = $('#contactChoice5').val();
    topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/'+edo+'.json', null, customLayerBus).addTo(map);
  }
}

function ChangeCode() {
  var code = $('#contactChoice4').val();
  var edo = $('#contactChoice5').val();
  if (!is_detail) {
    $('.background-reading-risk').show();
    d3.selectAll('#sankey-viz > svg').remove();
    doSnake();
    removeTopo();
    var edo = $('#contactChoice5').val();
    topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/'+edo+'.json', null, customLayerBus).addTo(map);
  }else {
    $('.background-reading-risk').show();
    d3.selectAll('#compare > svg').remove();
    compare_year(code, edo);
  }
}
function removeTopo(){
  $('.legend-r').hide();
  topogeojsonmun.eachLayer(function (layer) {
        layer.remove();
  });
}
//"BOX(-102.874176584546 21.6222664845356,-101.835289447401 22.4595896830525)"
function ChangeEdo() {
  var code = $('#contactChoice4').val();
  var edo = $('#contactChoice5').val();
  var code = $('#contactChoice4').val();
  var edo = $('#contactChoice5').val();
  if (!is_detail) {
    $('.background-reading-risk').show();
    map.fitBounds(bbx_edos[$('#contactChoice5').val()]);
    // resetFillAll();
    removeTopo();
    topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/'+edo+'.json', null, customLayerBus).addTo(map);
    d3.selectAll('#sankey-viz > svg').remove();
    doSnake();
  }else {
    $('.background-reading-risk').show();
    d3.selectAll('#compare > svg').remove();
    compare_year(code, edo);
  }
}

function doSnake() {
  var year = $('#contactChoice3').val();
  var code = $('#contactChoice4').val();
  var edo = $('#contactChoice5').val();
  d3.json("{% url 'import_json_mug' %}?year="+year+"&edo="+edo+"&code="+code, function (error1, data) {
      makeSankey(data);
  });
}

/** Mapa **/
var southWest = L.latLng(10, -100),
      northEast = L.latLng(20, -90),
      bounds = L.latLngBounds(southWest, northEast);

var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> <a href="https://centrogeo.org.mx/">CentroGeo</a>'
  });
var gray = L.esri.basemapLayer("Gray");

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
 	        // weight: 2,
 	        // opacity: 1,
 	        // color: '#D41EB6',
 	        // fillColor: '#D41EB6',
 	        // fillOpacity: 0,
 	        // dashArray: '3',
        color: '#D41EB6',
        fillColor: '#D41EB6',
        weight: 1.0,
        opacity: 0.3,
        fillOpacity: 0
 		    };
}

function resetHighlightBusiness(e) {
  // console.log(e.target);
    // e.target.layer.setStyle({weight: 0.5});
    topogeojsonmun.setStyle({weight: 0.5});
}

function zoomToFeatureBusiness(e) {
  map.fitBounds(e.target.getBounds());
  d3.selectAll('#sankey-viz > svg').remove();
  var year = $('#contactChoice3').val();
  var code = $('#contactChoice4').val();
  var edo = $('#contactChoice5').val();
  var location_code = e.target.feature.properties.CVE_ENT + e.target.feature.properties.CVE_MUN +"";
  d3.json("{% url 'risk_mun_json_mug' %}?year="+year+"&edo="+edo+"&code="+code+"&location_code="+location_code, function (error1, data) {
    if (data.length!=0) {
      makeSankey(data);
    }else {
      alert("No hay datos para este municipio");
    }
  });
}
//el bueno
function onEachFeatureBusiness(feature, layer) {
    layers_mun.push(layer);//onclick="graMun(this.id)"
  layer.bindPopup('<div><strong>Municipio: </strong>'+utf8Decode2(feature.properties.NOM_MUN)+'</div><div><strong>Historico: </strong><i class="fa fa-area-chart" onclick="drawLineChart(this.id)" id="id'+feature.properties.Cve_EntMun+'" title="Total de robos por municipio" aria-hidden="true"></i></div><div><strong>Reporte: </strong><i class="fa fa-file-pdf-o" onclick="report_view(this.id)" id="id'+feature.properties.Cve_EntMun+'" title="Ver Reporte" aria-hidden="true" style="cursor: pointer;"></i></div>');
    layer.on({
        mouseover: highlightFeatureBusiness,
        mouseout: resetHighlightBusiness,
        click: zoomToFeatureBusiness
    });
}
// var pt = omnivore.topojson('{{STATIC_URL}}ms/23/data/acapulco/ocupados/centrosmercado.json');
// function style(geometry) {
//   return {
//     fillColor: '#e31a1c',
//     weight: 1,
//     opacity: 1,
//     color: 'white',
//     dashArray: '3',
//     fillOpacity: 1
// };
// }
// pt.setStyle(style);
// pt.addTo(map);


function getMunByRisk(delito){
  $('.background-reading-risk').show();

  var year = $('#contactChoice3').val();
  var code = $('#contactChoice4').val();
  var edo = $('#contactChoice5').val();
  if (edo=="99"){
    $('.background-reading-risk').hide();
    return;
  }
  var query_data = {
     'year': year[0],
     'code': code,
     'edo': edo,
     'type':delito
   }
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getTematizerMugs" %}',
  type: 'POST',
  success : function(data) {
    export_csv = data[2];
    // fillMun(data[i][0]);
    tematizing_mugs = data[0];
    clases_mugs = data[1];
    // for (var i = 0; i < tematizing_mugs.length; i++) {
    //   resetFillMun(tematizing_mugs[i]);
    // }
    // for (var i = 0; i < tematizing_mugs.length; i++) {
    //   fillMun(tematizing_mugs[i]);
    // }
    var edo = $('#contactChoice5').val();
    $('.background-reading-risk').hide();
    for (i = 0; i < tematizing_mugs.length; i++) {
        topogeojsonmun = omnivore.topojson('{{MEDIA_URL}}apps/edos_json/'+edo+'.json', null, customLayerMugs).addTo(map);
    }

    $( "#lbl-legend-risk" ).html(getLeyendMapRisk(999,delito));

  },
  error : function(message) {
          console.log(message);
       }
  });

}
function highLightMgLbl(id){
	setFillColorLblMug("#F5F507", id);
}
function getLeyendMapRisk(id_lay, title){
  // id_lay, title
	var classe0 = Math.round(clases_mugs[0] * 100) / 100;
	var classe1 = Math.round(clases_mugs[1] * 100) / 100;
	var classe2 = Math.round(clases_mugs[2] * 100) / 100;
	var classe3 = Math.round(clases_mugs[3] * 100) / 100;

	var classe00 = classe0+"-"+classe1;
	var classe11 = classe1+"-"+classe2;
	var classe22 = classe2+"-"+classe3;
	var classe33 = classe3+"+";

  $('.legend-r').show();
  $('#window-legend').show();
  $('.min-win-risk').show();
  $('.titles-leg').html(""+title);

  var legend_map = '<table width="50%;" id="legend-colors-mug">\
    <tr>\
    <td class="legend-color-mug legend-color-mug-4" id="4" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);"></td><td class="lbl-data">No Data</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug legend-color-mug-0" id="0" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);"></td><td class="lbl-data">'+classe00+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug legend-color-mug-1" id="1" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);"></td><td class="lbl-data">'+classe11+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug legend-color-mug-2" id="2" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);"></td><td class="lbl-data">'+classe22+'</td>\
    </tr>\
    <tr>\
    <td class="legend-color-mug legend-color-mug-3" id="3" onmouseover="highLightMgLbl(this.id)" onmouseout="clearHighlightBus(this.id);"></td><td class="lbl-data">'+classe33+'</td>\
    </tr></table>';
    return legend_map;
}

function setFillColorLblMug(color_select, id){
	var arr_data = tematizing_mugs;
    var values = 0;
    topogeojsonmun.eachLayer(function (layer) {
	for (var clv in arr_data) {
    	if(layer.feature.properties.Cve_EntMun==arr_data[clv][2]){
    		values = arr_data[clv][1];
    		if(id==0){
    			if(values<=clases_mugs[1]&&values>0){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}else if(id==1){

    			if(values>clases_mugs[1]&&values<clases_mugs[2]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}

    		}else if(id==2){
    			if(values>=clases_mugs[2]&&values<clases_mugs[3]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}else if(id==3){
    			if(values>=clases_mugs[3]){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}else if(id==4){
    			if(values==0){
				    layer.setStyle({fillColor:color_select,dashArray:null});
	    		}
    		}
		}
	}
	});
}

function clearHighlightBus(id){
  // console.log("chale");
  // console.log(id);
	var arr_data = tematizing_mugs;
    var values = 0;
	topogeojsonmun.eachLayer(function (layer) {
	for (var clv in arr_data) {

    	if(layer.feature.properties.Cve_EntMun==arr_data[clv][2]){
    		values = arr_data[clv][1];
        // console.log(layer.feature.properties.Cve_EntMun);
        // console.log("cero");
        // console.log(values);
        // console.log("claesss");
    		if(id==0){
    			if(values>1&&values<clases_mugs[1]){
				    layer.setStyle({fillColor:"#ffffb2",dashArray:null});
	    		}
    		}else if(id==1){
    			if(values>clases_mugs[1]&&values<clases_mugs[2]){
				    layer.setStyle({fillColor:"#fecc5c",dashArray:null});
	    		}

    		}else if(id==2){
    			if(values>=clases_mugs[2]&&values<clases_mugs[3]){
				    layer.setStyle({fillColor:"#fd8d3c",dashArray:null});
	    		}
    		}else if(id==3){
    			if(values>=clases_mugs[3]){
				    layer.setStyle({fillColor:"#e31a1c",dashArray:null});
	    		}
    		}else if(id==4){
          if(values==0){
            // console.log("blanco!!!!");
            // console.log(values);
				    layer.setStyle({fillColor:"#fff",dashArray:null});
	    		}
    		}else {
          // console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
          // console.log(values);
          if(values==null){
				    layer.setStyle({fillColor:"blue",dashArray:null});
	    		}
    		}
		}
	}
	});

}


function cluckMun(code_mun){
  $('.background-reading-risk').show();
    topogeojsonmun.eachLayer(function (layer) {
        if(layer.feature.properties.Cve_EntMun == code_mun) {
            //old_layer_mug.setStyle({fillColor :'#D41EB6'})
            if(typeof old_layer_mug !== "undefined"){
                old_layer_mug.setStyle({fillOpacity: 0})
                old_layer_mug.setStyle({dashArray: '3'})
            }
            old_layer_mug = layer;
            //layer.setStyle({fillColor :'blue'})
            layer.setStyle({fillOpacity: 0.5});
            layer.setStyle({dashArray: ''});
            map.fitBounds(layer.getBounds());
        }
    });
    $('.background-reading-risk').hide();
}
function fillMun(obj){
    topogeojsonmun.eachLayer(function (layer) {
        if(layer.feature.properties.Cve_EntMun == obj[2]) {
            //old_layer_mug.setStyle({fillColor :'#D41EB6'})
            arr_location_codes.push(obj[2]);
            var colo = getColorsM(obj[1]);
            layer.setStyle({fillColor :colo});
            layer.setStyle({color: colo});
            layer.setStyle({fillOpacity: 1});
            layer.setStyle({dashArray: obj[2]});
            map.fitBounds(layer.getBounds());
            // layer.setStyle({dashArray: ''});
        }
    });
}
  function resetFillMun(obj){
      topogeojsonmun.eachLayer(function (layer) {
          for (var i = 0; i < arr_location_codes.length; i++) {
              if(layer.feature.properties.Cve_EntMun == arr_location_codes[i]){
                layer.setStyle({fillOpacity: 0});
              }
          }
      });
  }
  function resetFillAll(){
      topogeojsonmun.eachLayer(function (layer) {
          for (var i = 0; i < arr_location_codes.length; i++) {
                layer.setStyle({fillOpacity: 0});
          }
      });
  }
google.charts.load('current', {'packages':['corechart']});

// function graMun(id){
// google.charts.setOnLoadCallback(drawChart(id.substring(2, 7)));
// }
function drawingArea(years){
  if(years==null) return;
  var arr_months = [];
  var arr_dates = []
  arr_months.push(new Date(years[0], 1), years[1], years[2], years[3]);
  arr_dates.push(arr_months);
  var arr_months = [];
  arr_months.push(new Date(years[0], 2), years[5], years[6], years[7]);
  arr_dates.push(arr_months);
  var arr_months = [];
  arr_months.push(new Date(years[0], 3), years[9], years[10], years[11]);
  arr_dates.push(arr_months);
  var arr_months = [];
  arr_months.push(new Date(years[0], 4), years[13], years[14], years[15]);
  arr_dates.push(arr_months);
  var arr_months = [];
  arr_months.push(new Date(years[0], 5), years[17], years[18], years[19]);
  arr_dates.push(arr_months);
  var arr_months = [];
  arr_months.push(new Date(years[0], 6), years[21], years[22], years[23]);
  arr_dates.push(arr_months);
  var arr_months = [];
  arr_months.push(new Date(years[0], 7), years[25], years[26], years[27]);
  arr_dates.push(arr_months);
  var arr_months = [];
  arr_months.push(new Date(years[0], 8), years[29], years[30], years[31]);
  arr_dates.push(arr_months);
  var arr_months = [];
  arr_months.push(new Date(years[0], 9), years[33], years[34], years[35]);
  arr_dates.push(arr_months);
  var arr_months = [];
  arr_months.push(new Date(years[0], 10), years[37], years[38], years[39]);
  arr_dates.push(arr_months);
  var arr_months = [];
  arr_months.push(new Date(years[0], 11), years[41], years[42], years[43]);
  arr_dates.push(arr_months);
  var arr_months = [];
  arr_months.push(new Date(years[0], 12), years[45], years[46], years[47]);
  arr_dates.push(arr_months);
  google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChartArea);

function drawChartArea() {
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'Fecha');
  data.addColumn('number', 'Max');
  data.addColumn('number', 'Promedio');
  data.addColumn('number', 'Tendencia');

  data.addRows(arr_dates);


  var options = {
    title: 'Datos Abiertos de Incidencia Delictiva',
    hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
     isStacked: 'relative',
     width: 600,
     height: 400,
    // legend: {position: 'top', maxLines: 3},
    vAxis: {
      minValue: 0
    }
  };

  var chart = new google.visualization.AreaChart(document.getElementById('linechart_risk'));
  chart.draw(data, options);
  document.getElementById('line-chart-modal').style.display='block';
}
}


function getTooltipMonth(year, month, total_delitos, type){
  let legend_tool = "";
  legend_tool= year+ "-" +months_full[month]+ "</br>";
  legend_tool= legend_tool+"<hr><table><tr><td><strong>"+type+":</strong></td><td> "+total_delitos+"</td></tr></table>";
  return legend_tool;
}
function getDateMugs(month, year){
  var dats = "";
  dats = months[month]+"-"+year.substring(2,4);
  return dats;
}
function drawing(years){
  // console.log(years);
  var year1 = years[0];
  var year2 = years[1];
  var year3 = years[2];
  var year4 = years[3];
  if(years==null) return;
  var arr_months = [];
  var arr_dates = [];
  if (typeof year1 != 'undefined') {
    arr_months.push(new Date(year1[0], 1), year1[1], getTooltipMonth(year1[0],1,year1[1], "Máximo esperado"), year1[2],getTooltipMonth(year1[0],1,year1[2], "Promedio mensual"), year1[3], getTooltipMonth(year1[0],1,year1[3], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year1[0], 2), year1[5],getTooltipMonth(year1[0],2,year1[5], "Máximo esperado"),  year1[6], getTooltipMonth(year1[0],2,year1[6], "Promedio mensual"), year1[7], getTooltipMonth(year1[0], 2, year1[7], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year1[0], 3), year1[9], getTooltipMonth(year1[0],3,year1[9], "Máximo esperado"), year1[10], getTooltipMonth(year1[0],3,year1[10], "Promedio mensual"), year1[11], getTooltipMonth(year1[0],3,year1[11], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year1[0], 4), year1[13], getTooltipMonth(year1[0],4,year1[13], "Máximo esperado"), year1[14],getTooltipMonth(year1[0],4,year1[14], "Promedio mensual"), year1[15], getTooltipMonth(year1[0],4,year1[15], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year1[0], 5), year1[17], getTooltipMonth(year1[0],5,year1[17], "Máximo esperado"), year1[18],getTooltipMonth(year1[0],5,year1[18], "Promedio mensual"), year1[19], getTooltipMonth(year1[0],5,year1[19], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year1[0], 6), year1[21], getTooltipMonth(year1[0],6,year1[21], "Máximo esperado"), year1[22],getTooltipMonth(year1[0],6,year1[22], "Promedio mensual"), year1[23], getTooltipMonth(year1[0],6,year1[23], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year1[0], 7), year1[25], getTooltipMonth(year1[0],7,year1[25], "Máximo esperado"), year1[26],getTooltipMonth(year1[0],7,year1[26], "Promedio mensual"), year1[27], getTooltipMonth(year1[0],7,year1[27], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year1[0], 8), year1[29], getTooltipMonth(year1[0],8,year1[29], "Máximo esperado"), year1[30],getTooltipMonth(year1[0],8,year1[30], "Promedio mensual"), year1[31], getTooltipMonth(year1[0],8,year1[31], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year1[0], 9), year1[33], getTooltipMonth(year1[0],9,year1[23], "Máximo esperado"), year1[34],getTooltipMonth(year1[0],9,year1[34], "Promedio mensual"), year1[35], getTooltipMonth(year1[0],9,year1[35], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year1[0], 10), year1[37], getTooltipMonth(year1[0],10,year1[37], "Máximo esperado"), year1[38],getTooltipMonth(year1[0],10,year1[38], "Promedio mensual"), year1[39], getTooltipMonth(year1[0],10,year1[39], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year1[0], 11), year1[41], getTooltipMonth(year1[0],11,year1[41], "Máximo esperado"), year1[42],getTooltipMonth(year1[0],11,year1[42], "Promedio mensual"), year1[43], getTooltipMonth(year1[0],11,year1[43], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year1[0], 12), year1[45], getTooltipMonth(year1[0],12,year1[45], "Máximo esperado"), year1[46],getTooltipMonth(year1[0],12,year1[46], "Promedio mensual"), year1[47], getTooltipMonth(year1[0],12,year1[47], "Delitos Reportados"));
    arr_dates.push(arr_months);
  }
  /*2016*/
  if (typeof year2 != 'undefined') {
    var arr_months = [];
    arr_months.push(new Date(year2[0], 1), year2[1], getTooltipMonth(year2[0],1,year2[1], "Máximo esperado"), year2[2],getTooltipMonth(year2[0],1,year2[2], "Promedio mensual"), year2[3], getTooltipMonth(year2[0],1,year2[3], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year2[0], 2), year2[5],getTooltipMonth(year2[0],2,year2[5], "Máximo esperado"),  year2[6], getTooltipMonth(year2[0],2,year2[6], "Promedio mensual"), year2[7], getTooltipMonth(year2[0], 2, year2[7], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year2[0], 3), year2[9], getTooltipMonth(year2[0],3,year2[9], "Máximo esperado"), year2[10], getTooltipMonth(year2[0],3,year2[10], "Promedio mensual"), year2[11], getTooltipMonth(year2[0],3,year2[11], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year2[0], 4), year2[13], getTooltipMonth(year2[0],4,year2[13], "Máximo esperado"), year2[14],getTooltipMonth(year2[0],4,year2[14], "Promedio mensual"), year2[15], getTooltipMonth(year2[0],4,year2[15], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year2[0], 5), year2[17], getTooltipMonth(year2[0],5,year2[17], "Máximo esperado"), year2[18],getTooltipMonth(year2[0],5,year2[18], "Promedio mensual"), year2[19], getTooltipMonth(year2[0],5,year2[19], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year2[0], 6), year2[21], getTooltipMonth(year2[0],6,year2[21], "Máximo esperado"), year2[22],getTooltipMonth(year2[0],6,year2[22], "Promedio mensual"), year2[23], getTooltipMonth(year2[0],6,year2[23], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year2[0], 7), year2[25], getTooltipMonth(year2[0],7,year2[25], "Máximo esperado"), year2[26],getTooltipMonth(year2[0],7,year2[26], "Promedio mensual"), year2[27], getTooltipMonth(year2[0],7,year2[27], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year2[0], 8), year2[29], getTooltipMonth(year2[0],8,year2[29], "Máximo esperado"), year2[30],getTooltipMonth(year2[0],8,year2[30], "Promedio mensual"), year2[31], getTooltipMonth(year2[0],8,year2[31], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year2[0], 9), year2[33], getTooltipMonth(year2[0],9,year2[23], "Máximo esperado"), year2[34],getTooltipMonth(year2[0],9,year2[34], "Promedio mensual"), year2[35], getTooltipMonth(year2[0],9,year2[35], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year2[0], 10), year2[37], getTooltipMonth(year2[0],10,year2[37], "Máximo esperado"), year2[38],getTooltipMonth(year2[0],10,year2[38], "Promedio mensual"), year2[39], getTooltipMonth(year2[0],10,year2[39], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year2[0], 11), year2[41], getTooltipMonth(year2[0],11,year2[41], "Máximo esperado"), year2[42],getTooltipMonth(year2[0],11,year2[42], "Promedio mensual"), year2[43], getTooltipMonth(year2[0],11,year2[43], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year2[0], 12), year2[45], getTooltipMonth(year2[0],12,year2[45], "Máximo esperado"), year2[46],getTooltipMonth(year2[0],12,year2[46], "Promedio mensual"), year2[47], getTooltipMonth(year2[0],12,year2[47], "Delitos Reportados"));
    arr_dates.push(arr_months);
  }
  /*2017*/

  if (typeof year3 != 'undefined') {
    var arr_months = [];
    arr_months.push(new Date(year3[0], 1), year3[1], getTooltipMonth(year3[0],1,year3[1], "Máximo esperado"), year3[2],getTooltipMonth(year3[0],1,year3[2], "Promedio mensual"), year3[3], getTooltipMonth(year3[0],1,year3[3], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year3[0], 2), year3[5],getTooltipMonth(year3[0],2,year3[5], "Máximo esperado"),  year3[6], getTooltipMonth(year3[0],2,year3[6], "Promedio mensual"), year3[7], getTooltipMonth(year3[0], 2, year3[7], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year3[0], 3), year3[9], getTooltipMonth(year3[0],3,year3[9], "Máximo esperado"), year3[10], getTooltipMonth(year3[0],3,year3[10], "Promedio mensual"), year3[11], getTooltipMonth(year3[0],3,year3[11], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year3[0], 4), year3[13], getTooltipMonth(year3[0],4,year3[13], "Máximo esperado"), year3[14],getTooltipMonth(year3[0],4,year3[14], "Promedio mensual"), year3[15], getTooltipMonth(year3[0],4,year3[15], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year3[0], 5), year3[17], getTooltipMonth(year3[0],5,year3[17], "Máximo esperado"), year3[18],getTooltipMonth(year3[0],5,year3[18], "Promedio mensual"), year3[19], getTooltipMonth(year3[0],5,year3[19], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year3[0], 6), year3[21], getTooltipMonth(year3[0],6,year3[21], "Máximo esperado"), year3[22],getTooltipMonth(year3[0],6,year3[22], "Promedio mensual"), year3[23], getTooltipMonth(year3[0],6,year3[23], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year3[0], 7), year3[25], getTooltipMonth(year3[0],7,year3[25], "Máximo esperado"), year3[26],getTooltipMonth(year3[0],7,year3[26], "Promedio mensual"), year3[27], getTooltipMonth(year3[0],7,year3[27], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year3[0], 8), year3[29], getTooltipMonth(year3[0],8,year3[29], "Máximo esperado"), year3[30],getTooltipMonth(year3[0],8,year3[30], "Promedio mensual"), year3[31], getTooltipMonth(year3[0],8,year3[31], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year3[0], 9), year3[33], getTooltipMonth(year3[0],9,year3[23], "Máximo esperado"), year3[34],getTooltipMonth(year3[0],9,year3[34], "Promedio mensual"), year3[35], getTooltipMonth(year3[0],9,year3[35], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year3[0], 10), year3[37], getTooltipMonth(year3[0],10,year3[37], "Máximo esperado"), year3[38],getTooltipMonth(year3[0],10,year3[38], "Promedio mensual"), year3[39], getTooltipMonth(year3[0],10,year3[39], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year3[0], 11), year3[41], getTooltipMonth(year3[0],11,year3[41], "Máximo esperado"), year3[42],getTooltipMonth(year3[0],11,year3[42], "Promedio mensual"), year3[43], getTooltipMonth(year3[0],11,year3[43], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year3[0], 12), year3[45], getTooltipMonth(year3[0],12,year3[45], "Máximo esperado"), year3[46],getTooltipMonth(year3[0],12,year3[46], "Promedio mensual"), year3[47], getTooltipMonth(year3[0],12,year3[47], "Delitos Reportados"));
    arr_dates.push(arr_months);
  }
  /*2018*/
  if (typeof year4 != 'undefined') {
    var arr_months = [];
    arr_months.push(new Date(year4[0], 1), year4[1], getTooltipMonth(year4[0],1,year4[1], "Máximo esperado"), year4[2],getTooltipMonth(year4[0],1,year4[2], "Promedio mensual"), year4[3], getTooltipMonth(year4[0],1,year4[3], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year4[0], 2), year4[5],getTooltipMonth(year4[0],2,year4[5], "Máximo esperado"),  year4[6], getTooltipMonth(year4[0],2,year4[6], "Promedio mensual"), year4[7], getTooltipMonth(year4[0], 2, year4[7], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year4[0], 3), year4[9], getTooltipMonth(year4[0],3,year4[9], "Máximo esperado"), year4[10], getTooltipMonth(year4[0],3,year4[10], "Promedio mensual"), year4[11], getTooltipMonth(year4[0],3,year4[11], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year4[0], 4), year4[13], getTooltipMonth(year4[0],4,year4[13], "Máximo esperado"), year4[14],getTooltipMonth(year4[0],4,year4[14], "Promedio mensual"), year4[15], getTooltipMonth(year4[0],4,year4[15], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year4[0], 5), year4[17], getTooltipMonth(year4[0],5,year4[17], "Máximo esperado"), year4[18],getTooltipMonth(year4[0],5,year4[18], "Promedio mensual"), year4[19], getTooltipMonth(year4[0],5,year4[19], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year4[0], 6), year4[21], getTooltipMonth(year4[0],6,year4[21], "Máximo esperado"), year4[22],getTooltipMonth(year4[0],6,year4[22], "Promedio mensual"), year4[23], getTooltipMonth(year4[0],6,year4[23], "Delitos Reportados"));
    arr_dates.push(arr_months);
    var arr_months = [];
    arr_months.push(new Date(year4[0], 7), year4[25], getTooltipMonth(year4[0],7,year4[25], "Máximo esperado"), year4[26],getTooltipMonth(year4[0],7,year4[26], "Promedio mensual"), year4[27], getTooltipMonth(year4[0],7,year4[27], "Delitos Reportados"));
    arr_dates.push(arr_months);
  }
  google.charts.load('current', {'packages':['line']});
  google.charts.setOnLoadCallback(drawChartLine);

      function drawChartLine() {

        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Año');
        data.addColumn('number', 'Máximo');
        data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
        data.addColumn('number', 'Promedio');
        data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
        data.addColumn('number', 'Delitos');
        data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
        //
        data.addRows(arr_dates);
     //    data.addColumn('string', 'year');
     // data.addColumn('number', 'Dogs');
     // data.addColumn({type: 'string', role: 'tooltip'});
     // data.addColumn('number', 'Cats');
     // data.addColumn({type: 'string', role: 'tooltip'});
     //
     // data.addRows([
     //       ['2015', 1, '1 ', 2, ' 2'],
     //       ['2016', 2, '2 ', 4, ' 4']
     // ]);

        var options_line = {
          chart: {
            // title: 'Tipos de delitos',
            subtitle: 'Datos Abiertos de Incidencia Delictiva',
            width: '100%'
          },
          hAxis: {title: 'Año',  titleTextStyle: {color: '#333'}},
          colors: ['#e31a1c', '#3690c0','#5fce33','#fee090'],
          // legend: {position: 'top', maxLines: 20},
          is3D: true,
          // Use an HTML tooltip.
          tooltip: { isHtml: true },
          width: 600,
          height: 400
        };
        // var options2 = {
        //          tooltip: {isHtml: true},
        //          legend: 'none'
        //        };
         var chart = new google.visualization.LineChart(document.getElementById('linechart_risk'));
         chart.draw(data, options_line);
          document.getElementById('line-chart-modal').style.display='block';
      }

}
function report_view(id){
  mun_selected = id;
  var cve_edo = $('#contactChoice5').val();
  var cve_mun = mun_selected.substring(2,7);
  if (cve_mun==0){
    $('.background-reading-risk').hide();
    return;
  }
   //window.open("http://127.0.0.1:8000/apps/fuero_comun/getPDF/?location_code="+cve_mun+"","_blank");
  window.open("http://idegeo.centrogeo.org.mx/apps/fuero_comun/getPDF/?location_code="+cve_mun+"","_blank");
}
function drawLineChart(id){
  mun_selected = id;
  var year = $('#contactChoice3').val();
  var code = $('#contactChoice4').val();
  var query_data = {
     'year': year[0],
     'code': code,
     'location_code': id
   }
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "getAverageMinMax" %}',
  type: 'POST',
  success : function(data) {
    if (data==null)return;
    let typess = data[0];
    let years = data[1];
    if (typess!=null){
      $('#typess option').remove();
      for (var i = 0; i < typess.length; i++) {
          $('#typess')
          .append($('<option>', { value : typess[i] })
          .text(typess[i]));
      }
    }
   drawing(years);

  },
  error : function(message) {
          console.log(message);
       }
  });


}

function drawChart(code) {
    var jsonData = $.ajax({
      url: "{% url 'import_export_json_mug' %}?code="+code,
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
            $('#AreaChartModal .modal-body-title').html(utf8Decode(layer.feature.properties.NOM_MUN));
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
/*START tematizing_mugs BY MUGS*/

/*Hover Features*/
function highlightFeatureBusiness(e) {
    var layer = e.target;
    layer.setStyle({weight: 2});
}

function getColorsM(values) {
		return values > clases_mugs[3]   ? '#e31a1c' :
			values > clases_mugs[2]   ? '#fd8d3c' :
			values > clases_mugs[1]   ? '#fecc5c' :
			values > clases_mugs[0]   ? '#ffffb2' :
			values > -1 ? '#fff' :
					 '#fff';
}
function getColorMugs(values) {
    if (values>=clases_mugs[3]) {
       return '#e31a1c';
    }else if (values>=clases_mugs[2]&&values<clases_mugs[3]) {
      return '#fd8d3c';
    }else if (values>clases_mugs[1]&&values<clases_mugs[2]) {
      return '#fecc5c';
    }else if (values<=clases_mugs[1]&&values>0) {
      return '#ffffb2';
    }else if (values==0) {
      return '#fff';
    }else {
      return 'blue';
    }
		// return values > clases_mugs[3]   ? '#e31a1c' :
		// 	values > clases_mugs[2]   ? '#fd8d3c' :
		// 	values > clases_mugs[1]   ? '#fecc5c' :
		// 	values > clases_mugs[0]   ? '#ffffb2' :
		// 	values > -1 ? '#fff' :
		// 			 '#fff';
}
/*Hover Features*/
function styleMugs(feature) {
  var values = getValuesMugs(feature.properties.Cve_EntMun);
  return {
 	        weight: 1,
 	        opacity: 1,
 	        color: '#525252',
 	        fillColor: getColorMugs(values),
 	        fillOpacity: 0.8
 		    };
}
var customLayerMugs = L.geoJson(null, {
    style: styleMugs,
    onEachFeature: onEachFeatureBusiness
});
function getValuesMugs(location_code){
    var values = 0;
    for (var clv in tematizing_mugs) {
    	if(location_code==tematizing_mugs[clv][2]){
			    values = tematizing_mugs[clv][1];
		  }
    }
    return values;
}

function onEachFeatureMugs(feature, layer) {
  // layer.bindPopup("<div><strong>Municipio:</strong> "+feature.properties.NOM_MUN+"</div><div><strong>Código postal:</strong> "+feature.properties.Cve_EntMun+"</div>");
    // layer.on({
    //     mouseover: highlightFeatureMugs,
    //     mouseout: resetHighlightMugs,
    //     click: zoomToFeatureMugs
    // });
}
function resetHighlightMugs(e) {
    topogeojsonmun.resetStyle(e.target);
}
function zoomToFeatureMugs(e) {
  // console.log(e.target.feature.properties);
  $('.mun-wage').html("Municipio: "+utf8Decode(e.target.feature.properties.NOM_MUN));
  business(e.target.feature.properties);
}
/*Hover Features*/
function highlightFeatureMugs(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        dashArray: '',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
// function remove_selection_purple() {
//     $.each(map._layers, function (ml) {
//         if (map._layers[ml].options.fillColor) {
//           if (map._layers[ml].options.fillColor=="#D41EB6") {
//             if (map._layers[ml].options.dashArray) {
//               // $('.tagQBus').removeClass('tag-selected');
//               map._layers[ml].setStyle({fillColor :map._layers[ml].options.dashArray});
//             }
//           }
//         }
//     })
// }
/*END tematizing BY MUGS*/
function setBbx(){
  bbx_x = [21.6222664845356, -102.874176584546];
  bbx_y = [22.4595896830525, -101.835289447401];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["01"] = bbx;
  bbx_x = [27.9999999848061, -118.407649550879];
  bbx_y = [32.7186535752625, -112.654240299838];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["02"] = bbx;
  bbx_x = [22.8719540537057, -115.223764337377];
  bbx_y = [28.0000017041175, -109.413172978395];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["03"] = bbx;
  bbx_x = [17.8128711717366, -92.4687900217799];
  bbx_y = [20.84832728853, -89.1212291974072];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["04"] = bbx;
  bbx_x = [24.5426840653016, -103.96000192005];
  bbx_y = [29.8800242896194, -99.8431198067627];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["05"] = bbx;
  bbx_x = [18.3325939998872, -114.759455288635];
  bbx_y = [19.5125187714414, -103.486346451659];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["06"] = bbx;
  bbx_x = [14.5320983619492, -94.139155996379];
  bbx_y = [17.9852877980833, -90.3702137216039];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["07"] = bbx;
  bbx_x = [25.5588436166759, -109.074886167958];
  bbx_y = [31.7844862894973, -103.306768792693];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["08"] = bbx;
  bbx_x = [19.0482366638106, -99.3649242039483];
  bbx_y = [19.5927572799653, -98.9403028113257];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["09"] = bbx;
  bbx_x = [22.345083713078, -107.210132227248];
  bbx_y = [26.8448759117676, -102.472696981309];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["10"] = bbx;
  bbx_x = [19.9127501813221, -102.097032277151];
  bbx_y = [21.8394167186182, -99.6713026147652];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["11"] = bbx;
  bbx_x = [16.3159525831697, -102.184351179715];
  bbx_y = [18.8878467894171, -98.0072763938042];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["12"] = bbx;
  bbx_x = [19.5977581116736, -99.8595414365727];
  bbx_y = [21.3985207679097, -97.9849289109412];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["13"] = bbx;
  bbx_x = [18.9258718700513, -105.695403467336];
  bbx_y = [22.7502459395598, -101.51054174982];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["14"] = bbx;
  bbx_x = [18.3669428770738, -100.613091003664];
  bbx_y = [20.2858666666518, -98.5968666556226];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["15"] = bbx;
  bbx_x = [17.9149078601021, -103.738127072141];
  bbx_y = [20.3945563459586, -100.063032821642];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["16"] = bbx;
  bbx_x = [18.3323730775454, -99.4944141480939];
  bbx_y = [19.1317017270646, -98.632946651467];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["17"] = bbx;
  bbx_x = [20.6032209478144, -106.687726781448];
  bbx_y = [23.0845033392953, -103.720895546169];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["18"] = bbx;
  bbx_x = [23.1626831854073, -101.206762710012];
  bbx_y = [27.7991371864429, -98.4215760780924];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["19"] = bbx;
  bbx_x = [15.6571685974108, -98.5527073335255];
  bbx_y = [18.6696880653534, -93.8674267718396];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["20"] = bbx;
  bbx_x = [17.8609119303356, -99.0704942745153];
  bbx_y = [20.8399597469255, -96.7246830344269];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["21"] = bbx;
  bbx_x = [20.0150182872879, -100.59653571445];
  bbx_y = [21.6700054263226, -99.0430798533174];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["22"] = bbx;
  bbx_x = [17.8939855540657, -89.2965618140633];
  bbx_y = [21.6055041328782, -86.7104052700568];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["23"] = bbx;
  bbx_x = [21.1601538293591, -102.296038410036];
  bbx_y = [24.4915218276091, -98.3259670492722];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["24"] = bbx;
  bbx_x = [22.4671337656533, -109.447692603181];
  bbx_y = [27.0423059887849, -105.392220002523];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["25"] = bbx;
  bbx_x = [26.2969879325374, -115.053022327618];
  bbx_y = [32.4939131619264, -108.42427083532];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["26"] = bbx;
  bbx_x = [17.250893331235, -94.130025163867];
  bbx_y = [18.6509649531714, -90.9874591997836];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["27"] = bbx;
  bbx_x = [22.206965827776, -100.144950219012];
  bbx_y = [27.6791262156323, -97.1442236040225];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["28"] = bbx;
  bbx_x = [19.10507186002, -98.7083985865751];
  bbx_y = [19.7289174323247, -97.6254391011];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["29"] = bbx;
  bbx_x = [17.1369649102096, -98.6815466037805];
  bbx_y = [22.4717509147403, -93.6079398089036];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["30"] = bbx;
  bbx_x = [19.5511740956119, -92.3263000017498];
  bbx_y = [22.6137999994325, -87.5331452806868];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["31"] = bbx;
  bbx_x = [21.0418694024331, -104.353533038625];
  bbx_y = [25.1252355069575, -100.742324287397];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["32"] = bbx;
  bbx_x = [14.5320983619492, -118.407649550879];
  bbx_y = [32.7186535752625, -86.7104052700568];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["99"] = bbx;
}

/**
 * Decodes utf-8 encoded string back into multi-byte Unicode characters.
 */
function utf8Decode2(utf8String) {
  // console.log("va");
  // console.log(utf8String);
    if (typeof utf8String != 'string') throw new TypeError('parameter ‘utf8String’ is not a string');
    // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
    const unicodeString = utf8String.replace(
        /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
        function(c) {  // (note parentheses for precedence)
            var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
            return String.fromCharCode(cc); }
    ).replace(
        /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
        function(c) {  // (note parentheses for precedence)
            var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
            return String.fromCharCode(cc); }
    );
    return unicodeString;
}
