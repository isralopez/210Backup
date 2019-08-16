# -*- encoding: utf-8 -*-
import psycopg2.extras
import psycopg2
import json
import tempfile

from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render
from django.http import HttpResponseServerError
from django.template import RequestContext
from django.template.loader import render_to_string
from django.contrib.sites.models import Site
from django.db import connections

from geonode.geoserver.helpers import ogc_server_settings

# print pdf
from weasyprint import HTML

db = ogc_server_settings.datastore_db

legal_good = ["La sociedad", "Libertad personal", "La libertad y la seguridad sexual", "El patrimonio", "Otros bienes juridicos afectados", "La vida y la integridad corporal", "La familia"]


def mugs(request, template='mugs_home.html'):
    site = Site.objects.get(id=1)

    return render(request, template, context={'site':site})


def data_sheet(request, template='data_sheet.html'):
    site = Site.objects.get(id=1)
    return render(request, template, context={'site':site})


def compareMugs(request, template='pdf_design.html'):

    return render(request, template, context={})


def export_json_mug(request, template='data/source_mugs.json'):

    sql = """select municipio as source, municipio as target, sum(total::decimal) as value, location_code from trd_mugs
            where year = '2015'
            and clv = '02'
            and good_legal = 'Libertad personal'
            group by source, target, location_code Order By value desc Limit 5"""

    try:
        con = psycopg2.connect(database=db['NAME'], user=db['USER'], password=db['PASSWORD'], port=db['PORT'], host=db['HOST'])
    except:
        print "No!"

    cur = con.cursor()

    try:
        cur.execute(sql)
    except:
        print "Mal!"

    rows = cur.fetchall()

    return render(request, template, context={'rows':rows})

def import_json_mug(request, template='data/target.json'):

    year = request.GET.get('year', '2015')
    code = request.GET.get('code', '1')
    edo = request.GET.get('edo', '99')
    # edo = edo + "%"
    legal = legal_good[int(code)]
    params = {'year': year, 'code': legal, 'edo': edo}

    if edo in '99':
        sql = """select municipio as source, typess as target, sum(total::decimal) as value, location_code as code_mun from trd_mugs
                where year = '%(year)s'
                and good_legal = '%(code)s'
                group by source, target, location_code Order By value desc Limit 10""" % params
    else:
        sql = """select municipio as source, typess as target, sum(total::decimal) as value, location_code as code_mun from trd_mugs
                where year = '%(year)s'
                and good_legal = '%(code)s'
                and clv = '%(edo)s'
                group by source, target, location_code Order By value desc Limit 10""" % params

    try:
        con = psycopg2.connect(database=db['NAME'], user=db['USER'], password=db['PASSWORD'], port=db['PORT'], host=db['HOST'])
    except:
        print "No!"

    cur = con.cursor()

    try:
        cur.execute(sql)
    except:
        print "Mal!"

    rows = cur.fetchall()
    return render(request, template, context={'rows':rows})


def risk_mun_json_mug(request, template='data/target.json'):

    year = request.GET.get('year', '2015')
    code = request.GET.get('code', '1')
    edo = request.GET.get('edo', '99')
    location_code = request.GET.get('location_code', '20001')
    legal = legal_good[int(code)]
    params = {'year': year, 'code': legal, 'edo': edo, 'location_code':location_code}
    if edo in '99':
        sql = """select municipio as source, typess as target, sum(total::decimal) as value, location_code as code_mun from trd_mugs
                where year = '%(year)s'
                and good_legal = '%(code)s'
                and location_code = '%(location_code)s'
                group by source, target, location_code Order By value desc Limit 10""" % params
    else:
        sql = """select municipio as source, typess as target, sum(total::decimal) as value, location_code as code_mun from trd_mugs
                where year = '%(year)s'
                and good_legal = '%(code)s'
                and clv = '%(edo)s'
                and location_code = '%(location_code)s'
                group by source, target, location_code Order By value desc Limit 10""" % params
    print sql
    try:
        con = psycopg2.connect(database=db['NAME'], user=db['USER'], password=db['PASSWORD'], port=db['PORT'], host=db['HOST'])
    except:
        print "No!"

    cur = con.cursor()

    try:
        cur.execute(sql)
    except:
        print "Mal!"

    rows = cur.fetchall()

    return render(request, template, context={'rows':rows})


def import_export_json_mug(request, template='data/target_mugs.json'):

    code_mun = request.GET.get('code', '')

    params = {'code_mun': code_mun}

    sql = """Select year_::float as year, Sum(export_value::decimal)/1000000 as exp, Sum(import_value::decimal)/1000000 as imp
            From destination_exp
            Where location_code::float = %(code_mun)s
            Group By year_""" % params

    try:
        con = psycopg2.connect(database=db['NAME'], user=db['USER'], password=db['PASSWORD'], port=db['PORT'], host=db['HOST'])
    except:
        print "No!"

    cur = con.cursor()

    try:
        cur.execute(sql)
    except:
        print "Mal!"

    rows = cur.fetchall()

    return render(request, template, context={'rows': rows})

"""
trae los datos para tematizar los riesgos
"""
def getTematizerMugs(request):
    if request.is_ajax():
        try:
            print "ok"
            data = []
            data_tematizer = []
            data_clases = []
            data_tema_temp = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                code = query_data['code']
                edo = query_data['edo']
                type = query_data['type']
                legal = legal_good[int(code)]
                data_tema_temp = tematizerMug(year, legal, edo, type)
                data_tematizer = data_tema_temp[0]
                data_clases = data_tema_temp[1]
                data.append(data_tematizer)
                data.append(data_clases)
                data.append(data_tema_temp[2])
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")


"""
Este metodo es para obtener la tematizacion de los municipios para riesgos
"""
def tematizerMug(year, legal, edo, type):
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

        query_csv = "select clv, location_code, municipio, good_legal, " \
            + " typess, subtype, modality, tipoz, SUM(total ::float), year " \
            + " from trd_mugs " \
            + " where year='%s' " % year \
            + " and total is not null " \
            + " and good_legal = '%s' " % legal \
            + " and typess = '%s' " % type \
            + " and clv = '%s' " % edo \
            + " group by year, location_code, municipio, " \
            + " good_legal, typess, subtype, modality, " \
            + " tipoz, clv " \
            + " order by SUM(total::float); "

        query_tematizer = "select year, SUM(total ::float), location_code " \
            + " from trd_mugs " \
            + " where year='%s' " % year \
            + " and total is not null " \
            + " and good_legal = '%s' " % legal \
            + " and typess = '%s' " % type \
            + " and clv = '%s' " % edo \
            + " group by year, location_code " \
            + " order by SUM(total::float); "
        query_tematizer_quantyles = "select min(total ::float), " \
            + " max(total::float) from trd_mugs " \
            + " where year='%s' " % year \
            + " and total is not null " \
            + " and good_legal = '%s' " % legal \
            + " and typess = '%s' " % type \
            + " and clv = '%s'; " % edo \


        cur.execute(query_tematizer)
        data_tematizer = cur.fetchall()
        cur.execute(query_tematizer_quantyles)
        quantiles = cur.fetchone()
        cur.execute(query_csv)
        data_csv = cur.fetchall()

        max_num = quantiles[1]
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
        data.append(data_csv)
        # data.append(quantiles)

        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return data

"""
years compare
"""
def compareDates(request):
    if request.is_ajax():
        try:
            data = []
            query_data = json.loads(request.POST['query_data'])
            query_data
            if query_data:
                code = query_data['code']
                edo = query_data['edo']
                legal = legal_good[int(code)]
                data = searchDataBetweenYears(legal, edo)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")


"""
Este metodo es para obtener la tematizacion de los municipios para riesgos
"""
def searchDataBetweenYears(legal, edo):
    try:
        data = []
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
        if edo in "99":
            edo_str = ''
        else:
            edo_str = " and clv = '%s' "% edo
        params = {'code': legal, 'edo': edo, 'edo_str':edo_str}

        sql = """drop table if exists mug_01;
                create table mug_01 as
                 select typess as typess_1, sum(total::float) as delitos_2015
                 from trd_mugs
                 where year = '2015'
                 %(edo_str)s
                 and good_legal = '%(code)s'
                 group by typess
                 order by typess;
                drop table if exists mug_02;
                create table mug_02 as
                 select typess as typess_2, sum(total::float) as delitos_2016
                 from trd_mugs
                 where year = '2016'
                 %(edo_str)s
                 and good_legal = '%(code)s'
                  group by typess
                 order by typess;
                 drop table if exists mug_03;
                 create table mug_03 as
                  select typess as typess_3, sum(total::float) as delitos_2017
                  from trd_mugs
                  where year = '2017'
                  %(edo_str)s
                  and good_legal = '%(code)s'
                   group by typess
                  order by typess;
                  drop table if exists mug_04;
                  create table mug_04 as
                   select typess as typess_4, sum(total::float) as delitos_2018
                   from trd_mugs
                   where year = '2018'
                   %(edo_str)s
                   and good_legal = '%(code)s'
                    group by typess
                   order by typess;
                drop table if exists mug_05;
                create table mug_05 as
                select typess_1,typess_2,typess_3,typess_4, delitos_2015, delitos_2016, delitos_2017,  delitos_2018
                from mug_01
                full outer join mug_02 on mug_01.typess_1=mug_02.typess_2
                full outer join mug_03 on mug_02.typess_2=mug_03.typess_3
                full outer join mug_04 on mug_03.typess_3=mug_04.typess_4;

                update mug_05 set delitos_2015=0 where delitos_2015 is null;
                update mug_05 set delitos_2016=0 where delitos_2016 is null;
                update mug_05 set delitos_2017=0 where delitos_2017 is null;
                update mug_05 set delitos_2018=0 where delitos_2018 is null;
                update mug_05 set typess_2=typess_1 where typess_2 is null;
                update mug_05 set typess_2=typess_3 where typess_2 is null;
                update mug_05 set typess_2=typess_4 where typess_2 is null;""" % params

        query = """select typess_2, delitos_2015, delitos_2016, delitos_2017, delitos_2018
            from mug_05 order by delitos_2015, delitos_2016,delitos_2017, delitos_2018 desc;"""
        # print sql
        cur.execute(sql)
        cur.execute(query)
        data = cur.fetchall()
        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return data

"""
trae los datos para tematizar los riesgos
"""
def getAverageMinMax(request):
    if request.is_ajax():
        try:
            data = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                code = query_data['code']
                location_code = query_data['location_code']
                mun = location_code[2:7]
                legal = legal_good[int(code)]
                data = getMonths(year, legal, mun)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")


"""
Este metodo es para obtener la tematizacion de los municipios para riesgos
"""
def getMonths(year, legal, location_code):
    try:
        data = []
        typ = []
        years = []
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

        params = {'year': year, 'legal': legal,  'location_code': location_code}

        sql_types = """select distinct(typess)
             from trd_mugs
             where year = '%(year)s'
             and location_code = '%(location_code)s'
             and good_legal = '%(legal)s'
             order by typess;""" % params

        cur.execute(sql_types)
        typ = cur.fetchall()
        params["typess_"] = typ[0][0]

        sql = """select year, avg(enelimsup::float) as super, avg(enemean::float) as promedio, sum(ene::float) as tendencia, avg(eneliminf::float) as min
                , avg(feblimsup::float) as super, avg(febmean::float) as promedio, sum(feb::float) as tendencia, avg(febliminf::float) as min
                , avg(marlimsup::float) as super, avg(marmean::float) as promedio, sum(mar::float) as tendencia, avg(marliminf::float) as min
                , avg(abrlimsup::float) as super, avg(abrmean::float) as promedio, sum(abr::float) as tendencia, avg(abrliminf::float) as min
                , avg(maylimsup::float) as super, avg(maymean::float) as promedio, sum(may::float) as tendencia, avg(mayliminf::float) as min
                , avg(junlimsup::float) as super, avg(junmean::float) as promedio, sum(jun::float) as tendencia, avg(junliminf::float) as min
                , avg(jullimsup::float) as super, avg(julmean::float) as promedio, sum(jul::float) as tendencia, avg(julliminf::float) as min
                , avg(agolimsup::float) as super, avg(agomean::float) as promedio, sum(ago::float) as tendencia, avg(agoliminf::float) as min
                , avg(seplimsup::float) as super, avg(sepmean::float) as promedio, sum(sep::float) as tendencia, avg(sepliminf::float) as min
                , avg(octlimsup::float) as super, avg(octmean::float) as promedio, sum(oct::float) as tendencia, avg(octliminf::float) as min
                , avg(novlimsup::float) as super, avg(novmean::float) as promedio, sum(nov::float) as tendencia, avg(novliminf::float) as min
                , avg(diclimsup::float) as super, avg(dicmean::float) as promedio, sum(dic::float) as tendencia, avg(dicliminf::float) as min
                 from trd_mugs
                 where location_code = '%(location_code)s'
                 and good_legal = '%(legal)s'
                 and typess = '%(typess_)s'
                 group by year
                 order by year;""" % params
        # print sql
        # query = "select substring(municipio from 1 for 31), substring(typess from 1 for 31), delitos_2015, delitos_2016 from mug_03 order by delitos_2015, delitos_2016 desc limit 35;"
        cur.execute(sql)
        # cur.execute(query)
        years = cur.fetchall()
        conn.commit()
        conn.close()
        data.append(typ)
        data.append(years)
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return data


"""
trae los años por tipo de delito
"""
def getYearsByType(request):
    if request.is_ajax():
        try:
            data = []
            query_data = json.loads(request.POST['query_data'])
            if query_data:
                year = query_data['year']
                code = query_data['code']
                location_code = query_data['edo']
                type = query_data['type']
                mun = location_code[2:7]
                legal = legal_good[int(code)]
                data = getMonthsByType(year, legal, mun, type)
        except KeyError:
            HttpResponseServerError("Malformed data!")
        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax")

"""
Este metodo es para obtener la tematizacion de los municipios para riesgos por tipo
"""
def getMonthsByType(year, legal, location_code, type):
    try:
        data = []
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

        params = {'year': year, 'legal': legal,  'location_code': location_code, 'typess_': type}

        sql = """select year, avg(enelimsup::float) as super, avg(enemean::float) as promedio, sum(ene::float) as tendencia, avg(eneliminf::float) as min
                , avg(feblimsup::float) as super, avg(febmean::float) as promedio, sum(feb::float) as tendencia, avg(febliminf::float) as min
                , avg(marlimsup::float) as super, avg(marmean::float) as promedio, sum(mar::float) as tendencia, avg(marliminf::float) as min
                , avg(abrlimsup::float) as super, avg(abrmean::float) as promedio, sum(abr::float) as tendencia, avg(abrliminf::float) as min
                , avg(maylimsup::float) as super, avg(maymean::float) as promedio, sum(may::float) as tendencia, avg(mayliminf::float) as min
                , avg(junlimsup::float) as super, avg(junmean::float) as promedio, sum(jun::float) as tendencia, avg(junliminf::float) as min
                , avg(jullimsup::float) as super, avg(julmean::float) as promedio, sum(jul::float) as tendencia, avg(julliminf::float) as min
                , avg(agolimsup::float) as super, avg(agomean::float) as promedio, sum(ago::float) as tendencia, avg(agoliminf::float) as min
                , avg(seplimsup::float) as super, avg(sepmean::float) as promedio, sum(sep::float) as tendencia, avg(sepliminf::float) as min
                , avg(octlimsup::float) as super, avg(octmean::float) as promedio, sum(oct::float) as tendencia, avg(octliminf::float) as min
                , avg(novlimsup::float) as super, avg(novmean::float) as promedio, sum(nov::float) as tendencia, avg(novliminf::float) as min
                , avg(diclimsup::float) as super, avg(dicmean::float) as promedio, sum(dic::float) as tendencia, avg(dicliminf::float) as min
                 from trd_mugs
                 where location_code = '%(location_code)s'
                 and good_legal = '%(legal)s'
                 and typess = '%(typess_)s'
                 group by year
                 order by year;""" % params
        # print sql
        # query = "select substring(municipio from 1 for 31), substring(typess from 1 for 31), delitos_2015, delitos_2016 from mug_03 order by delitos_2015, delitos_2016 desc limit 35;"
        cur.execute(sql)
        # cur.execute(query)
        data = cur.fetchall()
        conn.commit()
        conn.close()
        print "Records created successfully"
    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print 'Error %s' % e
        conn.close()
    return data

"""
create pdf
"""
def getPDF(request):
    data = []
    dir_ficha = {}
    delincuencia = {}
    table_name = "trd_mugs_report"
    cur = connections['datastore'].cursor()
    location_code = request.GET.get('location_code', '1')
    cve_edo = location_code[0:2]
    cve_mun = location_code[2:7]
    params = {'cve_edo': cve_edo, 'cve_mun': cve_mun}
    try:
        query = """
                select cvegeo, tipo, zmetro, criterio, pobtot, pobfem,
                menores_m, adultos_m, mayores_m
                ,pobmasc, menores_h, adultos_h, mayores_h,
                prc_urbano, prc_comp_urb, prc_rural, prc_victima, prc_novictima,
                estmun, extest, pat_ext1617, pat_ext1718, pat_ext_var,
                dolmun, dolest, vichod1617, vichod1718, vichodvar,
                secmun, secest, lpesec1617, lpesec1718, lpesec_var,
                d1, d1mun, d1est, d1_1617, d1_1718, d1_var,
                d2, d2mun, d2est, d2_1617, d2_1718, d2_var,
                d3, d3mun, d3est, d3_1617, d3_1718, d3_var,
                cond1,cond1_num, prob1, prob1_num, aut1, aut1opi, aut1pct, aut1_d, aut1des,aut1p,
                cond2,cond2_num, prob2, prob2_num, aut2, aut2opi, aut2pct, aut2_d, aut2des,aut2p,
                cond3,cond3_num, prob3, prob3_num, aut3, aut3opi, aut3pct, aut3_d, aut3des,aut3p,
                mananaprc, tardeprc, nocheprc, madrugadaprc,
                economicoprc, emocionalprc, fisicoprc, laboralprc,
                menos1hprc, de1_2hprc, de2_3hprc, de3_4hprc,
                excelenteprc, buenoprc, maloprc, muymaloprc, nom_ent, nom_mun
                from trd_mugs_report
                where cve_ent = '%(cve_edo)s'
                and cve_mun = '%(cve_mun)s'
                """ %params
        cur.execute(query)
        data = cur.fetchone()
        if data != None:
            dir_ficha['cvegeo'] = data[0]
            dir_ficha['tipo'] = data[1]
            if data[2]==None:
                dir_ficha['zmetro'] = "N/A"
            else:
                dir_ficha['zmetro'] = data[2]
            if data[3]==None:
                dir_ficha['criterio'] = "N/A"
            else:
                dir_ficha['criterio'] = data[3]
            dir_ficha['pobtot'] = data[4]
            dir_ficha['pobfem'] = data[5]
            dir_ficha['menores_m'] = data[6]
            dir_ficha['adultos_m'] = data[7]
            dir_ficha['mayores_m'] = data[8]
            dir_ficha['pobmasc'] = data[9]
            dir_ficha['menores_h'] = data[10]
            dir_ficha['adultos_h'] = data[11]
            dir_ficha['mayores_h'] = data[12]
            dir_ficha['prc_urbano'] = data[13]
            dir_ficha['prc_comp_urb'] = data[14]
            dir_ficha['prc_rural'] = data[15]
            dir_ficha['prc_victima'] = data[16]
            dir_ficha['prc_novictima'] = data[17]
            dir_ficha['estmun'] = data[18]
            dir_ficha['extest'] = data[19]
            dir_ficha['pat_ext1617'] = data[20]
            dir_ficha['pat_ext1718'] = data[21]
            dir_ficha['pat_ext_var'] = data[22]
            dir_ficha['dolmun'] = data[23]
            dir_ficha['dolest'] = data[24]
            dir_ficha['vichod1617'] = data[25]
            dir_ficha['vichod1718'] = data[26]
            dir_ficha['vichodvar'] = data[27]
            dir_ficha['secmun'] = data[28]
            dir_ficha['secest'] = data[29]
            dir_ficha['lpesec1617'] = data[30]
            dir_ficha['lpesec1718'] = data[31]
            dir_ficha['lpesec_var'] = data[32]
            dir_ficha['d1'] = data[33]
            dir_ficha['d1mun'] = data[34]
            dir_ficha['d1est'] = data[35]
            dir_ficha['d1_1617'] = data[36]
            dir_ficha['d1_1718'] = data[37]
            dir_ficha['d1_var'] = data[38]
            dir_ficha['d2'] = data[39]
            dir_ficha['d2mun'] = data[40]
            dir_ficha['d2est'] = data[41]
            dir_ficha['d2_1617'] = data[42]
            dir_ficha['d2_1718'] = data[43]
            dir_ficha['d2_var'] = data[44]
            dir_ficha['d3'] = data[45]
            dir_ficha['d3mun'] = data[46]
            dir_ficha['d3est'] = data[47]
            dir_ficha['d3_1617'] = data[48]
            dir_ficha['d3_1718'] = data[49]
            dir_ficha['d3_var'] = data[50]
            dir_ficha['cond1'] = data[51]
            dir_ficha['cond1_num'] = data[52]
            dir_ficha['prob1'] = data[53]
            dir_ficha['prob1_num'] = data[54]
            dir_ficha['aut1'] = data[55]
            dir_ficha['aut1opi'] = data[56]
            dir_ficha['aut1pct'] = data[57]
            dir_ficha['aut1_d'] = data[58]
            dir_ficha['aut1des'] = data[59]
            dir_ficha['aut1p'] = data[60]
            dir_ficha['cond2'] = data[61]
            dir_ficha['cond2_num'] = data[62]
            dir_ficha['prob2'] = data[63]
            dir_ficha['prob2_num'] = data[64]
            dir_ficha['aut2'] = data[65]
            dir_ficha['aut2opi'] = data[66]
            dir_ficha['aut2pct'] = data[67]
            dir_ficha['aut2_d'] = data[68]
            dir_ficha['aut2des'] = data[69]
            dir_ficha['aut2p'] = data[70]
            dir_ficha['cond3'] = data[71]
            dir_ficha['cond3_num'] = data[72]
            dir_ficha['prob3'] = data[73]
            dir_ficha['prob3_num'] = data[74]
            dir_ficha['aut3'] = data[75]
            dir_ficha['aut3opi'] = data[76]
            dir_ficha['aut3pct'] = data[77]
            dir_ficha['aut3_d'] = data[78]
            dir_ficha['aut3des'] = data[79]
            dir_ficha['aut3p'] = data[80]

            delincuencia['mananaprc'] = data[81]
            delincuencia['tardeprc'] = data[82]
            delincuencia['nocheprc'] = data[83]
            delincuencia['madrugadaprc'] = data[84]
            delincuencia['economicoprc'] = data[85]
            delincuencia['emocionalprc'] = data[86]
            delincuencia['fisicoprc'] = data[87]
            delincuencia['laboralprc'] = data[88]
            delincuencia['menos1hprc'] = data[89]
            delincuencia['de1_2hprc'] = data[90]
            delincuencia['de2_3hprc'] = data[91]
            delincuencia['de3_4hprc'] = data[92]
            delincuencia['excelenteprc'] = data[93]
            delincuencia['buenoprc'] = data[94]
            delincuencia['maloprc'] = data[95]
            delincuencia['muymaloprc'] = data[96]
            delincuencia['nom_ent'] = data[97]
            delincuencia['nom_mun'] = data[98]

    except psycopg2.DatabaseError, e:
        print "I am unable to connect to the database"
        print "Error {}".format(e)
    # Rendered pdf_template
    html_string = render_to_string('pdf_template.html', {'ficha': dir_ficha, 'delincuencia':delincuencia})
    html = HTML(string=html_string)
    result = html.write_pdf()

    # Creating http response
    response = HttpResponse(content_type='application/pdf;')
    response['Content-Disposition'] = 'inline; filename=ficha_tecnica.pdf'
    response['Content-Transfer-Encoding'] = 'binary'
    with tempfile.NamedTemporaryFile(delete=True) as output:
        output.write(result)
        output.flush()
        output = open(output.name, 'r')
        response.write(output.read())

    return response

"""
descarga los datos del municipio
"""
def dowload_data(request, template='mugs_home.html'):
    html_string = render_to_string('pdf_template.html', {'people': "ha"})
    html = HTML(string=html_string)
    result = html.write_pdf()

    # Creating http response
    response = HttpResponse(content_type='application/pdf;')
    response['Content-Disposition'] = 'inline; filename=list_people.pdf'
    response['Content-Transfer-Encoding'] = 'binary'
    with tempfile.NamedTemporaryFile(delete=True) as output:
        output.write(result)
        output.flush()
        output = open(output.name, 'r')
        response.write(output.read())

    return response
