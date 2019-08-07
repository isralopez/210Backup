from django.conf.urls import include, url
from django.views.generic import TemplateView
from . import views

js_info_dict = {
    'packages': ('geonode.mviewer',),
}

urlpatterns = [ #'geonode.mviewer.views',
    url(r'^$', views.mviewer_list, name='mviewer_list'),
    url(r'^public/$', views.mviewer_public, name='mviewer_public'),
    url(r'^create/$', views.mviewer_create, name='mviewer_create'),
    url(r'^metadata/(?P<mv_id>\d+)$', views.mviewer_metadata, name='mviewer_metadata'),
    url(r'^detail/(?P<mv_id>\d+)$', views.mviewer_detail, name='mviewer_detail'),
    url(r'^remove/(?P<mv_id>\d+)$', views.mviewer_remove, name='mviewer_remove'),
    url(r'^(?P<url_id>\w+)$', views.microviewer, name='microviewer'),

    url(r'^topic_create/(?P<mv_id>\d+)$', views.topic_create, name='topic_create'),
    url(r'^topic_metadata/(?P<mv_id>\d+)/(?P<top_id>\d+)$', views.topic_metadata, name='topic_metadata'),
    url(r'^topic_remove/(?P<mv_id>\d+)/(?P<top_id>\d+)$', views.topic_remove, name='topic_remove'),
    url(r'^edit_layer_narrative/(?P<mv_id>\d+)/(?P<reg_id>\d+)$', views.edit_layer_narrative, name='edit_layer_narrative'),
    url(r'^add_layer_markers/(?P<mv_id>\d+)/(?P<reg_id>\d+)$', views.add_layer_markers, name='add_layer_markers'),

    # Vistas Ajax
    url(r'^add_topic_layers/$', views.add_topic_layers, name='add_topic_layers'),
    url(r'^remove_topic_layer/$', views.remove_topic_layer, name='remove_topic_layer'),
    url(r'^tlayer_on/$', views.tlayer_on, name='tlayer_on'),
    url(r'^tlayer_off/$', views.tlayer_off, name='tlayer_off'),
    url(r'^set_layer_style/$', views.set_layer_style, name='set_layer_style'),
    url(r'^sort_topic/$', views.sort_topic, name='sort_topic'),
    url(r'^sort_layer/$', views.sort_layer, name='sort_layer'),
    url(r'^has_layer_tool/$', views.has_layer_tool, name='has_layer_tool'),
    url(r'^get_layer_narrative/$', views.get_layer_narrative, name='get_layer_narrative'),
    url(r'^add_layerid_marker/$', views.add_layerid_marker, name='add_layerid_marker'),
    url(r'^remove_layerid_marker/$', views.remove_layerid_marker, name='remove_layerid_marker'),
    url(r'^add_marker_narrative/$', views.add_marker_narrative, name='add_marker_narrative'),
    url(r'^change_icon_marker/$', views.change_icon_marker, name='change_icon_marker'),
    url(r'^change_marker_position/$', views.change_marker_position, name='change_marker_position'),
    url(r'^layerid_markers/$', views.layerid_markers, name='layerid_markers'),
    ]
