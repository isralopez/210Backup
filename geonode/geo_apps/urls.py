from django.conf.urls import include, url
from . import views

js_info_dict = {
    'packages': ('geonode.geo_apps',)
}

urlpatterns = [# 'geonode.geo_apps.views',
    # APPS
    url(r'^destination_exp/', include('geonode.geo_apps.destination_exp.urls')),
    url(r'^fuero_comun/', include('geonode.geo_apps.mugs.urls')),
    url(r'^farming/', include('geonode.geo_apps.farming_siap.urls')),
    url(r'^lidar/', include('geonode.geo_apps.lidar.urls')),
    url(r'^create_app/$', views.create_app, name='create_app')
]
