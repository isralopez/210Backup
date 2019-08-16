<script>
let year_compare1 = "2015";
let year_compare2 = "2016";
var code = "0";
var edo = "09";
compare_year(code, edo);

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
    console.log(datas);
    console.log([
      ['City', '2010 Population', '2000 Population'],
      ['New York City, NY', 8175000, 8008000],
      ['Los Angeles, CA', 3792000, 3694000],
      ['Chicago, IL', 2695000, 2896000],
      ['Houston, TX', 2099000, 1953000],
      ['Philadelphia, PA', 1526000, 1517000]
    ]);
    // $('#edo_compare').find(":selected").text();
    var titles = ["Delito", "total 2015", "total 2016", "total 2017", "total 2018"];
    var obj = datas.sort();
    obj.unshift(titles);
    console.log(obj);
    google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawAxisTickColors);

function drawAxisTickColors() {
  var data = new google.visualization.DataTable();
     // data.addColumn('string', 'Time of Day');
     // data.addColumn('number', 'Motivation Level');
     // data.addColumn('number', '2000 Level');
     // data.addRows([datas]);

      var data = google.visualization.arrayToDataTable(obj);

      var options = {
        title: 'Delitos 2015-2018 '+$('#edo_compare').find(":selected").text(),
        chartArea: {width: '50%'},
        height: 700,
        hAxis: {
          title: 'Total de delitos',
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
  code_comp = $('#legal_compare').val();
  edo_comp = $('#edo_compare').val();

  d3.selectAll('#compare > svg').remove();
  compare_year(code_comp, edo_comp);
}
$('#legal_compare').click(function(){
  justDoit();
});
$('#edo_compare').click(function(){
  justDoit();
});
</script>
