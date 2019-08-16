<script>
let year_compare1 = "2015";
let year_compare2 = "2016";
var code = "0";
var edo = "99";
compare_year(year_compare1, year_compare2, code, edo);

function compare_year(year_compare1x, year_compare2x, codex, edox){
  var query_data = {
     'year1': year_compare1x,
     'year2': year_compare2x,
     'code': codex,
     'edo': edox
   }
   $.ajax({
   data: {'query_data': JSON.stringify(query_data),//JSON.stringify(query_data),
      csrfmiddlewaretoken: '{{ csrf_token }}'
     },
  url: '{% url "compareDates" %}',
  type: 'POST',
  success : function(data) {
    let colors = ["#01665e", "#fb8072", "#FF9900", "#a65628", "#990099", "#8dd3c7",
    "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c",
    "#3366CC", "#decbe4", "#FF9900", "#999999", "#ffff33", "#0099C6",
    "#fdbf6f", "#ff7f00"];
    var svg = d3.select("#compare").append("svg").attr("width", 1560).attr("height", 900);

    svg.append("text").attr("x",350).attr("y",70)
    	.attr("class","header").text("Riesgos "+year_compare1);

    svg.append("text").attr("x",950).attr("y",70)
    	.attr("class","header").text("Riesgos "+year_compare2);

    var g =[svg.append("g").attr("transform","translate(100,100)")
    		,svg.append("g").attr("transform","translate(670,100)")];


    var bp=[ viz.bP()
    		.data(data)
    		.min(12)
    		.pad(1)
    		.height(750)
    		.width(550)
    		.barSize(35)
    		.fill(d=>colors[getColor(d.primary, d)])
    	,viz.bP()
    		.data(data)
    		.value(d=>d[3])
    		.min(12)
    		.pad(1)
    		.height(750)
    		.width(550)
    		.barSize(35)
    		.fill(d=>colors[getColor(d.primary, d)])
    ];

    [0,1].forEach(function(i){
    	g[i].call(bp[i])

    	g[i].append("text").attr("x",80).attr("y",-8).style("text-anchor","middle").text("Municipio");
    	g[i].append("text").attr("x", 450).attr("y",-8).style("text-anchor","middle").text("Tipo");

    	g[i].append("line").attr("x1",150).attr("x2",0);
    	g[i].append("line").attr("x1",550).attr("x2",400);

    	// g[i].append("line").attr("y1",610).attr("y2",610).attr("x1",150).attr("x2",0);
    	// g[i].append("line").attr("y1",610).attr("y2",610).attr("x1",550).attr("x2",400);

    	g[i].selectAll(".mainBars")
    		.on("mouseover",mouseover)
    		.on("mouseout",mouseout);

    	g[i].selectAll(".mainBars").append("text").attr("class","label")
    		.attr("x",d=>(d.part=="primary"? 20: -20))
    		.attr("y",d=>+6)
    		.text(d=>d.key)
//        .attr("text-anchor",d=>(d.part=="primary"? "end": "start"));
    		.attr("text-anchor",d=>(d.part=="secondary"? "end":"start"));

    	g[i].selectAll(".mainBars").append("text").attr("class","perc")
    		.attr("x",d=>(d.part=="primary"? 10: -15))
    		.attr("y",d=>+6)
    		.text(function(d){ return d3.format("0.0%")(d.percent)})
    		.attr("text-anchor",d=>(d.part=="primary"? "end": "start"));
    });

    function mouseover(d){
    	[0,1].forEach(function(i){
    		bp[i].mouseover(d);

    		g[i].selectAll(".mainBars").select(".perc")
    		.text(function(d){ return d3.format("0.0%")(d.percent)});
    	});
    }
    function mouseout(d){
    	[0,1].forEach(function(i){
    		bp[i].mouseout(d);

    		g[i].selectAll(".mainBars").select(".perc")
    		.text(function(d){ return d3.format("0.0%")(d.percent)});
    	});
    }
    d3.select(self.frameElement).style("height", "900px");
    $('.background-reading-risk').hide();

  },
  error : function(message) {
          console.log(message);
       }
  });

}
function getColor(mun, d){
  // let ran_color = mun.length;
  // console.log(mun.length);
  if (mun.length>=10) {
    let str_color = mun.length +"";
    let int_color = str_color.substr(1,2);
    // console.log(int_color);
    return parseInt(int_color);
    // console.log(mun.length);
    // let media_color = (mun.length/2).toFixed();
    // console.log("media_color");
    // console.log(media_color);
    // if (media_color>=20) {
    //   let med_c = media_color-19;
    //   console.log("wow");
    //   return med_c;
    // }else {
    //   console.log("debes de ser menor a 20");
    //   let leg_c = media_color.length;
    //   console.log("se supone que menor" +leg_c);
    //   return leg_c;
    // }
  }else {
    let str_colors = mun.length+"";
    // console.log(str_colors);
    let int_colors = str_colors.substr(0,1);
    return parseInt(int_colors);
  }
}
function justDoit(){
  $('.background-reading-risk').show();
  year_compare1 = $('#compare_year1').val();
  year_compare2 = $('#compare_year2').val();
  code_comp = $('#legal_compare').val();
  edo_comp = $('#edo_compare').val();

  d3.selectAll('#compare > svg').remove();
  compare_year(year_compare1, year_compare2, code_comp, edo_comp);
}
$('#compare_year2').click(function(){
 justDoit();
});
$('#compare_year1').click(function(){
  justDoit();
});
$('#legal_compare').click(function(){
  justDoit();
});
$('#edo_compare').click(function(){
  justDoit();
});
</script>
