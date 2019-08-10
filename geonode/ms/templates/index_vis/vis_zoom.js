<script>
var vis_color_1 = [d3.interpolateBlues, d3.interpolateGreens, d3.interpolateGreys,d3.interpolateOranges,d3.interpolatePurples,d3.interpolateReds,d3.interpolateBuGn,d3.interpolateBuPu,d3.interpolateGnBu,d3.interpolateOrRd,d3.interpolatePuBuGn,d3.interpolatePuBu,d3.interpolatePuRd,d3.interpolateRdPu,d3.interpolateYlGnBu,d3.interpolateYlGn,d3.interpolateYlOrBr,d3.interpolateYlOrRd];

var regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

var svg = d3.select("svg"),
    margin = 20, //tamaño del circulo
    diameter = +svg.attr("width"),
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

d3.json("{%if config_category%}{% url 'category_json' config.id config_category.id %}{%else%}{% url 'ms_json' config.id %}{%endif%}", function(error, root) {
  if (error) throw error;

  root = d3.hierarchy(root)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

  //tree = d3.hierarchy(root);
  tree = root.sum(function(d) { return d.size; });//Obtiene nivel de anidación
  treelevel= tree.height;

//var color = d3.scaleOrdinal(d3.schemeSet1); //Colores aleatorios
var color = d3.scaleSequential(vis_color_1[{{config.color}}]) //Colores degradados
    .domain([treelevel,0]);

var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

  var focus = root,
      nodes = pack(root).descendants(),
      view;

  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("a")
      .attr("xlink:href", function(d) { return d.data.size === 10000 ? !regexp.test(d.data.url) ? "{{site}}"+d.data.link : d.data.url : "#"; })
      .attr("target", function(d) { return d.data.size === 10000 ? !regexp.test(d.data.url) ? "_self" : "_blank" : "_self"; })
      .append("circle")
      .attr("class", function(d) { return d.data.size === 10000 ? "narrative" : d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .style("fill", function(d) { return d.parent ? d.children ? color(d.depth) : color([treelevel - 0.5]) : "#E5E5E5" ; })
      .style("stroke", function(d) { return d.parent ? d.children ? color(d.depth) : color([treelevel - 1]) : "#444444"; }) //Tono de contorno en Madre-hija: :Exterior
      .style("stroke-width", function(d) { return d.parent ? d.children ? 10 : 1 : 10; }) // Ancho del contorno de circulos: Madre: Hija: Exterior
      .style("stroke-opacity", function(d) { return d.parent ? d.children ? 1 : 0.3 : 0.2 ; })
      .on('mouseover', function(d) { if (focus !== d) tooltip_over(d)})
      .on('mouseout', function(d) { if (focus !== d) tooltip_out(d)})
      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

  var text = g.selectAll("text")
    .data(nodes)
    .enter().append("a")
      .attr("xlink:href", function(d) { return d.data.size === 10000 ? !regexp.test(d.data.url) ? "{{site}}"+d.data.link : d.data.url : "#"; })
      .attr("target", function(d) { return d.data.size === 10000 ? !regexp.test(d.data.url) ? "_self" : "_blank" : "_self"; })
      .append("text")
      .attr("class", "label")
      .style("fill", function(d) { return 1 ? color([0]): color(d.depth); })//Color Label
      .style("fill-opacity", function(d) { return 1; })//d.parent === root ? 1 : 0
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .on('mouseover', function(d) { if (focus !== d) tooltip_over(d)})
      .on('mouseout', function(d) { if (focus !== d) tooltip_out(d)})
      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); })
      .selectAll("tspan")
      .data(function(d) { return splitter(d.data.name,28); })
      .enter().append("tspan")
      .attr("x", 0)
      .attr("y", function(d, i, nodes) { return 16 + (i - nodes.length / 2 - 0.5) * 16; })
      .text(function(d) { return d; });

  var node = g.selectAll("circle,text");

  svg
      .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    if (regexp.test(d.data.url))
         {
           location.reload();
         }
    var focus0 = focus; focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return 1; })//d.parent === focus ? 1 : 0
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function tooltip_over(d) {
    $( "#vis_tooltip" ).hide().html( "<h4 style='margin:0px;'>"+d.data.name+"</h4><p>"+d.data.description+"</p>" ).fadeIn(500);
  }

  function tooltip_out(d) {
    $( "#vis_tooltip" ).hide().html( "" );
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }
  function splitter(str, l){
    var strs = [];
    while(str.length > l){
        var pos = str.substring(0, l).lastIndexOf(' ');
        pos = pos <= 0 ? l : pos;
        strs.push(str.substring(0, pos));
        var i = str.indexOf(' ', pos)+1;
        if(i < pos || i > pos+l)
            i = pos;
        str = str.substring(i);
    }
    strs.push(str);
    return strs;
}
});

</script>
