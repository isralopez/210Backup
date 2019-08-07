# -*- coding: utf-8 -*-
import os
import json
import ast
import psycopg2
import urllib2
import logging
import random
import numpy as np

from lxml.etree import parse
from urllib2 import urlopen
from tempfile import NamedTemporaryFile
from sld import StyledLayerDescriptor, PolygonSymbolizer, PointSymbolizer, LineSymbolizer, Filter
from django.conf import settings
from django.shortcuts import render
from django.template import RequestContext
from django.http import HttpResponse, HttpResponseRedirect
from django.utils.translation import ugettext as _
from django.contrib.sites.models import Site
from guardian.shortcuts import get_perms, get_objects_for_user
from geoserver.catalog import Catalog

from geonode.layers.views import _resolve_layer
# from geonode.interactive.models import QuickMap, QMapLayer
# from geonode.interactive.forms import QuickMapForm
# from geonode.interactive.wms_service.forms import WmsServiceForm
# from geonode.interactive.wms_service.models import WmsService
from geonode.base.models import TopicCategory
from geonode.layers.models import Layer, Attribute
from geonode.maps.models import Map
from geonode.documents.models import Document
from geonode.geoserver.helpers import ogc_server_settings
# from project.models import Project
from taggit.models import Tag
# from geonode.interactive.chats_map.models import Chat, ReplyChat, LikeChat
# from geonode.interactive.chats_map.forms import ChatsForm, ChatsFormExcludeMap, ReplyChatForm
from geonode.maps.views import _resolve_map
from geonode.services.models import Service
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError

_PERMISSION_MSG_VIEW = _("You are not permitted to view this layer")

_user = settings.OGC_SERVER['default']['USER']
_password = settings.OGC_SERVER['default']['PASSWORD']

la_y = []

logger = logging.getLogger('geonode.contrib.datatables.utils')


def get_style_perm(request):
    if request.is_ajax():
        layer_id = request.GET['layer_id']
        layer = Layer.objects.get(typename=layer_id)
        perm = request.user.has_perm("change_layer_style", layer)
        return HttpResponse(perm)
    else:
        return HttpResponse("Not ajax request")


def get_user_layers(user):
    obj_ids = get_objects_for_user(user, 'base.view_resourcebase').values('id')
    layer_list = Layer.objects.filter(workspace=settings.DEFAULT_WORKSPACE, id__in=obj_ids)

    dwn_obj_ids = get_objects_for_user(user, 'base.download_resourcebase').values('id')
    dwn_lay_list = Layer.objects.filter(workspace=settings.DEFAULT_WORKSPACE, id__in=dwn_obj_ids)
    dwn_ids = dwn_lay_list.values_list('id', flat=True)

    return layer_list, dwn_ids


def layToDict(layer):
    layer_dict = {
        'id': layer.id,
        "title": layer.title,
        "typename": layer.typename,
        "abstract": layer.abstract,
        "store": layer.store,
        "ows_url": layer.ows_url,
        "storeType": layer.storeType,
        "x0": float(layer.bbox_x0), "x1": float(layer.bbox_x1),
        "y0": float(layer.bbox_y0), "y1": float(layer.bbox_y1),
        "download": layer.download
    }
    return layer_dict


def layers_cat_list(request):
    if request.is_ajax():
        cat_dict = {}
        layer_list, dwn_ids = get_user_layers(request.user)

        for layer in layer_list:
            cat = layer.category
            if cat:
                layer.download = True if layer.id in dwn_ids else False
                jlayer = layToDict(layer)
                if cat.id in cat_dict:
                    cat_dict[cat.id]['layers'][layer.id] = jlayer
                else:
                    cat_dict[cat.id] = {
                        'id': cat.id,
                        'name': cat.gn_description,
                        'layers': {layer.id:jlayer}
                    }
        return HttpResponse(json.dumps(cat_dict), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")


def layers_tags_list(request):
    if request.is_ajax():
        tag_dict = {}
        layer_list, dwn_ids = get_user_layers(request.user)

        for layer in layer_list:
            tags = layer.keywords.all()
            if tags:
                layer.download = True if layer.id in dwn_ids else False
                jlayer = layToDict(layer)
                for tag in tags:
                    if tag.id in tag_dict:
                        tag_dict[tag.id]['layers'][layer.id] = jlayer
                    else:
                        tag_dict[tag.id] = {
                            'id': tag.id,
                            'name': tag.name,
                            'layers': {layer.id:jlayer}
                        }
        return HttpResponse(json.dumps(tag_dict), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")


def layer_interface(request):
    layer_list, dwn_ids = get_user_layers(request.user)

    # if request.user.id:
    #     myQMaps = QuickMap.objects.filter(owner=request.user)
    # else:
    #     myQMaps = None
    # qmap_form = QuickMapForm()
    # services = Service.objects.all()
    # wms_services = WmsService.objects.all()
    # wms_form = WmsServiceForm()

    return render(request, 'layers_interface.html', context= {
        'local_layers':layer_list,
        'dwn_ids': dwn_ids,
        # 'qmaps':myQMaps,
        # 'qmap_form': qmap_form,
        # 'services': services,
        # 'wms_services': wms_services,
        # 'wms_form': wms_form
    })


def layer_links(request):
    if request.is_ajax():
        layername = json.loads(request.POST['layer_name'])

        layer = _resolve_layer(
            request,
            layername,
            'base.view_resourcebase',
            _PERMISSION_MSG_VIEW)

        html = ""
        if request.user.has_perm('download_resourcebase', layer.get_self_resource()):
            if layer.storeType == 'dataStore':
                links = layer.link_set.download().filter(
                    name__in=settings.DOWNLOAD_FORMATS_VECTOR)
            else:
                links = layer.link_set.download().filter(
                    name__in=settings.DOWNLOAD_FORMATS_RASTER)

            for link in links:
                html += "<li><a href=%s target=_blank>%s</a></li>" % (link.url, link.name)

        return HttpResponse(html)
    else:
        return HttpResponse("Not ajax request")


def qmap_data(request):
    if request.is_ajax():
        id = request.POST['mapid']
        if id:
            qmap = QuickMap.objects.get(id=id)
        return HttpResponse(json.dumps(qmap.viewer_json()), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")


# Vista que genera un objeto config para un embed en leaflet
def quickmap_embed(request, qmapid, template='maps/map_l_embed.html'):

    if qmapid:
        qmap = QuickMap.objects.get(id=qmapid)

    if qmap:
        config = qmap.viewer_json()
        map_layers = config['map']['layers']
        map_title = config['about']['title']

    return render_to_response(template, RequestContext(request, {
        'config': json.dumps(config),
        'map_layers': map_layers,
        'map_title': map_title,
        'list_style': [10,20,30],
    }))


def save_quickmap(request):
    if request.is_ajax():
        jdata = json.loads(request.POST['map_data'])

        map_id = jdata['map_id']
        if map_id:
            map_obj = QuickMap.objects.get(id=map_id)
            map_obj.title = jdata['map_title'].encode('utf-8')
            map_obj.abstract = jdata['map_abstract'].encode('utf-8')
            map_obj.save()
            # image = map_obj._render_thumbnail()
            # filename = 'qmap-%s-thumb.png' % map_obj.id
            # map_obj.save_thumbnail(filename, image)
        else:
            map_obj = QuickMap(owner=request.user, projection='EPSG:4326')
            map_obj.title = jdata['map_title'].encode('utf-8')
            map_obj.abstract = jdata['map_abstract'].encode('utf-8')
            map_obj.zoom = jdata['zoom']
            map_obj.center_x = jdata['center']['lat']
            map_obj.center_y = jdata['center']['lng']
            map_obj.save()

        bbox = None
        index = 0

        for layer in jdata['layer_list']:
            layer_bbox = layer['bbox']
            config = {}

            # Add required parameters for GXP lazy-loading
            config["title"] = layer['title']
            config["abstract"] = layer['abstract']
            config["queryable"] = True

            config["srs"] = 'EPSG:4326'
            """
            config["bbox"] = bbox if config["srs"] != 'EPSG:900913' \
                else llbbox_to_mercator([float(coord) for coord in bbox])
            """
            config["bbox"] = layer_bbox
            opacity = 1

            qmap, created = QMapLayer.objects.get_or_create(
                quick_map=map_obj,
                stack_order=index,
                name=layer['typename'],
                ows_url=layer['ows_url'],
                layer_params=json.dumps(config),
                visibility=True,
                opacity=opacity,
                group=layer['group'] or ''
                )

            index += 1
        """
        if bbox is not None:
                minx, miny, maxx, maxy = [float(c) for c in bbox]
                x = (minx + maxx) / 2
                y = (miny + maxy) / 2

                center = list(forward_mercator((x, y)))
                if center[1] == float('-inf'):
                    center[1] = 0

                BBOX_DIFFERENCE_THRESHOLD = 1e-5

                # Check if the bbox is invalid
                valid_x = (maxx - minx) ** 2 > BBOX_DIFFERENCE_THRESHOLD
                valid_y = (maxy - miny) ** 2 > BBOX_DIFFERENCE_THRESHOLD

                if valid_x:
                    width_zoom = math.log(360 / abs(maxx - minx), 2)
                else:
                    width_zoom = 15

                if valid_y:
                    height_zoom = math.log(360 / abs(maxy - miny), 2)
                else:
                    height_zoom = 15

                map_obj.center_x = center[0]
                map_obj.center_y = center[1]
                map_obj.zoom = math.ceil(min(width_zoom, height_zoom))
                map_obj.save()
        """
        qmap = {'id': map_obj.id, 'title': map_obj.title, 'abstract': map_obj.abstract}
        return HttpResponse(json.dumps(qmap), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")


# Vista que guarda archivo de imagen a partir de un codigo64
# esta implementada, pero es usada.
def qmap_thumbnail(request):
    if request.is_ajax():
        img64 = "b"+"'"+request.POST['imgBase64']+"'"

        if img64:
            print img64
            with open("imageToSave.png", "wb") as fh:
                fh.write(img64.decode('base64'))
        return HttpResponse("Success")
    else:
        return HttpResponse("Not ajax request")


def delete_quickmap(request):
    if request.is_ajax():
        id = request.POST['id']
        if id:
            qmap = QuickMap.objects.get(id=id)
            qmap.delete()

        return HttpResponse(id)
    else:
        return HttpResponse("Not ajax request")


def get_featureinfo(request):
    if request.is_ajax():
        typename = request.POST['layername']
        getFeature_url = request.POST['url']
        getfeature_dict = {}
        if typename and getFeature_url:
            response = urllib2.urlopen(getFeature_url)
            data = json.load(response)
            if data['features']:
                properties = data['features'][0]['properties']
                attr_dict = {}
                try:
                    layer = Layer.objects.get(typename=typename)
                    attributes = Attribute.objects.filter(resource=layer.id)
                    for attr in attributes:
                        if attr.description:
                            attr_dict[attr.attribute] = attr.description
                        else:
                            attr_dict[attr.attribute] = attr.attribute
                except:
                    print 'No Layer found'
                    pass
                getfeature_dict = {'properties': properties, 'attr_desc': attr_dict}
        return HttpResponse(json.dumps(getfeature_dict), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")


def maps_interface(request):
    maps = Map.objects.order_by('title')
    category_list = TopicCategory.objects.all().order_by('gn_description')
    category_dict = {}

    for category in category_list:
        map_dict = {}
        map_list = Map.objects.filter(category=category.id).order_by('title')
        if map_list:
            for map in map_list:
                map_dict[map] = map
            category_dict[category] = map_dict

    tag_list = Tag.objects.all().order_by('name')
    tag_dict = {}

    for tag in tag_list:
        map_dict = {}
        map_list = Map.objects.filter(keywords=tag.id).order_by('title')
        if map_list:
            for map in map_list:
                map_dict[map] = map
            tag_dict[tag] = map_dict

    category_dict_layer = {}

    for category in category_list:
        layer_dict = {}
        layer_list = Layer.objects.filter(category=category.id).order_by('title')
        if layer_list:
            for layer in layer_list:
                layer_dict[layer] = layer
            category_dict_layer[category] = layer_dict

    tag_dict_layer = {}

    for tag in tag_list:
        layer_dict = {}
        layer_list = Layer.objects.filter(keywords=tag.id).order_by('title')
        if layer_list:
            for layer in layer_list:
                layer_dict[layer] = layer
            tag_dict_layer[tag] = layer_dict

    arrays_reply = []
    dir_reply = {}
    url_str = ''

    # if request.method == 'POST':
    #     chat_reply = ReplyChatForm()
    #     validate = URLValidator()
    #     try:
    #         user_id = 1
    #         if request.user.is_authenticated():
    #             user_id = request.user.id
    #         else:
    #             user_fb = request.POST.get('user_fb', False)
    #             if user_fb == "":
    #                 return HttpResponseRedirect('')
    #             us = Profile.objects.filter(username = user_fb)
    #             if us:
    #                 user_id = us[0].id
    #             else:
    #                 us_saving_face = Profile(username = user_fb, facebook_access = True)# , is_user_facebook = True)
    #                 us_saving_face.save()
    #                 us_fb = Profile.objects.filter(username = us_saving_face.username)
    #                 if us_fb:
    #                     user_id = us_fb[0].id
    #                     print "i have user id of facebook"
    #                 else:
    #                     print "i do not found de user facebooke"
    #             # user_id = request.user.id
    #         chat_id = request.POST.get('id_chat_comment', False)
    #         url = request.POST.get('url', False)
    #         comments = request.POST.get('comments', False)
    #         point = request.POST.get('location', False)
    #         maps_chat = request.POST.get('id_map_for_chat', False)
    #         creation_date = request.POST.get('timestamp', False)
    #         if point == "":
    #             print "no hay location"
    #             return HttpResponseRedirect('')
    #
    #         if url != "":
    #             if url in "http":
    #                 url_str = url
    #             else:
    #                 url_str = "http://"+url
    #             validate(url_str)
    #         if chat_id == None:
    #             chat_form = ChatsForm(
    #                 {'maps': maps_chat, 'user_chat': user_id, 'comments': comments, 'url': url_str, 'location': point,
    #                  'status': 1, 'creation_date': creation_date}, request.FILES)
    #         else:
    #             if maps_chat:
    #                 chat_form = ChatsForm(
    #                     {'maps': maps_chat, 'parent_chat': chat_id, 'user_chat': user_id, 'comments': comments,
    #                      'url': url_str,
    #                      'location': point, 'status': 1, 'creation_date': creation_date}, request.FILES)
    #             else:
    #                 chat_form = ChatsFormExcludeMap()
    #         if chat_form.is_valid():
    #             chat_form.save()
    #             print "save"
    #             return HttpResponseRedirect('')
    #
    #     except ValidationError, e:
    #         is_valid = False
    #         print is_valid
    #         print e
    #         chat_form = ChatsFormExcludeMap()
    # else:
    #     chat_form = ChatsFormExcludeMap()
    #     chat_reply = ReplyChatForm()
    #
    # chats = Chat.objects.all().order_by('id')
    # likes = LikeChat.objects.all().order_by('id')
    #
    # reply = None
    # for c in chats:
    #     reply = ReplyChat.objects.all().order_by('id')
    #     for r in reply:
    #         arr_reply = []
    #         product1 = []
    #         arr_reply.append(r.id)
    #         arr_reply.append(r.chat.id)
    #
    #         arr_reply.append(r.comments)
    #         arr_reply.append(r.user_reply.username)
    #
    #         arrays_reply.append(arr_reply)
    # dir_reply = {'data':arrays_reply}

    return render(request, 'maps_interface.html', context= {
        'maps':maps,
        'categorys':category_dict,
        'tags':tag_dict,
        # 'chats':chats,
        'reply':arrays_reply,
        # 'reply_obj':reply,
        # 'likes': likes,
        # 'form':chat_form,
        # 'form_reply':chat_reply,
        'categorys_layer':category_dict_layer,
        'tags_layer':tag_dict_layer
        })


def documents_interface(request):

    tag_list = Tag.objects.all().order_by('name')
    tag_dict = {}
    category_list = TopicCategory.objects.all().order_by('gn_description')
    category_dict = {}

    for category in category_list:
        document_dict = {}
        document_list = Document.objects.filter(category=category.id).order_by('title')
        if document_list:
            for document in document_list:
                document.permission = get_perms(request.user, document.get_self_resource())
                document_dict[document] = document
            category_dict[category] = document_dict

    for tag in tag_list:
        document_dict = {}
        document_list = Document.objects.filter(keywords=tag.id).order_by('title')
        if document_list:
            for document in document_list:
                document.permission = get_perms(request.user, document.get_self_resource())
                document_dict[document] = document
            tag_dict[tag] = document_dict

    return render(request, 'documents.html', context={'categorys': category_dict, 'tags': tag_dict})


def projects_interface(request):

    category_list = TopicCategory.objects.all().order_by('gn_description')
    category_dict = {}

    for category in category_list:
        document_dict = {}
        document_list = Project.objects.filter(category=category.id).order_by('title')
        if document_list:
            for document in document_list:
                document_dict[document] = document
            category_dict[category] = document_dict

    return render(request, 'projects.html', context={'categorys':category_dict})


def face_embed(request):

    lista_regiones = []
    lista_row = []
    param = ""

    #if request.is_ajax():
        # extract your params (also, remember to validate them)
    param = request.GET['param']
    zoom = request.GET['zoom']
    slect_table = ""

    if zoom == "Puerto Balsas":
        slect_table = "zonas_economicas_especiales"
    elif zoom == "Corredor Transistmico":
        slect_table = "zonas_economicas_especiales"
    elif zoom == "Puerto Chiapas":
        slect_table = "zonas_economicas_especiales"
    elif zoom == "Region Sierra Madre de Chiapas":
        slect_table = "muns_sierra_madre_chis"
    elif zoom == "Region ADESUR":
        slect_table =  "region_adesur"
    elif zoom == "Yucatan":
        slect_table = "yucatan"
    elif zoom == "Cuenca Usumacinta":
        slect_table = "c_usumacinta_2016"
    elif zoom == "Frontera Chiapas Tabasco":
        slect_table = "fronterachis_tab"

    #conn = psycopg2.connect("dbname='geonode-imports' user='geonode' host='localhost' password='geonode'")
    db = ogc_server_settings.datastore_db
    conn = psycopg2.connect(
            "dbname='" +
            db['NAME'] +
            "' user='" +
            db['USER'] +
            "'  password='" +
            db['PASSWORD'] +
            "' port=" +
            db['PORT'] +
            " host='" +
            db['HOST'] +
            "'")
    try:
        cur = conn.cursor()
        lista_regiones.append(param)

        for i in enumerate(lista_regiones):
            name_region = str(i[1])
            nombre_region = "reg_" + name_region.replace(' ', '')
            cur.execute("DROP TABLE IF EXISTS %s;" % nombre_region)
            cur.execute("CREATE TABLE %s AS SELECT * FROM %s p where  gid = '%s' ;" % (nombre_region, slect_table, name_region))
            cur.execute("ALTER TABLE %s RENAME COLUMN gid TO gid2;" % nombre_region)
            cur.execute("ALTER TABLE %s ADD PRIMARY KEY (gid2);" % nombre_region)
            cur.execute("CREATE INDEX %s_gix ON %s USING GIST (the_geom);" % (nombre_region, nombre_region))
            cur.execute("ALTER TABLE %s ALTER COLUMN the_geom TYPE geometry(MultiPolygon,4326) USING ST_SetSRID(the_geom,4326);" % nombre_region)
            cur.execute("DROP TABLE IF EXISTS dona_%s;" % nombre_region)
            cur.execute("CREATE TABLE dona_%s AS select gid2, the_geom from (select h.gid2, stx_extract(st_difference (ma.the_geom, st_union(h.the_geom)),2 ) as the_geom from public.mascara_1 ma, public.%s h where ma.the_geom && h.the_geom and st_relate (ma.the_geom, h.the_geom, 'T********') group by h.gid2, ma.the_geom, h.the_geom ) AS tabla where the_geom is not null;" % (nombre_region, nombre_region))
            cur.execute("CREATE INDEX dona_%s_gix ON dona_%s USING GIST (the_geom);" % (nombre_region, nombre_region))
            cur.execute("ALTER TABLE dona_%s ALTER COLUMN the_geom TYPE geometry(MultiPolygon,4326) USING ST_SetSRID(the_geom,4326);" % nombre_region)
            cur.execute("SELECT ST_AsGeoJSON(the_geom, 4)::json FROM dona_%s As lg;" % nombre_region)
            rows2 = cur.fetchall()
            cur.execute("SELECT ST_AsGeoJSON(the_geom, 4)::json FROM %s As lg;" % nombre_region)
            rows3 = cur.fetchall()
            cur.execute("DROP TABLE IF EXISTS dona_%s,%s;" % (nombre_region, nombre_region))
            conn.commit()

    except psycopg2.Error as e:
        print e.pgerror

    finally:
        conn.close()

        # construct your JSON response by calling a data method from elsewhere
    #else:
        #return HttpResponse("solo ajax")
    if type(rows2[0][0]) == str:
        rows22 = (ast.literal_eval(rows2[0][0]),)
        rows33 = (ast.literal_eval(rows3[0][0]),)
    	ra_dict = {
            'type': 'FeatureCollection',
            'features': rows22
        }
    	rb_dict = {
            'type': 'FeatureCollection',
            'features': rows33
     	}
    else:
    	ra_dict = {
            'type': 'FeatureCollection',
            'features': rows2[0]
     	}
        rb_dict = {
            'type': 'FeatureCollection',
            'features': rows3[0]
        	}

    #print ra_dict
    lista_row.append(rb_dict)
    lista_row.append(ra_dict)
    return HttpResponse( json.dumps(lista_row), content_type='application/json' )


def interactive_map(request):

    if request.is_ajax():
        mapid = request.GET['mapid']
        config = {}
        if mapid:
            map_obj = _resolve_map(request, mapid, 'base.view_resourcebase', _PERMISSION_MSG_VIEW)

            if map_obj:
                config = map_obj.viewer_json(request)
        return HttpResponse(json.dumps(config), content_type='application/json')
    else:
        return HttpResponse("Not AJax")

def get_featureinfostyle(request):
    if request.is_ajax():
        query_data = json.loads(request.POST['style_data'])
        idLayer = query_data['style_layerid']
        dataType = query_data['dataType']
        attr_dict = {}
        if dataType == 'graduated':
            type_include = ["xsd:double","xsd:int","xsd:long"]
        else:
            type_include = ["xsd:double","xsd:int","xsd:long","xsd:string"]
        attributes = Attribute.objects.filter(resource=idLayer, attribute_type__in=type_include)

        for attr in attributes:
            attr_dict[attr.attribute] = {
                "attribute": attr.attribute,
                "description": attr.description,
                "attribute_type": attr.attribute_type
            }

        return HttpResponse(json.dumps(attr_dict), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")

def get_csv(request):
    if request.is_ajax():
        try:
            field_dowload = ""
            field_theming = ""
            field_key = ""
            field_time_frame = ""
            field_nivel = ""
            field_orentation = ""
            field_period = ""
            field_tematic = ""
            field_indicator = ""
            field_source = ""
            field_csv = ""
            fields_peridos = []
            data_list = []
            arr_dates = []
            years_custom = {}
            year_c_values = []
            numeromaximo = []
            max_num = 0
            min_num = 0
            media_temp = 0
            class_one = 0
            class_two = 0
            class_three = 0
            class_four = 0
            classes = 5
            mediana = []
            id_path = request.POST.get('id_route', "None")
            # url = 'http://www.conapo.gob.mx/work/models/CONAPO/Marginacion/Datos_Abiertos/Entidad_Federativa/Base_Indice_de_marginacion_estatal_90-15.csv'
            if id_path not in "None":
                # response = urllib2.urlopen(url)
                # cr = csv.reader(response)
                site1 = Site.objects.get(id=1).domain
                response = urllib2.urlopen(site1+'uploaded/gov2030/agenda2030.json')
                agend23 = json.load(response)
                for ag23 in agend23:
                    if int(ag23["ID"]) == int(id_path):
                        next_year = 0
                        field_orentation = ag23["ORIENTACION_PERIODO"]
                        field_dowload = ag23["DESCARGABLE"]
                        field_key = ag23["CAMPO_CLV"]
                        field_theming = ag23["CAMPO_TEMATIZADOR"]
                        field_time_frame = ag23["CAMPO_NOM_PERIODO"]
                        field_nivel = ag23["NIVEL"]
                        field_period = ag23["PERIODO"]
                        field_indicator = ag23["NOMBRE_INDICADOR"]
                        field_tematic = ag23["TEMATICA"]
                        field_source = ag23["FUENTE"]
                        field_csv = ag23["CSV"]
                        if field_orentation == "horizontal":
                            fields_peridos = field_period.split(",")
                        j = urllib2.urlopen(site1+'uploaded/gov2030/'+field_dowload)
                        j_obj = json.load(j)
                        for js_in in j_obj:
                            if field_orentation == "vertical":
                                if "-" in field_period:
                                    period_temp = field_period.split("-")
                                    period_start = period_temp[0]
                                    next_year = int(period_start)
                                    period_end = period_temp[1]
                                    diference_period = int(period_end) - int(period_start)
                                    for x in xrange(int(diference_period)):
                                        if years_custom.has_key(next_year)!=True:
                                            years_custom[next_year] = js_in[field_key]
                                            year_c_values.append(next_year)
                                        numeromaximo = numeromaximo + [js_in[field_theming]]
                                        next_year = int(next_year) + 1
                                        if int(next_year) == int(period_end):
                                            break
                                else:
                                    if years_custom.has_key(js_in[field_time_frame] )!=True:
                                        years_custom[js_in[field_time_frame]] = js_in[field_key]
                                        year_c_values.append(js_in[field_time_frame])
                                    numeromaximo = numeromaximo + [js_in[field_theming]]

                            else:
                                for period in fields_peridos:
                                    period_without_space = period.replace(" ","")
                                    if years_custom.has_key(period_without_space)!=True:
                                        years_custom[period_without_space] = js_in[field_key]
                                        year_c_values.append(period)
                                    theming_period = field_theming+""+period_without_space
                                    numeromaximo = numeromaximo + [js_in[theming_period]]

                for year in years_custom:
                    y_dates = {}
                    for js_in in j_obj:
                        if field_orentation == "vertical":
                            if(js_in[field_time_frame]==year):
                                y_dates[js_in[field_key]] = js_in[field_theming]
                        else:
                            period_without_space = year.replace(" ","")
                            theming_period = field_theming+""+period_without_space
                            y_dates[js_in[field_key]] = js_in[theming_period]

                    arr_dates.append(y_dates)

                max_num = max(numeromaximo)
                min_num = min(numeromaximo)
                media_temp = (max_num-min_num)/classes
                class_one = min_num+media_temp
                mediana.append(class_one)
                class_two = class_one+media_temp
                mediana.append(class_two)
                class_three = class_two+media_temp
                mediana.append(class_three)
                class_four = class_three+media_temp
                mediana.append(class_four)

                data_list.append(arr_dates)
                data_list.append(year_c_values)
                data_list.append(field_nivel)
                data_list.append(mediana)
                data_list.append(field_indicator)
                data_list.append(field_theming)
                data_list.append(field_tematic)
                data_list.append(field_source)
                data_list.append(field_csv)

        except KeyError, e:
            print 'I got a KeyError - reason "%s"' % str(e)
        except IndexError, e:
            print 'I got an IndexError - reason "%s"' % str(e)
        return HttpResponse(json.dumps(data_list), content_type='application/json' )


def get_csv_trimestral(request):
    if request.is_ajax():
        try:
            field_dowload = ""
            field_theming = ""
            field_key = ""
            field_time_frame = ""
            field_nivel = ""
            field_period = ""
            field_indicator = ""
            field_tematic = ""
            field_source = ""
            fields_peridos = []
            data_list = []
            arr_dates = []
            years_custom = {}
            year_c_values = []
            numeromaximo = []
            max_num = 0
            min_num = 0
            media_temp = 0
            class_one = 0
            class_two = 0
            class_three = 0
            class_four = 0
            classes = 5
            mediana = []
            id_path = request.POST.get('id_route', "None")
            if id_path not in "None":
                site1 = Site.objects.get(id=1).domain
                next_year = 0
                field_dowload = "_trimestre_Indicador_Tasa_de_desocupacion.json"
                field_key = "clv_edo"
                field_theming = "Tasa de desocupacion"
                field_time_frame = "anio"
                field_nivel = "estatal"
                if id_path == 1:
                    field_period = "2005-2016"
                if id_path == 2:
                    field_period = "2005-2016"
                if id_path == 3:
                    field_period = "2005-2015"
                if id_path == 4:
                    field_period = "2005-2015"
                field_indicator = "Tasa de desocupacion"
                field_tematic = "Trabajo decente y crecimiento económico"
                field_source = "DESCARGABLE"
                field_dowload = id_path+""+field_dowload

                j = urllib2.urlopen(site1+'uploaded/gov2030/'+field_dowload)
                j_obj = json.load(j)
                for js_in in j_obj:
                    if "-" in field_period:
                        period_temp = field_period.split("-")
                        period_start = period_temp[0]
                        next_year = int(period_start)
                        period_end = period_temp[1]
                        diference_period = int(period_end) - int(period_start)
                        for x in xrange(int(diference_period)):
                            if years_custom.has_key(next_year)!=True:
                                years_custom[next_year] = js_in[field_key]
                                year_c_values.append(next_year)
                            numx = float(js_in[field_theming])
                            numeromaximo = numeromaximo + numx
                            next_year = int(next_year) + 1
                            if int(next_year) == int(period_end):
                                break
                    else:
                        if years_custom.has_key(js_in[field_time_frame] )!=True:
                            years_custom[js_in[field_time_frame]] = js_in[field_key]
                            year_c_values.append(js_in[field_time_frame])
                        numeromaximo = numeromaximo + [js_in[field_theming]]

                for year in years_custom:
                    y_dates = {}
                    for js_in in j_obj:

                        if(js_in[field_time_frame]==year):
                            y_dates[js_in[field_key]] = js_in[field_theming]
                    arr_dates.append(y_dates)

                max_num = max(numeromaximo)
                min_num = min(numeromaximo)
                media_temp = (max_num-min_num)/classes
                class_one = min_num+media_temp
                mediana.append(class_one)
                class_two = class_one+media_temp
                mediana.append(class_two)
                class_three = class_two+media_temp
                mediana.append(class_three)
                class_four = class_three+media_temp
                mediana.append(class_four)

                data_list.append(arr_dates)
                data_list.append(year_c_values)
                data_list.append(field_nivel)
                data_list.append(mediana)
                data_list.append(field_indicator)
                data_list.append(field_theming)
                data_list.append(field_tematic)
                data_list.append(field_source)


        except KeyError, e:
            print 'I got a KeyError - reason "%s"' % str(e)
        except IndexError, e:
            print 'I got an IndexError - reason "%s"' % str(e)
        return HttpResponse(json.dumps(data_list), content_type='application/json' )


#################################################
# Funciones  y vistas para el creador de estilos
#################################################
def sld_schema():
    # Generate SLD schema (copy from python SLD)
    localschema = NamedTemporaryFile(delete=False)
    dir = os.path.join(settings.PROJECT_ROOT, "uploaded")
    localschema_backup_path = '%s/SLD-backup.xsd' % dir  # This line is reason for copy, we need another ubication
    try:
        localschema_backup = open(localschema_backup_path, 'rb')
    except IOError:
        localschema_backup = open(localschema_backup_path, 'wb')

        schema_url = 'http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd'
        resp = urlopen(schema_url)
        localschema_backup.write(resp.read())
        resp.close()
        localschema_backup.close()
        localschema_backup = open(localschema_backup_path, 'rb')

    localschema.write(localschema_backup.read())
    localschema.close()
    localschema_backup.close()

    localschema = open(localschema.name, 'rt')
    StyledLayerDescriptor._schemadoc = parse(localschema)
    localschema.close()

    StyledLayerDescriptor._cached_schema = localschema.name


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


# Obtiene el tipo de geometria de la capa
def getGeomType(request):
    if request.is_ajax():
        typename = request.POST['typename']
        name = typename.split(':')[1]
        geom_type_sql = 'SELECT ST_GeometryType(the_geom) FROM "%s" limit 1;' % name

        try:
            db = ogc_server_settings.datastore_db
            conn = psycopg2.connect(
                "dbname='" +
                db['NAME'] +
                "' user='" +
                db['USER'] +
                "'  password='" +
                db['PASSWORD'] +
                "' port=" +
                db['PORT'] +
                " host='" +
                db['HOST'] +
                "'")

            cur = conn.cursor()
            cur.execute(geom_type_sql)
            geom_type = cur.fetchone()[0]
            conn.commit()
            conn.close()

        except Exception as e:
            print "Error getting geometry type: %s" % e
            conn.close()

        cat = cat_connect()
        layer_styles = []
        gslayer = cat.get_layer(typename)
        def_style = gslayer.default_style.name
        for e in gslayer._get_alternate_styles():
            layer_styles.append(e.name)

        result_dict = {'geom_type':geom_type, 'layer_styles':layer_styles, 'default_style':def_style}

        return HttpResponse(json.dumps(result_dict), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")


def createSLD_GS(style_name, mysld, typename):
    # Create and assign SLD in GS
    try:
        style_noenc = style_name
        style_name = style_name.encode('utf-8')
        cat = cat_connect()
        gslayer = cat.get_layer(typename)
        cat.create_style(style_name, mysld.as_sld(), overwrite=True, workspace='geonode')
        print gslayer.default_style.name
        if style_name != gslayer.default_style.name:
            curr_styles = gslayer._get_alternate_styles()
            curr_styles.append(cat.get_style(style_noenc))
            gslayer._set_alternate_styles(curr_styles)
        cat.save(gslayer)
        cat.reload()
    except Exception as e:
        cat.reload()
        print "Error creating SLD in geoserver: %s" % e


# Create the SLD structure for categorized
def sld_cat_body(layer_name, data_attr, style_data, geom_type):
    mysld = StyledLayerDescriptor()
    nl = mysld.create_namedlayer(layer_name)
    ustyle = nl.create_userstyle()
    fts = ustyle.create_featuretypestyle()

    if geom_type == 'ST_MultiPolygon':
        for i, e in enumerate(style_data):
            if i < len(style_data):
                fts.create_rule(e[3], PolygonSymbolizer)
                fts.Rules[i].create_filter(data_attr, '==', e[2])

                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.Fill.CssParameters[0].Value = e[0]
                if str(e[1]) != 'undefined':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.Fill.create_cssparameter('fill-opacity', str(e[1]))

                if e[4][0]:
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.Stroke.CssParameters[
                        0].Value = e[4][0]
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.Stroke.CssParameters[
                        1].Value = e[4][2]
                    if str(e[4][1]) != 'undefined':
                        mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.Stroke.create_cssparameter('stroke-opacity', e[4][1])

                    if e[4][3] != 'undefined':
                        mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.Stroke.create_cssparameter(
                            'stroke-dasharray', e[4][3])
                else:
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.__delattr__('Stroke')

    elif geom_type == 'ST_Point' or geom_type== 'ST_MultiPoint':
        for i, e in enumerate(style_data):
            if i < len(style_data):
                fts.create_rule(e[3], PointSymbolizer)
                fts.Rules[i].create_filter(data_attr, '==', e[2])

                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Size = e[5][1]
                if e[5][0] != 'rectangle':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.WellKnownName = e[5][0]
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.Fill.CssParameters[0].Value = e[
                    0]
                if str(e[1]) != 'undefined':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.Fill.create_cssparameter(
                        'fill-opacity', str(e[1]))
                if e[4][0]:
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.create_stroke()
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter('stroke', e[4][0])
                    if str(e[4][2]) != 'undefined':
                        mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter('stroke-width', e[4][2])
                    if str(e[4][1]) != 'undefined':
                        mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter(
                            'stroke-opacity', e[4][1])
                    if e[4][3] != 'undefined':
                        mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter(
                            'stroke-dasharray', e[4][3])
    elif geom_type == 'ST_MultiLineString':
        for i, e in enumerate(style_data):
            if i < len(style_data):
                fts.create_rule(e[3], LineSymbolizer)
                fts.Rules[i].create_filter(data_attr, '==', e[2])

                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].LineSymbolizer.Stroke.CssParameters[
                    0].Value = e[4][0]
                if str(e[4][2]) != 'undefined':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].LineSymbolizer.Stroke.create_cssparameter('stroke-width', e[4][2])
                if str(e[4][1]) != 'undefined':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].LineSymbolizer.Stroke.create_cssparameter('stroke-opacity', e[4][1])
                if e[4][3] != 'undefined':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].LineSymbolizer.Stroke.create_cssparameter(
                        'stroke-dasharray', e[4][3])
    else:
        print "Tipo de geometria no identificado: %s" % geom_type
        return None
    return mysld


# Vistas del creador de estilos
def symbol(request):
    if request.is_ajax():
        cat_dict = {}
        query_data = json.loads(request.POST['layer_data'])
        layer_name = query_data['layer_name'].lower()
        typename = query_data['typename']
        fill_color = query_data['fill_color']
        fill_opacity = query_data['fill_opacity']
        geom_type = query_data['geom_type']
        style_name = query_data['style_name']
        stroke = None

        if 'stroke' in query_data:
            stroke = query_data['stroke']
            stroke_width = query_data['stroke_width']
            stroke_type = query_data['stroke_type']
            stroke_opacity = query_data['stroke_opacity']

        sld_schema()
        # Create the SLD structure
        mysld = StyledLayerDescriptor()
        nl = mysld.create_namedlayer(layer_name)
        ustyle = nl.create_userstyle()
        fts = ustyle.create_featuretypestyle()

        if geom_type == 'ST_MultiPolygon':
            fts.create_rule('symbol', PolygonSymbolizer)

            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PolygonSymbolizer.Fill.CssParameters[0].Value = fill_color
            if str(fill_opacity) != 'undefined':
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PolygonSymbolizer.Fill.create_cssparameter('fill-opacity', str(fill_opacity))

            if stroke:
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PolygonSymbolizer.Stroke.CssParameters[0].Value = stroke
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PolygonSymbolizer.Stroke.CssParameters[1].Value = stroke_width
                if str(stroke_opacity) != 'undefined':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PolygonSymbolizer.Stroke.create_cssparameter('stroke-opacity', str(stroke_opacity))

                if stroke_type == 'dash1':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PolygonSymbolizer.Stroke.create_cssparameter(
                        'stroke-dasharray', '5 2')
                elif stroke_type == 'dash2':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PolygonSymbolizer.Stroke.create_cssparameter(
                        'stroke-dasharray', '7 2 3 2')
            else:
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PolygonSymbolizer.__delattr__('Stroke')
        elif geom_type == 'ST_Point' or geom_type== 'ST_MultiPoint':
            point_type = query_data['point_type']
            point_size = query_data['point_size']

            fts.create_rule('symbol', PointSymbolizer)

            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PointSymbolizer.Graphic.Size = point_size
            if point_type != 'rectangle':
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PointSymbolizer.Graphic.Mark.WellKnownName = point_type
            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PointSymbolizer.Graphic.Mark.Fill.CssParameters[
                0].Value = fill_color
            if str(fill_opacity) != 'undefined':
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PointSymbolizer.Graphic.Mark.Fill.create_cssparameter(
                    'fill-opacity', str(fill_opacity))
            if stroke:
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PointSymbolizer.Graphic.Mark.create_stroke()
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter(
                    'stroke', stroke)
                if stroke_width != 'undefined':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter(
                        'stroke-width', stroke_width)
                if str(stroke_opacity) != 'undefined':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter(
                        'stroke-opacity', str(stroke_opacity))
                if stroke_type == 'dash1':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter(
                        'stroke-dasharray', '5 2')
                elif stroke_type == 'dash2':
                    mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter(
                        'stroke-dasharray', '7 2 3 2')
        elif geom_type == 'ST_MultiLineString':
            fts.create_rule('symbol', LineSymbolizer)

            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].LineSymbolizer.Stroke.CssParameters[
                0].Value = stroke
            if stroke_width != 'undefined':
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].LineSymbolizer.Stroke.create_cssparameter(
                    'stroke-width', stroke_width)
            if str(stroke_opacity) != 'undefined':
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].LineSymbolizer.Stroke.create_cssparameter(
                    'stroke-opacity', str(stroke_opacity))
            if stroke_type == 'dash1':
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].LineSymbolizer.Stroke.create_cssparameter(
                    'stroke-dasharray', '5 2')
            elif stroke_type == 'dash2':
                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[0].LineSymbolizer.Stroke.create_cssparameter(
                    'stroke-dasharray', '7 2 3 2')
        else:
            print "Tipo de geometria no identificado: %s" % geom_type
            return HttpResponse(json.dumps({'NoIdentificado': 'Tipo de geometria no identificada'}), content_type="application/json")

        createSLD_GS(style_name, mysld, typename)

        return HttpResponse(json.dumps(cat_dict), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")


def categorized(request):
    if request.is_ajax():
        result = {}

        query_data = json.loads(request.POST['layer_data'])
        layer_name = query_data['layer_name'].lower()
        typename = query_data['typename']
        name = typename.split(':')[1]
        data_attr = query_data['data_attr']

        if 'clasify' in query_data:
            # Calculate categories for SLD
            qvalues = []
            query_sql = 'SELECT DISTINCT "%s" FROM %s WHERE "%s" IS NOT NULL ORDER BY "%s" ASC' % (
                data_attr, name, data_attr, data_attr)

            try:
                db = ogc_server_settings.datastore_db
                conn = psycopg2.connect(
                    "dbname='" +
                    db['NAME'] +
                    "' user='" +
                    db['USER'] +
                    "'  password='" +
                    db['PASSWORD'] +
                    "' port=" +
                    db['PORT'] +
                    " host='" +
                    db['HOST'] +
                    "'")

                cur = conn.cursor()
                cur.execute(query_sql)
                for r in cur.fetchall():
                    qvalues.append(r[0])
                conn.commit()
                conn.close()

            except Exception as e:
                print "Error querying table data: %s" % e
                conn.close()

            if len(qvalues)>50:
                result = {'exceeded': 'Mas de 50 categorias'}
                return HttpResponse(json.dumps(result), content_type="application/json")
            else:
                fill_color = []
                for i in range(len(qvalues)):
                    r = lambda: random.randint(0, 255)
                    hex_color = '#%02X%02X%02X' % (r(), r(), r())
                    fill_color.append(hex_color)

                result= {
                    'values': qvalues,
                    'fill_color': fill_color
                }
                return HttpResponse(json.dumps(result), content_type="application/json")
        else:
            style_data = query_data['style_data']
            geom_type = query_data['geom_type']
            style_name = query_data['style_name']

            sld_schema()
            mysld = sld_cat_body(layer_name, data_attr, style_data, geom_type)
            createSLD_GS(style_name, mysld, typename)

            return HttpResponse(json.dumps(result), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")


def graduated(request):
    if request.is_ajax():
        cat_dict = {}
        query_data = json.loads(request.POST['layer_data'])
        layer_name = query_data['layer_name'].lower()
        typename = query_data['typename']
        name = typename.split(':')[1]

        # ramp_colors = query_data['ramp_colors']
        data_attr = query_data['data_attr']
        stats_method = query_data['stats_method']
        num_classes = int(query_data['num_classes'])

        if 'clasify' in query_data:
            # Calculate percentiles for SLD
            qvalues = []
            min_max = []
            query_sql = 'SELECT DISTINCT "%s" FROM %s WHERE "%s" IS NOT NULL ORDER BY "%s" ASC' % (
                data_attr, name, data_attr, data_attr)
            min_sql = 'SELECT MIN(NULLIF("%s", 0)) FROM %s' % (data_attr, name)
            max_sql = 'SELECT MAX("%s") FROM %s' % (data_attr, name)

            try:
                db = ogc_server_settings.datastore_db
                conn = psycopg2.connect(
                    "dbname='" +
                    db['NAME'] +
                    "' user='" +
                    db['USER'] +
                    "'  password='" +
                    db['PASSWORD'] +
                    "' port=" +
                    db['PORT'] +
                    " host='" +
                    db['HOST'] +
                    "'")

                cur = conn.cursor()
                cur.execute(query_sql)
                for r in cur.fetchall():
                    qvalues.append(r[0])
                cur.execute(min_sql)
                min_max.append(cur.fetchone()[0])
                cur.execute(max_sql)
                min_max.append(cur.fetchone()[0])
                conn.commit()
                conn.close()

            except Exception as e:
                print "Error querying table data: %s" % e
                conn.close()

            v = []
            if stats_method == 'percentil':
                a = np.array(qvalues)
                div_factor= round(float(100) / num_classes, 2)

                for i in range(num_classes+1):
                    if i == 0:
                        v.append(min_max[0])
                    elif i == num_classes:
                        v.append(min_max[1])
                    else:
                        v.append(np.percentile(a, div_factor*i))
            elif stats_method == 'interval':
                div_factor = (min_max[1] - min_max[0]) / num_classes

                for i in range(num_classes+1):
                    if i == 0:
                        v.append(min_max[0])
                    elif i == num_classes:
                        v.append(min_max[1])
                    else:
                        v.append(min_max[0] + div_factor*i)
            else:
                return HttpResponse(json.dumps({'Metodo': 'No implementado'}), content_type="application/json")

            result = {'values': v}
            return HttpResponse(json.dumps(result), content_type="application/json")
        else:
            v = query_data['style_data']
            geom_type = query_data['geom_type']
            style_name = query_data['style_name']
            sld_schema()

            # Create the SLD structure
            mysld = StyledLayerDescriptor()
            nl = mysld.create_namedlayer(layer_name)
            ustyle = nl.create_userstyle()
            fts = ustyle.create_featuretypestyle()

            # Auxiliar SLD
            sldb = StyledLayerDescriptor()
            nlb = sldb.create_namedlayer('Dummy-lyr')
            ustyleb = nlb.create_userstyle()
            ftsb = ustyleb.create_featuretypestyle()

            if geom_type == 'ST_MultiPolygon':
                for i, e in enumerate(v):
                    if i < len(v):
                        fts.create_rule(e[2], PolygonSymbolizer)
                        fts.Rules[i].create_filter(data_attr, '>=', e[1][0])

                        ftsb.create_rule('Dummy rule' + str(i + 1), PolygonSymbolizer)

                        ftsb.Rules[i].create_filter(data_attr, '<',
                                                    str(e[1][1]) if i < len(v) - 1 else str(float(e[1][1])+0.0001))

                        fts.Rules[i].Filter = Filter(fts.Rules[i]) + Filter(ftsb.Rules[i])

                        mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.Fill.CssParameters[0].Value = \
                            e[0][0]
                        if e[0][1] != 'undefined':
                            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.Fill.create_cssparameter(
                            'fill-opacity', e[0][1])
                        if e[3][0]:
                            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.Stroke.CssParameters[
                                0].Value = e[3][0]
                            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.Stroke.CssParameters[
                                1].Value = e[3][2]
                            if e[3][1] != 'undefined':
                                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.Stroke.create_cssparameter(
                                'stroke-opacity', e[3][1])

                            if e[3][3] != 'undefined':
                                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.Stroke.create_cssparameter('stroke-dasharray', e[3][3])
                        else:
                            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PolygonSymbolizer.__delattr__('Stroke')
            elif geom_type == 'ST_Point' or geom_type== 'ST_MultiPoint':
                for i, e in enumerate(v):
                    if i < len(v):
                        fts.create_rule(e[2], PointSymbolizer)
                        fts.Rules[i].create_filter(data_attr, '>=', e[1][0])

                        ftsb.create_rule('Dummy rule' + str(i + 1), PointSymbolizer)

                        ftsb.Rules[i].create_filter(data_attr, '<',
                                                    str(e[1][1]) if i < len(v) - 1 else str(float(e[1][1]) + 0.0001))

                        fts.Rules[i].Filter = Filter(fts.Rules[i]) + Filter(ftsb.Rules[i])

                        mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Size = e[4][1]
                        if e[4][0] != 'rectangle':
                            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.WellKnownName = e[4][0]
                        mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.Fill.CssParameters[
                            0].Value = e[0][0]
                        if e[0][1] != 'undefined':
                            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.Fill.create_cssparameter(
                                'fill-opacity', e[0][1])
                        if e[3][0]:
                            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.create_stroke()
                            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[
                                i].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter('stroke', e[3][0])

                            if str(e[3][2]) != 'undefined':
                                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[
                                    i].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter('stroke-width', e[3][2])

                            if e[3][1] != 'undefined':
                                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter(
                                    'stroke-opacity', e[3][1])

                            if e[3][3] != 'undefined':
                                mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].PointSymbolizer.Graphic.Mark.Stroke.create_cssparameter(
                                    'stroke-dasharray', e[3][3])
            elif geom_type == 'ST_MultiLineString':
                for i, e in enumerate(v):
                    if i < len(v):
                        fts.create_rule(e[2], LineSymbolizer)
                        fts.Rules[i].create_filter(data_attr, '>=', e[1][0])

                        ftsb.create_rule('Dummy rule' + str(i + 1), LineSymbolizer)

                        ftsb.Rules[i].create_filter(data_attr, '<',
                                                    str(e[1][1]) if i < len(v) - 1 else str(float(e[1][1])+0.0001))

                        fts.Rules[i].Filter = Filter(fts.Rules[i]) + Filter(ftsb.Rules[i])

                        mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].LineSymbolizer.Stroke.CssParameters[
                            0].Value = e[3][0]
                        if e[3][2] != 'undefined':
                            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].LineSymbolizer.Stroke.create_cssparameter(
                                'stroke-width', e[3][2])
                        if e[3][1] != 'undefined':
                            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].LineSymbolizer.Stroke.create_cssparameter(
                            'stroke-opacity', e[3][1])
                        if e[3][3] != 'undefined':
                            mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules[i].LineSymbolizer.Stroke.create_cssparameter('stroke-dasharray', e[3][3])
            else:
                print "Tipo de geometria no identificado: %s" % geom_type
                return HttpResponse(json.dumps({'NoIdentificado': 'Tipo de geometria no identificada'}),
                                    content_type="application/json")
            createSLD_GS(style_name, mysld, typename)

            return HttpResponse(json.dumps(cat_dict), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")


def edit_style(request):
    if request.is_ajax():
        query_data = json.loads(request.POST['layer_data'])
        style_name = query_data['style_name']
        geom_type = query_data['geom_type']
        rules = []
        cat = cat_connect()
        style = cat.get_style(style_name, workspace='geonode')
        dir = os.path.join(settings.PROJECT_ROOT, "uploaded")
        sld_path = '%s/styleTmp.sld' % dir

        with open(sld_path, 'w+') as outfile:
            #outfile.write(gslayer.default_style.sld_body)
            outfile.write(style.sld_body)

        if style:
            sld_schema()
            mysld = StyledLayerDescriptor(sld_path)

            sld_rules = mysld.NamedLayer.UserStyle.FeatureTypeStyle.Rules
            rules_len = len(sld_rules)

            not_cat = False
            for rule in sld_rules:
                dict = {}
                dict['legend'] = rule.Title
                if rules_len > 1 and geom_type != 'ST_Line':
                    sld_attr = None
                    if not not_cat:
                        try:
                            sld_value = rule.Filter.__getattr__('PropertyIsEqualTo').Literal
                            sld_attr = rule.Filter.__getattr__('PropertyIsEqualTo').PropertyName
                            dict['attribute'] = sld_attr
                            dict['value'] = sld_value
                            dict['not_cat'] = not_cat
                        except:
                            print 'Not categorized'
                            not_cat = True

                    if not sld_attr:
                        try:
                            sld_attr = rule.Filter._node.getchildren()[0].getchildren()[0].getchildren()[0].text
                            minval = rule.Filter._node.getchildren()[0].getchildren()[0].getchildren()[1].text
                            maxval = rule.Filter._node.getchildren()[0].getchildren()[1].getchildren()[1].text
                            dict['attribute'] = sld_attr
                            dict['min_value'] = minval
                            dict['max_value'] = maxval
                            dict['not_cat'] = not_cat
                        except:
                            print 'Not graduated'
                else:
                    dict['unique'] = True

                stroke_cssparams = None
                if geom_type == 'ST_MultiPolygon':
                    fill_cssparams = rule.PolygonSymbolizer.Fill.CssParameters
                    if rule.PolygonSymbolizer.Stroke:
                        stroke_cssparams = rule.PolygonSymbolizer.Stroke.CssParameters
                    for param in fill_cssparams:
                        dict[param.Name] = param.Value
                elif geom_type == 'ST_Point' or geom_type== 'ST_MultiPoint':
                    if rule.PointSymbolizer.Graphic.Mark.WellKnownName:
                        dict['point_type'] = rule.PointSymbolizer.Graphic.Mark.WellKnownName.lower()
                    else:
                        dict['point_type'] = 'rectangle'
                    fill_cssparams = rule.PointSymbolizer.Graphic.Mark.Fill.CssParameters
                    if rule.PointSymbolizer.Graphic.Mark.Stroke:
                        stroke_cssparams = rule.PointSymbolizer.Graphic.Mark.Stroke.CssParameters
                    if rule.PointSymbolizer.Graphic.Size:
                        dict['point_size'] = rule.PointSymbolizer.Graphic.Size
                    for param in fill_cssparams:
                        dict[param.Name] = param.Value
                elif geom_type == 'ST_MultiLineString':
                    stroke_cssparams = rule.LineSymbolizer.Stroke.CssParameters
                else:
                    print "Tipo de geometria no identificado: %s" % geom_type
                    return HttpResponse(json.dumps({'NoImp': 'Tipo no implementado'}), content_type="application/json")

                if stroke_cssparams:
                    for param in stroke_cssparams:
                        dict[param.Name] = param.Value

                    if 'stroke-dasharray' in dict:
                        st_type = dict['stroke-dasharray'].split()

                        if len(st_type) == 2:
                            dash = '5 2'
                        else:
                            dash = '7 2 3 2'

                        dict['stroke-dasharray'] = dash
                rules.append(dict)

            return HttpResponse(json.dumps(rules), content_type="application/json")
        else:
            return None
    else:
        return HttpResponse("Not ajax request")
