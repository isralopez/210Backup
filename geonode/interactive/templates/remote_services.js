<script type="text/javascript">
/* ================================Remote Services======================== */
   /* Show remote layers */
$('#remoteServices').on('change', '.service', function() {
    var rmt_layers = {{remote_layers|safe}},
        rmt_categories = {{remote_categories|safe}},
        rmt_tags = {{remote_tags|safe}},
        serv_name = $(this).val(),
        ows_url = $(this).attr("name");

    if(this.checked) {
        /* Agrega capas al filtro texto */
        $.each(rmt_layers, function(i, value) {
            if(value.store==serv_name){
                html = '<div id="m1c600l'+value.id+'" class="layerMenuTopLevelGroupContainer layer" name="'+serv_name+'">'
                + '<div class="layerRow" style="display: none;">'
                + '<label for="m1c600l'+value.id+'i" title="'+value.title+'">'
                + '<input class="checkbox" type="checkbox" id="m1c600l'+value.id+'i" href="'
                + ows_url+'" value="'+value.typename+'" data-info="'+value.abstract+'" title="'+value.title+'">'
                + value.title + '</label></div></div>';
                $('#result_text').append(html);
            }
        });
        /* Crea chekboxes de capas  */
        function chk_loop(clayers, divcat_id) {
            $.each(clayers, function(i, lay) {
                if(lay.store==serv_name){
                    html = '<div id="'+divcat_id+lay.id+'" class="layerMenuTopLevelGroupContainer layer" style="display: none;">'
                    + '<div class="layerRow"><label for="'+divcat_id+lay.id+'i" title="'+lay.title+'">'
                    + '<input class="checkbox" type="checkbox" id="'+divcat_id+lay.id+'i" href="'+ows_url+'" value="'+lay.typename
                    + '" data-info="'+lay.abstract+'" title="'+lay.title+'">'+lay.title+'</label></div></div>'
                    $('#'+divcat_id).append(html);
                }
            });
        }
        /* Agrega capas al filtro categorias */
        $.each(rmt_categories, function(i, value) {
            var divcat_id = 'm2c'+ value.id + 'l',
                clayers = value.layers;

            if( $('#'+divcat_id).length ){
                chk_loop(clayers, divcat_id);
            } else {
                html = '<div id="'+divcat_id+'" class="layerMenuTopLevelGroupContainer category" style="display: block;">'
                + '<div class="level2LabelText translatable level2Label level2LabelBorderBottom" data-id="m2c'+value.id
                + 'l" style="direction: ltr;">'+value.name+'</div></div>'
                $('#cat_container').append(html);
                chk_loop(clayers, divcat_id);
                if($('#'+divcat_id).children().length == 1){
                    $('#'+divcat_id).remove();
                }
            }
        });
        /* Agrega capas al filtro palabras clave */
        $.each(rmt_tags, function(i, value) {
            var divtag_id = 'm3c'+ value.id + 'l',
                tlayers = value.layers;

            if( $('#'+divtag_id).length ){
                chk_loop(tlayers, divtag_id);
            } else {
                html = '<div id="'+divtag_id+'" class="layerMenuTopLevelGroupContainer tag" style="display: block;">'
                + '<div class="level2LabelText translatable level2Label level2LabelBorderBottom" data-id="m3c'+value.id
                + 'l" style="direction: ltr;">'+value.name+'</div></div>'
                $('#tag_container').append(html);
                chk_loop(tlayers, divtag_id);
                if($('#'+divtag_id).children().length == 1){
                    $('#'+divtag_id).remove();
                }
            }
        });

    } else{
        $('div[name='+serv_name+']').remove();
        $.each(rmt_categories, function(i, cat) {
            var divcat_id = 'm2c'+ cat.id + 'l',
            clayers = cat.layers;

            $.each(clayers, function(i, lay) {
                if(lay.store==serv_name){
                    $('#'+divcat_id+lay.id).remove();
                }
            })
            if($('#'+divcat_id).children().length == 1){
                $('#'+divcat_id).remove();
            }
        })
        $.each(rmt_tags, function(i, tag) {
            var divtag_id = 'm3c'+ tag.id + 'l',
            tlayers = tag.layers;

            $.each(tlayers, function(i, lay) {
                if(lay.store==serv_name){
                    $('#'+divtag_id+lay.id).remove();
                }
            })
            if($('#'+divtag_id).children().length == 1){
                $('#'+divtag_id).remove();
            }
        })
    }
});
</script>