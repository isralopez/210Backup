# -*- encoding: utf-8 -*-
"""farming_siap views."""
# imports
import urllib2
import psycopg2
import json
import tempfile

# django
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponseServerError
from django.template import RequestContext
from django.conf import settings
from django.template.loader import render_to_string
from django.contrib.sites.models import Site
from django.db import connections

# geonode
from geonode.geoserver.helpers import ogc_server_settings

table_crop = "trd_produccion_agricola"
table_valor = "trd_p_a_valor_produccion_nac"

"""
este metodo es para el programa daca de la doctora Regina
"""
def daca(request, template="arecedpoliline.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

"""
este metodo es para los inmigrantes que van de mixico a EU de la doctora Regina
"""
def immigrant(request, template="MarkerDataLayerImmigrate.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

"""
este metodo es para el programa daca de la doctora Regina
"""
def immigrant_page(request, template="inmigrant_pages.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

"""
este metodo es para el programa daca de la doctora Regina
"""
def mapa1(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa2(request, template="mapa2.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa3(request, template="mapa3.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa4(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa5(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa6(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa7(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa8(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa9(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa10(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa11(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa12(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa13(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa14(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa15(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa16(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa17(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa18(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa19(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa20(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa21(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa22(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa23(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa24(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa25(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa26(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa27(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa28(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa29(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa30(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa31(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa32(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa33(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

def mapa34(request, template="mapa1.html"):
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

"""
trae los datos cultivos del SIAP HOME
"""
def farming(request, template="farmingVanillaa.html"):
    """Return a siap db list"""
    site = Site.objects.get(id=1)
    cultivos = []
    ciclos = []
    modalidades = []
    edo = "99"
    year = "2017"
    # cultivos = get_siap_crops(table_crop, republic(edo), year, clvcultivo, cultivo)
    ciclos = get_siap_crops(table_crop, republic(edo), year, "clvciclo", "ciclo")
    modalidades = get_siap_crops(table_crop, republic(edo), year, "clvmodalidad", "modalidad")
    return render_to_response(template, RequestContext(request, {'crops': cultivos, 'site':site, 'ciclos':ciclos, 'modalidades':modalidades}))

"""
trae los datos cultivos del SIAP
"""
def getCropList(request):
    if request.is_ajax():
        try:
            data = []
            data_tematizer = []
            data_clases = []
            data_tema_temp = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                edo = query_data['edo']
                cicle = query_data['cicle']
                modal = query_data['modal']
                data = get_siap_crops_cicle(table_crop, republic(edo), year, cicle, modal)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")
"""
trae los datos cultivos del SIAP check
"""
def getCropSiap(request):
    if request.is_ajax():
        try:
            data = []
            data_tematizer = []
            data_clases = []
            data_tema_temp = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                crop = query_data['crop']
                edo = query_data['edo']
                variable = query_data['variable']
                ciclo = query_data['ciclo']
                modal = query_data['modalidad']
                data = get_siap_by_crop(table_crop, crop, year, republic(edo), ciclo, modal)
                data_tema_temp = tematizerCrop(table_crop, crop, year, republic(edo), variable, True, ciclo, modal)
                data_tematizer = data_tema_temp[0]
                data_clases = data_tema_temp[1]
                data.append(data_tematizer)
                data.append(data_clases)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")
"""
Este metodo es para obtener los cultivos del SIAP
"""
def get_siap_crops(name_table, edo, year, field_id, field_value):
    query_build = []
    data = []
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
        query = "select %s, %s from %s where anio = '%s' %s  group by  %s, %s order by %s;" % (field_id, field_value, name_table, year,edo, field_id, field_value, field_value)
        cur.execute(query)
        query_build = cur.fetchall()
        data.append(query_build)
        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return query_build

"""
Este metodo es para obtener los cultivos del SIAP anivel nacional
"""
def get_siap_by_crop_edo(name_table, crop, year, edo, ciclo, modal):
    query_build = []
    data = []
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
        query = "select '' as sq, sum(CAST(cosechada as float)), sum(CAST(valor as float))," \
            + " edo, avg(CAST(rendimiento as float)), clvedo from %s " % name_table \
            + " where clvcultivo = '%s' " % crop \
            + " and anio = '%s' " % year \
            + " and ciclo = '%s' " % ciclo \
            + " and modalidad = '%s' " % modal \
            + " %s " % edo \
            + " group by sq, edo, clvedo; "

        cur.execute(query)
        query_build = cur.fetchall()
        data.append(query_build)
        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return data


"""
Este metodo es para obtener los cultivos del SIAP anivel municipal estatal
"""
def get_siap_by_crop(name_table, crop, year, edo, ciclo, modal):
    query_build = []
    data = []
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
        query = "select mun, sum(CAST(cosechada as float)), sum(CAST(valor as float))," \
            + " edo, avg(CAST(rendimiento as float)), location_code from %s " % name_table \
            + " where clvcultivo = '%s' " % crop \
            + " and anio = '%s' " % year \
            + " and ciclo = '%s' " % ciclo \
            + " and modalidad = '%s' " % modal \
            + " %s " % edo \
            + " group by mun, edo, location_code; "

        cur.execute(query)
        query_build = cur.fetchall()
        data.append(query_build)
        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return data


"""
Este metodo es para obtener la tematizacion de los municipios para producción Agricola de la bd SIAP a nivel nacional
"""
def tematizerCrop(name_table, crop, year, edo, variable, is_new_year, ciclo, modal):
    try:
        data = []
        data_tematizer = []
        max_num = 0
        min_num = 0
        media_temp = 0
        class_one = 0
        class_two = 0
        class_three = 0
        class_four = 0
        classes = 5
        mediana = []
        quantiles = []
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

        if is_new_year:
            new_year = " and anio = '%s' " % year
        else:
            new_year = ""

        if variable in "rendimiento":
            query_tematizer = "select anio, avg(rendimiento ::float), clvedo " \
                + " from %s " % name_table \
                + " where clvcultivo = '%s' " % crop \
                + " and anio = '%s' " % year \
                + " and ciclo = '%s' " % ciclo \
                + " and modalidad = '%s' " % modal \
                + " %s " % edo \
                + " group by anio, clvedo " \
                + " order by avg(rendimiento::float); "

            query_tematizer_quantyles = "select avg(rendimiento ::float) " \
                + " from %s " % name_table \
                + " where clvcultivo = '%s' " % crop \
                + " and ciclo = '%s' " % ciclo \
                + " and modalidad = '%s' " % modal \
                + " %s " % edo \
                + " group by anio, clvedo " \
                + " order by avg(rendimiento::float) asc; "
        else:
            query_tematizer = "select anio, sum(%s ::float), clvedo " % variable\
                + " from %s " % name_table \
                + " where clvcultivo = '%s' " % crop \
                + " and anio = '%s' " % year \
                + " and ciclo = '%s' " % ciclo \
                + " and modalidad = '%s' " % modal \
                + " %s " % edo \
                + " group by anio, clvedo " \
                + " order by sum(%s::float); " % variable

            query_tematizer_quantyles = "select min(%s ::float), " % variable \
            + " max(%s::float) from %s " % (variable, name_table) \
            + " where clvcultivo = '%s' " % crop \
            + " and ciclo = '%s' " % ciclo \
            + " and modalidad = '%s' " % modal \
            + " %s " % new_year \
            + " %s; " % edo \

        cur.execute(query_tematizer)
        data_tematizer = cur.fetchall()
        cur.execute(query_tematizer_quantyles)
        quantiles = cur.fetchall()

        if data_tematizer:
            if variable in "rendimiento":
                max_num = quantiles[len(quantiles)-1][0]
            else:
                max_num = quantiles[0][1]# quantiles[len(quantiles)-1][0]
            if max_num > 0:
                min_num = quantiles[0][0]
                media_temp = (max_num-min_num)/classes
                class_one = min_num+media_temp
                mediana.append(class_one)
                class_two = class_one+media_temp
                mediana.append(class_two)
                class_three = class_two+media_temp
                mediana.append(class_three)
                class_four = class_three+media_temp
                mediana.append(class_four)
                # tematizer by quantyles
                data.append(data_tematizer)
                data.append(mediana)
        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return data

def republic(edo):
    if edo in "99":
        edo_str = ''
    else:
        edo_str = " and clvedo = '%s' "% edo
    return edo_str

def loc(edo):
    edo_str = " and location_code = '%s' "% edo
    return edo_str

"""
trae los datos cultivos del SIAP para graficarse
"""
def getCropSiapCharts(request):
    if request.is_ajax():
        try:
            data = []
            data_tematizer = []
            data_clases = []
            data_tema_temp = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                crop = query_data['crop']
                edo = query_data['edo']
                variable = query_data['variable']
                ciclo = query_data['ciclo']
                modal = query_data['modalidad']
                data_tema_temp = tematizerCrop(table_crop, crop, year, republic("99"), variable, False, ciclo, modal)
                data_tematizer = data_tema_temp[0]
                data_clases = data_tema_temp[1]
                data.append(data_tematizer)
                data.append(data_clases)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")

"""
Este metodo en especifico solo me trae los datos para formar la grafica de coorelación entre el valor de producción y lo cosechado tomando en cuenta el rendimiento a nivel estatal
"""
def getQueryReturn(request):
    if request.is_ajax():
        try:
            data = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                crop = query_data['crop']
                edo = query_data['edo']
                ciclo = query_data['ciclo']
                modal = query_data['modalidad']
                modalidades = getModalByCropSelected(table_crop, republic(edo), year, "clvmodalidad", "modalidad", crop, ciclo)
                cicles = getCicleByCropSelected(table_crop, republic(edo), year, "clvciclo", "ciclo", crop)
                data.append(modalidades)
                data.append(cicles)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")



"""
Este metodo en especifico solo me trae los datos para formar la grafica de coorelación entre el valor de producción y lo cosechado tomando en cuenta el rendimiento a nivel estatal
"""
def getCorrelationChart(request):
    if request.is_ajax():
        try:
            data = []
            modalidades = []
            cicles = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                crop = query_data['crop']
                edo = query_data['edo']
                ciclo = query_data['ciclo']
                modal = query_data['modalidad']
                data = get_siap_by_crop_edo(table_crop, crop, year, republic(edo), ciclo, modal)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")

"""
trae los datos cultivos del SIAP por el location code
"""
def getCropSiapLocationCode(request):
    if request.is_ajax():
        try:
            data = []
            data_tematizer = []
            data_clases = []
            data_tema_temp = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                crop = query_data['crop']
                clvedo = query_data['clvedo']
                variable = query_data['variable']
                ciclo = query_data['ciclo']
                modal = query_data['modalidad']
                data = get_siap_by_crop(table_crop, crop, year, republic(clvedo), ciclo, modal)
                data_tema_temp = tematizerCropMun(table_crop, crop, year, republic(clvedo), variable, ciclo, modal)
                if data_tema_temp:
                    data_tematizer = data_tema_temp[0]
                    data_clases = data_tema_temp[1]
                    # data.append("")
                    data.append(data_tematizer)
                    data.append(data_clases)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")

"""
Este metodo es para obtener los cultivos del SIAP por un ciclo y modalidad
"""
def get_siap_crops_cicle(name_table, edo, year, cicle, modal):
    query_build = []
    data = []
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
        query = "select clvcultivo, cultivo  from %s where anio = '%s' %s  and ciclo = '%s' and modalidad  = '%s' group by  clvcultivo, cultivo  order by cultivo;" % (name_table, year,edo, cicle, modal)
        cur.execute(query)
        query_build = cur.fetchall()
        data.append(query_build)
        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return query_build



"""
Este metodo es para obtener la tematizacion de los municipios para producción Agricola de la bd SIAP de un solo estado
"""
def tematizerCropMun(name_table, crop, year, edo, variable, ciclo, modal):
    try:
        data = []
        data_tematizer = []
        max_num = 0
        min_num = 0
        media_temp = 0
        class_one = 0
        class_two = 0
        class_three = 0
        class_four = 0
        classes = 5
        mediana = []
        quantiles = []
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

        if variable in "rendimiento":
            query_tematizer = "select anio, avg(rendimiento ::float), location_code " \
                + " from %s " % name_table \
                + " where clvcultivo = '%s' " % crop \
                + " and anio = '%s' " % year \
                + " and ciclo = '%s' " % ciclo \
                + " and modalidad = '%s' " % modal \
                + " %s " % edo \
                + " group by anio, location_code " \
                + " order by avg(rendimiento::float); "
        else:
            query_tematizer = "select anio, sum(%s ::float), location_code " % variable \
                + " from %s " % name_table \
                + " where clvcultivo = '%s' " % crop \
                + " and anio = '%s' " % year \
                + " and ciclo = '%s' " % ciclo \
                + " and modalidad = '%s' " % modal \
                + " %s " % edo \
                + " group by anio, location_code " \
                + " order by sum(%s::float); " % variable

        query_tematizer_quantyles = "select min(%s ::float), " % variable \
            + " max(%s::float) from %s " % (variable,name_table) \
            + " where clvcultivo = '%s' " % crop \
            + " and anio = '%s' " % year \
            + " and ciclo = '%s' " % ciclo \
            + " and modalidad = '%s' " % modal \
            + " %s; " % edo \

        cur.execute(query_tematizer)
        data_tematizer = cur.fetchall()
        cur.execute(query_tematizer_quantyles)
        quantiles = cur.fetchone()

        if data_tematizer:
            max_num = quantiles[1]
            if max_num > 0:
                min_num = quantiles[0]
                media_temp = (max_num-min_num)/classes
                class_one = min_num+media_temp
                mediana.append(class_one)
                class_two = class_one+media_temp
                mediana.append(class_two)
                class_three = class_two+media_temp
                mediana.append(class_three)
                class_four = class_three+media_temp
                mediana.append(class_four)
                # tematizer by quantyles
                data.append(data_tematizer)
                data.append(mediana)
        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return data

"""
actualiza la información de acuerdo a el año seleccionado.
"""
def updateYears(request):
    if request.is_ajax():
        try:
            data_bubble_mun = []
            data = []
            data_tematizer = []
            data_clases = []
            data_tema_temp = []
            data_tematizer_mun = []
            data_clases_mun = []
            data_tema_temp_mun = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                crop = query_data['crop']
                edo = query_data['edo']
                variable = query_data['variable']
                ciclo = query_data['ciclo']
                modal = query_data['modalidad']
                data = get_siap_by_crop_edo(table_crop, crop, year, republic("99"), ciclo, modal)
                data_tema_temp = tematizerCrop(table_crop, crop, year, republic("99"), variable, True, ciclo, modal)
                if data_tema_temp:
                    data_tematizer = data_tema_temp[0]
                    data_clases = data_tema_temp[1]
                    data.append(data_tematizer)
                    data.append(data_clases)
                    if edo != "":
                        data_tema_temp_mun = tematizerCropMun(table_crop, crop, year, republic(edo), variable, ciclo, modal)
                        if data_tema_temp_mun:
                            data_bubble_mun = get_siap_by_crop(table_crop, crop, year, republic(edo), ciclo, modal)
                            data_tematizer_mun = data_tema_temp_mun[0]
                            data_clases_mun = data_tema_temp_mun[1]
                            data.append(data_bubble_mun)
                            data.append(data_tematizer_mun)
                            data.append(data_clases_mun)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")
"""
Este metodo es un select en reversa, trae las modalidades solo del cultivo seleccionado
"""
def getModalByCropSelected(name_table, edo, year, field_id, field_value, crop, ciclo):
    query_build = []
    data = []
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
        query = "select %s, %s from %s where anio = '%s' %s  and clvcultivo = '%s' and ciclo = '%s' group by  %s, %s order by %s;" % (field_id, field_value, name_table, year,edo, crop, ciclo, field_id, field_value, field_value)
        cur.execute(query)
        query_build = cur.fetchall()
        data.append(query_build)
        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return query_build

"""
Este metodo es un select en reversa, trae los ciclos solo del cultivo seleccionado
"""
def getCicleByCropSelected(name_table, edo, year, field_id, field_value, crop):
    query_build = []
    data = []
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
        query = "select %s, %s from %s where anio = '%s' %s  and clvcultivo = '%s' group by  %s, %s order by %s;" % (field_id, field_value, name_table, year,edo, crop, field_id, field_value, field_value)
        cur.execute(query)
        query_build = cur.fetchall()
        data.append(query_build)
        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return query_build

"""
trae los datos iniciales
"""
def resetSIAP(request):
    if request.is_ajax():
        try:
            data = []
            ciclos = []
            modalidades = []
            edo = "99"
            year = "2017"
            ciclos = get_siap_crops(table_crop, republic(edo), year, "clvciclo", "ciclo")
            modalidades = get_siap_crops(table_crop, republic(edo), year, "clvmodalidad", "modalidad")
            data.append(ciclos)
            data.append(modalidades)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")

"""
trae la suma por los municipios
"""
def getSumaryCrop(request):
    if request.is_ajax():
        try:
            data = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                crop = query_data['crop']
                location_code = query_data['location_code']
                ciclo = query_data['ciclo']
                modal = query_data['modalidad']
                data = getSumaryByMun(table_crop, location_code, year, ciclo, modal, crop)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")

"""
Este metodo es un select en reversa, trae los ciclos solo del cultivo seleccionado
"""
def getSumaryByMun(name_table, location_code, year, ciclo, modalidad, crop):
    query_build = []
    data = []
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
        query = "select sum(CAST(sembrada as float)), sum(CAST(cosechada as float)), " \
            + " sum(CAST(columen as float)), sum(CAST(valor as float)), " \
            + " avg(CAST(rendimiento as float)), sum(CAST(siniestrada as float)), " \
            + " avg(CAST(precio as float)), unidad, mun from %s " % name_table \
            + " where clvcultivo = '%s' " % crop \
            + " and ciclo = '%s' " % ciclo \
            + " and modalidad = '%s' " % modalidad \
            + " and anio = '%s' " % year \
            + " and location_code = '%s' " % location_code \
            + " group by unidad, mun; "
        cur.execute(query)
        query_build = cur.fetchall()
        data.append(query_build)
        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return query_build

"""
trae la la información de los cultivos con mayor volumen de producción
"""
def getValorNac(request):
    if request.is_ajax():
        try:
            data = []
            query_data = json.loads(request.POST['query_data'])
            print(query_data)
            if query_data:
                year = query_data['year']
                historic = query_data['historic']
                data = getValueNac(table_valor, year, historic)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")

"""
trae la la información de los cultivos con mayor volumen de producción
"""
def getValueNac(name_table, year, historic):
    query_build = []
    data = []
    try:
        if historic:
            siap_year = "total"
        else:
            siap_year = "siap_"+year

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
        query = "select clvcultivo, %s " % siap_year \
            + " from %s " % name_table \
            + " order by %s desc;" %siap_year
        print(query)
        cur.execute(query)
        query_build = cur.fetchall()
        data.append(query_build)
        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return query_build

"""
Este metodo en especifico solo me trae los datos para formar la grafica de coorelación entre el valor de producción y lo cosechado tomando en cuenta el rendimiento a nivel municipal
"""
def getCorrelationChartMun(request):
    if request.is_ajax():
        try:
            data = []
            modalidades = []
            cicles = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                crop = query_data['crop']
                edo = query_data['edo']
                ciclo = query_data['ciclo']
                modal = query_data['modalidad']
                data = get_siap_by_crop(table_crop, crop, year, republic(edo), ciclo, modal)
            else: 
                print("no mames")
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")

"""
Este metodo en especifico solo me trae los datos para formar la grafica de coorelación entre el valor de producción y lo cosechado tomando en cuenta el rendimiento a nivel municipal
"""
def getTematizerMun(request):
    if request.is_ajax():
        try:
            data = []
            data_tematizer = []
            data_clases = []
            data_tema_temp = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                crop = query_data['crop']
                edo = query_data['edo']
                variable = query_data['variable']
                ciclo = query_data['ciclo']
                modal = query_data['modalidad']
                if edo != "":
                    data_tema_temp_mun = tematizerCropMun(table_crop, crop, year, republic(edo), variable, ciclo, modal)
                    if data_tema_temp_mun:
                        data_tematizer_mun = data_tema_temp_mun[0]
                        data_clases_mun = data_tema_temp_mun[1]
                        data.append(data_tematizer_mun)
                        data.append(data_clases_mun)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")

"""
Este metodo en especifico solo me trae los datos para formar la grafica de coorelación entre el valor de producción y lo cosechado tomando en cuenta el rendimiento a nivel municipal
"""
def getDataExport(request):
    if request.is_ajax():
        try:
            data = []
            data_temp = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                crop = query_data['crop']
                edo = query_data['edo']
                ciclo = query_data['ciclo']
                modal = query_data['modalidad']
                if edo == "99":
                    data_temp = exportData(table_crop, crop, year, edo, ciclo, modal)
                else:
                    data_temp = exportData(table_crop, crop, year, republic(edo), ciclo, modal)
                if data_temp:
                    data.append(data_temp)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")


"""
Este metodo es para obtener la información para exportar en csv
"""
def exportData(name_table, crop, year, edo, ciclo, modal):
    try:
        data = []
        data_csv = []
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

        if edo == "99":
            mun = ""
            edo = ""
        else:
            mun = "mun,"
        query_csv =  "select edo, %s sum(CAST(valor as float)), sum(CAST(cosechada as float)),"% mun \
            + " avg(CAST(rendimiento as float)) from %s " % name_table \
            + " where clvcultivo = '%s' " % crop \
            + " and anio = '%s' " % year \
            + " %s " % edo \
            + " and ciclo = '%s' " % ciclo \
            + " and modalidad = '%s' " % modal \
            + " group by %s edo; " % mun

        print(query_csv)
        cur.execute(query_csv)
        data_csv = cur.fetchall()

        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return data_csv