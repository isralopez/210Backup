# -*- coding: utf-8 -*-
#########################################################################
#
#
#########################################################################

from django.conf.urls import url
from . import views

js_info_dict = {
    'packages': ('storymaps.narratives',),
}

urlpatterns = [ # 'storymaps.narratives.views',
    url(r'^$', views.list_narratives, name='list_narratives'),
    url(r'^(?P<narrative_id>\d+)/?$', views.detail_narrative, name='detail_narrative'),
    url(r'^upload/(?P<investigation_id>\d+)$', views.upload_narrative, name='upload_narrative'),
    url(r'^metadata/(?P<narrative_id>\d+)$', views.metadata_narrative, name='metadata_narrative'),
    url(r'^remove/(?P<narrative_id>\d+)$', views.remove_narrative, name='remove_narrative'),
    url(r'^content/(?P<narrative_id>\d+)$', views.content_narrative, name='content_narrative'),
    url(r'^maps/$', views.list_maps, name='list_maps'),
    url(r'^documents/$', views.list_documents, name='list_documents'),
    url(r'^search_narrative_by_product/(?P<id_product>\d+)/?$', views.search_narrative_by_product,
        name='search_narrative_by_product'),
    url(r'^search_narrative_by_project/(?P<project_id>\d+)/?$', views.search_narrative_by_project,
        name='search_narrative_by_project')
    ]

