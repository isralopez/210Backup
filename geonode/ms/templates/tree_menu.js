<script type="text/javascript">


$.getJSON('{% url 'ms_json_admin' ms.id %}', function(data) {

treeData = [data];

  var count = treeData[0].children.length;

   if(count==0){
	    count = 1;
	}

// ************** Generate the tree diagram	 *****************
var margin = {top: 20, right: 160, bottom: 20, left: 160},
	width = 980 - margin.right - margin.left,
	height = (count*210) - margin.top - margin.bottom;

var i = 0,
	duration = 750,
	root;

var tree = d3.layout.tree()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });

var div = d3.select("#tree_menu")
	.append("div")
	.attr("class", "tooltip-menu")
	.style("opacity", 0);

var svg = d3.select("#tree_menu").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
root.x0 = height / 2;
root.y0 = 0;

update(root);

d3.select(self.frameElement).style("height", "500px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  .on("click", click);

  nodeEnter.append("circle")
	  .attr("r", 1e-6)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
	  .on("mouseover", function(d) { tooltip_over(d) });

  nodeEnter.append("text")
	  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
	  .attr("r", 10)
	  .style("fill", function(d) { return d.size === 10000 ? "lightsteelblue" : d.size === 0 ? "#fab62e" : "#fff"; });

  nodeUpdate.select("text")
	  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	  .remove();

  nodeExit.select("circle")
	  .attr("r", 1e-6);

  nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
		var o = {x: source.x0, y: source.y0};
		return diagonal({source: o, target: o});
	  });

  // Transition links to their new position.
  link.transition()
	  .duration(duration)
	  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
		var o = {x: source.x, y: source.y};
		return diagonal({source: o, target: o});
	  })
	  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
	d._children = d.children;
	d.children = null;
  } else {
	d.children = d._children;
	d._children = null;
  }
  update(d);
}
function tooltip_over(d) {
    if(d.size == 60000){
        div.transition()
            .duration(500)
            .style("opacity", 0);
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div	.html(
            '<a href= "../ms_up_cat_to_ms/{{ms.id}}">' +
            '<i class="fa fa-list fa-1x" title="Agregar categoria al micrositio '+ d.name +'" aria-hidden="true"></i>' +
            "</a>" +
            ' <a href= "../upload_nar_to_ms/{{ms.id}}">' +
            '<i class="fa fa-file-text-o fa-1x" title="Agregar narrativa al micrositio '+ d.name +'" aria-hidden="true"></i>' +
            "</a>")
            .style("left", (d3.event.pageX + 30) + "px")
            .style("top", (d3.event.pageY - 18) + "px");
    }else if(d.size >= 20000){
        div.transition()
            .duration(500)
            .style("opacity", 0);
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div	.html(
            '<a href= "../up_cat_to_cat/{{ms.id}}/'+d.data_id+'">' +
            '<i class="fa fa-list fa-1x" title="Agregar categoria a '+ d.name +'" aria-hidden="true"></i>' +
            "</a>" +
            ' <a href= "../upload_nar_to_cat/{{ms.id}}/'+d.data_id+'">' +
            '<i class="fa fa-file-text-o fa-1x" title="Agregar narrativa a '+ d.name +'" aria-hidden="true"></i>' +
            "</a>" +
            ' <a href= "../update_cat_ms/{{ms.id}}/'+d.data_id+'">' +
            '<i class="fa fa-pencil fa-1x"  title="Editar" aria-hidden="true"></i>' +
            "</a>" +
            ' <a href= "../remove_cat/'+d.data_id+'/{{ms.id}}">' +
            '<i class="fa fa-trash fa-1x" title="Eliminar" aria-hidden="true"></i>' +
            "</a>")
            .style("left", (d3.event.pageX +30) + "px")
            .style("top", (d3.event.pageY - 18) + "px");
    }else{
        div.transition()
            .duration(500)
            .style("opacity", 0);
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div	.html(
            '<a href="../ms_update_narrative_meta/'+d.data_id+'/{{ms.id}}">' +
            '<i class="fa fa-bars fa-1x" title="Editar metadato" aria-hidden="true"></i>' +
            "</a>" +
            ' <a href="../ms_update_narrative/'+d.data_id+'/{{ms.id}}">' +
            '<i class="fa fa-pencil fa-1x"  title="Editar narrativa" aria-hidden="true"></i>' +
            "</a>" +
            ' <a href="../{{ms.url_name}}/narrative/'+d.data_id+'" target="_blank">' +
            '<i class="fa fa-external-link"  title="Previsualización" aria-hidden="true"></i>' +
            "</a>" +
            ' <a href= "../remove_nar/'+d.data_id+'/{{ms.id}}">' +
            '<i class="fa fa-trash fa-1x" title="Eliminar" aria-hidden="true"></i>' +
            "</a>")
            .style("left", (d3.event.pageX + 30) + "px")
            .style("top", (d3.event.pageY - 18) + "px");
    }

}

});
</script>