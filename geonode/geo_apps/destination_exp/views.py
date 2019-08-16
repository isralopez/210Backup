import psycopg2
import psycopg2.extras
from django.shortcuts import render
from geonode.geoserver.helpers import ogc_server_settings

db = ogc_server_settings.datastore_db


def destination_exp(request, template='destination_exp_home.html'):

    return render(request, template)


def export_json(request, template='data/export.json'):
    year = request.GET.get('year', '2004')
    code = request.GET.get('code', '2709')
    edo = request.GET.get('edo', '')
    edo = edo + "%"

    params = {'year': year, 'code': code, 'edo': edo}

    sql = """select location_name as source, country_name as target,
            sum(export_value::decimal) as value, location_code from destination_exp
            where year_::float=%(year)s and product_code='%(code)s' and export_value>='1' and location_code LIKE '%(edo)s'
            Group By source, target, location_code Order By value desc Limit 20""" % params

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


def import_json(request, template='data/import.json'):

    year = request.GET.get('year', '2004')
    code = request.GET.get('code', '8703')
    edo = request.GET.get('edo', '')
    edo = edo + "%"

    params = {'year': year, 'code': code, 'edo': edo}

    sql = """select location_name as source, country_name as target,
            sum(import_value::decimal) as value, location_code from destination_exp
            where year_::float=%(year)s and product_code='%(code)s' and import_value>='1' and location_code LIKE '%(edo)s'
            Group By source, target, location_code Order By value desc Limit 20""" % params

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


def export_products(request, template='data/products.json'):

    year = request.GET.get('year', '2004')
    edo = request.GET.get('edo', '')
    edo = edo+"%"

    params = {'year': year, 'edo': edo}

    sql = """Select product_code as code, product_name as name, sum(export_value::decimal) as total
            From destination_exp
            Where year_::float=%(year)s and export_value>='1' and location_code LIKE '%(edo)s'
            Group By code, name
            Order By total desc Limit 25""" % params

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


def import_products(request, template='data/products.json'):

    year = request.GET.get('year', '2004')
    edo = request.GET.get('edo', '')
    edo = edo + "%"

    params = {'year': year, 'edo': edo}

    sql = """Select product_code as code, product_name as name, sum(import_value::decimal) as total
            From destination_exp
            Where year_::float=%(year)s and import_value>='1' and location_code LIKE '%(edo)s'
            Group By code, name
            Order By total desc Limit 25""" % params

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


def import_export_json(request, template='data/import_export.json'):
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
