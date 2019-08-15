import json
import urllib
import urllib2

from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect, Http404, HttpResponseNotAllowed, HttpResponseServerError
from django.shortcuts import get_object_or_404, render
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse

from geonode.geoserver.helpers import ogc_server_settings
from geonode.mviewer.models import MViewer, Topic, LayerIds, LayeridMarker
from geonode.mviewer.forms import MViewerForm, TopicForm, LayerNarrativeForm, MarkerNarrativeForm, MarkerIconForm
from geonode.layers.models import Layer
# from geonode.interactive.views import cat_connect
# from geonode.toolkit.models import ConfigureObjectSOA, SpatialObject
# from geonode.interactive.wms_service.models import WmsService
# from geonode.interactive.wms_service.forms import WmsServiceForm
# from geonode.apps.models import Apps
from geoserver.catalog import Catalog

_user = settings.OGC_SERVER['default']['USER']
_password = settings.OGC_SERVER['default']['PASSWORD']

# Conexion al catalogo
def cat_connect():
    # Connection to catalog
    try:
        cat = Catalog(settings.OGC_SERVER['default']['LOCATION'] + "rest",
                      _user, _password)
        return cat
    except Exception as e:
        print "Error creating connection: %s " % e
        return None


@login_required
def mviewer_list(request):
    group_list = []
    if request.user.is_authenticated():
        group_list = request.user.group_list_all()
        # apps = Apps.objects.all()
    mviewers = MViewer.objects.filter(group__in=group_list)

    return render(request, "mviewer_list.html", context={'items': mviewers})


def mviewer_public(request):
    mviewers = MViewer.objects.filter(is_public=True)

    return render(request, 'mviewer_public.html', context={'items': mviewers})


@login_required
def mviewer_create(request):
    if request.method == 'POST':
        mv_form = MViewerForm(request.POST, request.FILES)
        if mv_form.is_valid():
            mv_form.save()
            return HttpResponseRedirect('../')
    else:
        mv_form = MViewerForm()
        my_groups = request.user.group_list_all()
        mv_form.fields["group"].queryset = my_groups
        no_group = False
        if not my_groups:
            no_group = True

        return render(request, "mviewer_metadata.html",
                      context={'form': mv_form, 'mviewer': json.dumps({'bbox_x0': 'a', 'logo': 'B'}), 'no_group': no_group})

@login_required
def mviewer_metadata(request, mv_id):
    mviewer = get_object_or_404(MViewer, id=mv_id)
    if request.method == 'POST':
        mv_form = MViewerForm(request.POST, request.FILES, instance=mviewer)
        if mv_form.is_valid():
            mv_form.save()
            return HttpResponseRedirect('../')
    else:
        mv_form = MViewerForm(instance=mviewer)

    jmviewer = {
      'bbox_x0':str(mviewer.bbox_x0),
      'bbox_y0':str(mviewer.bbox_y0),
      'bbox_x1':str(mviewer.bbox_x1),
      'bbox_y1':str(mviewer.bbox_y1)
    }

    return render(request, 'mviewer_metadata.html', context={'form': mv_form, 'mviewer':json.dumps(jmviewer)})


def onoff_layers(user, topics):
    vis_dict = {}
    perm_dict={}
    for top in topics:
        layer_ids = LayerIds.objects.filter(topic=top)
        lay_dict = {}
        for e in layer_ids:
            layer = get_object_or_404(Layer, id=e.layer_id)
            if user.has_perm('download_resourcebase', layer.get_self_resource()):
                perm_dict[layer.id]= True
            visible = e.visible
            st_order = e.stack_order
            lay_dict[str(e.layer_id)+'r'+str(st_order)] = visible
        vis_dict[top.id] = lay_dict
    return vis_dict, perm_dict


@login_required
def mviewer_detail(request, mv_id):
    mviewer = get_object_or_404(MViewer, id=mv_id)
    topics = Topic.objects.filter(mviewer=mv_id).order_by('stack_order')
    # config = ConfigureObjectSOA.objects.filter(mviewer=mv_id)
    # wms_services = WmsService.objects.all()
    # mviewer_wms = mviewer.wms_services.all()
    # wms_form = WmsServiceForm()
    sty_dict = {}

    cat = cat_connect()
    top_index = 1
    for top in topics:
        # Actualiza los campos de LayerIds
        top_lays = LayerIds.objects.filter(topic=top).order_by('stack_order')
        index = 1
        for lay in top_lays:
            layer = get_object_or_404(Layer, id=lay.layer_id)
            lay.name = layer.typename
            lay.title = layer.title
            lay.stack_order = index
            gslayer = cat.get_layer(layer.typename)
            #lay.style = gslayer.default_style.name
            lay.default_style = gslayer.default_style.name
            lay.save()
            index += 1

            if gslayer._get_alternate_styles():
                layer_styles = []
                for e in gslayer._get_alternate_styles():
                    layer_styles.append(e.name)
                sty_dict[gslayer.name] = layer_styles
        top.stack_order=top_index
        top.save()
        top_index += 1

    return render(request, 'mviewer_detail.html', context={
        'mviewer': mviewer,
        # 'wms_services': wms_services,
        # 'mviewer_wms': mviewer_wms,
        'topics': topics,
        # 'tools': config,
        # 'wms_form': wms_form,
        'sty_dict': json.dumps(sty_dict)})


@login_required
def mviewer_remove(request, mv_id):
    mviewer = get_object_or_404(MViewer, id=mv_id)
    if request.method == 'GET':
        mviewer.delete()
        return HttpResponseRedirect(reverse("mviewer_list"))
    else:
        return HttpResponse("Not allowed", status=403)


def microviewer(request, url_id):
    dir_conf = {}
    mviewer = get_object_or_404(MViewer, url_id=url_id)
    # configure_tool = ConfigureObjectSOA.objects.filter(mviewer=mviewer.id)
    # soa = SpatialObject.objects.filter(general_tool=0)
    # conf_specific = ConfigureObjectSOA.objects.filter(tool__in=soa).filter(mviewer=mviewer.id).order_by('tool')
    # general_tool_count = ConfigureObjectSOA.objects.filter(mviewer=mviewer.id).filter(tool__general_tool=True).count()

    # size = 0
    # for con in configure_tool:
    #     size = size + 1
    #
    # for spec in conf_specific:
    #     list_conf = []
    #     list_conf.append(spec.tool.constant)
    #     list_conf.append(spec.tool.icon)
    #     list_conf.append(spec.tool.title+", "+spec.tool.description)
    #     dir_conf[spec.tool.id]=list_conf
    #
    topics = Topic.objects.filter(mviewer=mviewer.id).order_by('stack_order')
    tlay_ids = []

    for top in topics:
        tlay_ids += top.layer_ids.values_list('id', flat=True).distinct()
    list_set = set(tlay_ids)
    lays_ids = (list(list_set))
    lays = Layer.objects.filter(id__in=lays_ids)
    user = request.user
    vis_dict, perm_dict = onoff_layers(user, topics)
    gjson = {}

    if mviewer.config:
        basemap = mviewer.config
    else:
        basemap = 'stamenTerrain'

    if mviewer.layer_mask:
        wfs_url = ogc_server_settings.public_url + 'wfs?'
        identifier = mviewer.layer_mask.typename.encode('utf-8')

        params = {
            'service': 'WFS',
            'version': '1.0.0',
            'request': 'GetFeature',
            'typename': identifier,
            'outputFormat': 'json',
            'srs': 'EPSG:4326',
        }
        dwn_url = wfs_url + urllib.urlencode(params)
        gjson_layer = urllib2.urlopen(dwn_url).read()
        gjson['gjson_layer']= gjson_layer

    # wms_services = mviewer.wms_services.all
    bounds = [[str(mviewer.bbox_y0), str(mviewer.bbox_x0)], [str(mviewer.bbox_y1), str(mviewer.bbox_x0)]]

    return render(request, 'mviewer.html', context={
        'mviewer': mviewer,
        'bounds': json.dumps(bounds),
        'topics': topics,
        # 'configure_tool': configure_tool,
        # 'gen_tool_count': general_tool_count,
        # 'conf_specific':json.dumps(dir_conf),
        # 'size': size,
        'lays': lays,
        # 'wms_services': wms_services,
        'vis_dict':json.dumps(vis_dict),
        'perm_dict':json.dumps(perm_dict),
        'basemap':json.dumps(basemap),
        'layer_mask':json.dumps(gjson)
    })


def topic_create(request, mv_id):
    if request.method == 'POST':
        topic_form = TopicForm(request.POST)
        if topic_form.is_valid():
            num = Topic.objects.filter(mviewer=mv_id).count()
            if num >= 7:
                return HttpResponse('Limite excedido')
            else:
                index = num + 1
                new_topic = topic_form.save(commit=False)
                new_topic.mviewer = get_object_or_404(MViewer, id=mv_id)
                new_topic.stack_order = index
                new_topic.save()
                return HttpResponseRedirect(reverse('mviewer_detail', args=[mv_id]))
    else:
        topic_form = TopicForm()

    return render(request, 'topic_metadata.html', context={'form': topic_form, 'mvid':mv_id})


def topic_metadata(request, mv_id, top_id):
    topic = get_object_or_404(Topic, id=top_id)
    if request.method == 'POST':
        topic_form = TopicForm(request.POST, instance=topic)
        if topic_form.is_valid():
            topic_form.save()
            return HttpResponseRedirect(reverse('mviewer_detail', args=[mv_id]))
    else:
        topic_form = TopicForm(instance=topic)
    return render(request, 'topic_metadata.html', context={'form': topic_form, 'mvid':mv_id})


def topic_remove(request, mv_id, top_id):
    topic = get_object_or_404(Topic, id=top_id)
    if request.method == 'GET':
        topic.delete()
        return HttpResponseRedirect(reverse("mviewer_detail", args=[mv_id]))
    else:
        return HttpResponse("Not allowed", status=403)


def edit_layer_narrative(request, mv_id, reg_id):
    layerid = get_object_or_404(LayerIds, id=reg_id)
    if request.method == 'POST':
        layerid_form = LayerNarrativeForm(request.POST, instance=layerid)
        if layerid_form.is_valid():
            layerid_form.save()
            return HttpResponseRedirect(reverse('mviewer_detail', args=[mv_id]))
    else:
        layerid_form = LayerNarrativeForm(instance=layerid)
    return render(request, 'layer_narrative.html', context={'form': layerid_form, 'mvid': mv_id, 'layerid':layerid})


def add_layer_markers(request, mv_id, reg_id):
    layerid = get_object_or_404(LayerIds, id=reg_id)
    marker_narrative_form = MarkerNarrativeForm()
    marker_icon_form = MarkerIconForm()
    markers = layerid.markers.all()
    markers_dict = []

    for m in markers:
        if m.options:
            options = json.loads(m.options)
            color = options['color']
            if 'shape' in options:
                shape = options['shape']
            else:
                shape = 'circle'
            if 'transparent' in options:
                transparent = options['transparent']
            else:
                transparent = 'false'
        else:
            color = '#df1e1e'
            shape = 'circle'
            transparent = 'false'

        markers_dict.append({'id': m.id, 'lat': str(m.lat), 'lng': str(m.lng), 'title': m.title, 'narrative': m.narrative,
                             'icon': str(m.icon), 'color': color, 'shape': shape, 'transparent': transparent})

    lay_data = {
        'id': layerid.id,
        'name': layerid.name,
        'style': layerid.style,
        'ows': layerid.layer.ows_url
    }
    bounds = [[str(layerid.layer.bbox_y0), str(layerid.layer.bbox_x0)], [str(layerid.layer.bbox_y1), str(layerid.layer.bbox_x0)]]
    return render(request, 'layerid_markers.html', context={
        'layer': layerid.layer,
        'bounds': json.dumps(bounds),
        'form': marker_narrative_form,
        'icon_form': marker_icon_form,
        'mvid': mv_id,
        'layerid': json.dumps(lay_data),
        'markers': json.dumps(markers_dict)
    })


### Vistas para Ajax ###
def add_topic_layers(request):
    if request.is_ajax():
        add_data = json.loads(request.POST['add_data'])
        topic_id = add_data['topic_id']
        id_list = add_data['id_list']
        added_ids = {}
        ap = []
        lay_styles = []
        topic = get_object_or_404(Topic, id=topic_id)
        top_elem = LayerIds.objects.filter(topic=topic)
        index = len(top_elem)+1
        cat = cat_connect()

        for id in id_list:
            lay = get_object_or_404(Layer, id=id)
            r = LayerIds(topic=topic, layer=lay, name=lay.typename)
            r.title = lay.title
            r.stack_order = index
            gslayer = cat.get_layer(lay.typename)
            r.style = gslayer.default_style.name
            r.default_style = gslayer.default_style.name
            r.save()
            for e in gslayer._get_alternate_styles():
                lay_styles.append(e.name)

            added_ids[lay.name] = {'layer_id': id, 'st_order': index, 'style': r.style, 'reg_id' : r.id, 'styles': lay_styles, 'name': r.name }
            ap.append(id)
            index += 1

        return HttpResponse(json.dumps(added_ids), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def remove_topic_layer(request):
    if request.is_ajax():
        rmv_data = json.loads(request.POST['rmv_data'])
        reg_id = rmv_data['reg_id']
        r = get_object_or_404(LayerIds, id=reg_id)
        r.delete()

        return HttpResponse(json.dumps({'ok':'ok'}), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def set_layer_style(request):
    if request.is_ajax():
        data = json.loads(request.POST['data'])
        reg_id = data['reg_id']
        style_select = data['style_select']
        r = get_object_or_404(LayerIds, id=reg_id)
        r.style = style_select
        r.save()

        return HttpResponse(json.dumps({'ok':'ok'}), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def tlayer_on(request):
    if request.is_ajax():
        data = json.loads(request.POST['data'])
        reg_id = data['reg_id']
        topic_layer = get_object_or_404(LayerIds, id=reg_id)
        topic_layer.visible = True
        topic_layer.save()

        return HttpResponse(json.dumps({'ok':'ok'}), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def tlayer_off(request):
    if request.is_ajax():
        data = json.loads(request.POST['data'])
        reg_id = data['reg_id']
        topic_layer = get_object_or_404(LayerIds, id=reg_id)
        topic_layer.visible = False
        topic_layer.save()

        return HttpResponse(json.dumps({'ok':'ok'}), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def sort_topic(request):
    if request.is_ajax():
        sorted_ids = json.loads(request.POST['sorted_ids'])
        st_order=1
        for e in sorted_ids:
            topic = get_object_or_404(Topic, id=int(e))
            topic.stack_order = st_order
            topic.save()
            st_order += 1

        return HttpResponse(json.dumps({'ok': 'ok'}), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def sort_layer(request):
    if request.is_ajax():
        sorted_ids = json.loads(request.POST['sorted_ids'])
        st_order=1
        for e in sorted_ids:
            layer = get_object_or_404(LayerIds, id=int(e))
            layer.stack_order = st_order
            layer.save()
            st_order += 1

        return HttpResponse(json.dumps({'ok': 'ok'}), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def has_layer_tool(request):
    if request.is_ajax():
        regid = request.GET['regid']
        r = get_object_or_404(LayerIds, id=regid)
        # tools_flag = r.sos_layers_mv.all().exists()
        tools_flag = False
        markers_flag = r.markers.all().exists()
        narrative_flag = False
        if r.narrative:
            narrative_flag = True

        flags_dict = {'tflag': tools_flag, 'nflag': narrative_flag, 'mflag': markers_flag}

        return HttpResponse(json.dumps(flags_dict), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def get_layer_narrative(request):
    if request.is_ajax():
        regid = request.GET['regid']
        r = get_object_or_404(LayerIds, id=regid)
        narrative = r.narrative

        return HttpResponse(json.dumps(narrative), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def add_layerid_marker(request):
    if request.is_ajax():
        regid = request.GET['regid']
        lat = request.GET['lat']
        lng = request.GET['lng']

        marker = LayeridMarker(lat=lat, lng=lng)
        marker.save()
        r = get_object_or_404(LayerIds, id=regid)
        r.markers.add(marker)

        return HttpResponse(json.dumps(marker.id), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def remove_layerid_marker(request):
    if request.is_ajax():
        regid = request.GET['regid']
        marker_id = request.GET['marker_id']

        marker = get_object_or_404(LayeridMarker, id=marker_id)
        r = get_object_or_404(LayerIds, id=regid)
        r.markers.remove(marker)
        marker.delete()

        return HttpResponse(json.dumps(marker_id), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def add_marker_narrative(request):
    if request.is_ajax():
        title = request.POST['title']
        content = request.POST['content']
        marker_id = request.POST['marker_id']

        marker = get_object_or_404(LayeridMarker, id=marker_id)
        marker.title = title
        marker.narrative = content
        marker.save()

        return HttpResponse(json.dumps('EXITO'), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def change_marker_position(request):
    if request.is_ajax():
        markid = request.GET['markid']
        lat = request.GET['lat']
        lng = request.GET['lng']
        marker = get_object_or_404(LayeridMarker, id=markid)
        marker.lat = lat
        marker.lng = lng
        marker.save()

        return HttpResponse(json.dumps('EXITO'), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def change_icon_marker(request):
    if request.is_ajax():
        marker_id = request.POST['marker_id']
        icon = request.POST['icon']
        color = request.POST['color']
        shape = request.POST['shape']
        transparent = request.POST['transparent']

        marker = get_object_or_404(LayeridMarker, id=marker_id)
        marker.icon = icon
        marker.options = json.dumps({'color': color, 'shape': shape, 'transparent': transparent})
        marker.save()

        return HttpResponse(json.dumps('EXITO'), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")


def layerid_markers(request):
    if request.is_ajax():
        regid = request.GET['regid']
        layerid = get_object_or_404(LayerIds, id=regid)
        markers = layerid.markers.all()
        markers_dict = []

        for m in markers:
            if m.options:
                options = json.loads(m.options)
                color = options['color']
                if 'shape' in options:
                    shape = options['shape']
                else:
                    shape = 'circle'
                if 'transparent' in options:
                    transparent = options['transparent']
                else:
                    transparent = 'false'
            else:
                color = '#df1e1e'
                shape = 'circle'
                transparent = 'false'
            markers_dict.append({'id': m.id, 'lat': str(m.lat), 'lng': str(m.lng), 'title': m.title, 'narrative': m.narrative,
                                 'icon': str(m.icon), 'color': color, 'shape': shape, 'transparent': transparent})

        return HttpResponse(json.dumps(markers_dict), content_type='application/json')
    else:
        return HttpResponse("Not ajax request")
