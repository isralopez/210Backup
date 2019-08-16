from django.conf.urls import url
from . import views

urlpatterns = [ #'geonode.apps.lidar.views',
    url(r'^$', views.lidar, name='lidar'),
    url(r'^catastro/$', views.catastro, name='catastro')
]
