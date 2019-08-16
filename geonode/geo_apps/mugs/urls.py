from django.conf.urls import url
from . import views

urlpatterns = [ #'geonode.apps.mugs.views',
    url(r'^$', views.mugs, name='mugs'),
    url(r'^ficha_tecnica/$', views.data_sheet, name='data_sheet'),
    url(r'^export.json$', views.export_json_mug, name='export_json_mug'),
    url(r'^risk.json$', views.risk_mun_json_mug, name='risk_mun_json_mug'),
    url(r'^import.json$', views.import_json_mug, name='import_json_mug'),
    url(r'^import_export.json$', views.import_export_json_mug, name='import_export_json_mug'),
    url(r'^getTemM/$', views.getTematizerMugs, name='getTematizerMugs'),
    url(r'^cambio/$', views.compareMugs, name='compareMugs'),
    url(r'^compYear/$', views.compareDates, name='compareDates'),
    url(r'^average/$', views.getAverageMinMax, name='getAverageMinMax'),
    url(r'^getYByT/$', views.getYearsByType, name='getYearsByType'),
    url(r'^getPDF/$', views.getPDF, name='getPDF'),
    url(r'^dowload_data/$', views.dowload_data, name='dowload_data'),
]
