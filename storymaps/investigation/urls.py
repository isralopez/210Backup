# -*- coding: utf-8 -*-
#########################################################################
#
#
#########################################################################

from django.conf.urls import url
from . import views

js_info_dict = {
    'packages': ('storymaps.investigation',),
}

urlpatterns = [ #'storymaps.investigation.views',
    url(r'^$', views.list_investigation, name='list_investigation'),
    url(r'^(?P<investigation_id>\d+)/?$', views.detail_investigation, name='detail_investigation'),
    url(r'^upload/(?P<project_id>\d+)$', views.upload_investigation, name='upload_investigation'),
    url(r'^update/(?P<investigation_id>\d+)$', views.update_investigation, name='update_investigation'),
    url(r'^remove/(?P<investigation_id>\d+)$', views.remove_investigation, name='remove_investigation'),
]
