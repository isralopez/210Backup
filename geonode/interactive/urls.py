#########################################################################
#
#
#
#########################################################################

from django.conf.urls import include, url
from . import views

js_info_dict = {
    'packages': ('geonode.interactive',),
}

urlpatterns = [ #'geonode.interactive.views',

                       # Census urls
                       # (r'^intercensal/', include('geonode.interactive.intercensal.urls')),
                       # (r'^alf_census/', include('geonode.interactive.alf_census.urls')),
                       # (r'^c10census/', include('geonode.interactive.census2010.urls')),
                       # Intersecctions Pie graphic
                       # (r'^intersection_tool/', include('geonode.interactive.intersection_tool.urls')),

                       # Composer
                       # (r'^map_composer/', include('geonode.interactive.map_composer.urls')),

                       # Chats
                       # (r'^chats_map/', include('geonode.interactive.chats_map.urls')),

                       # (r'^wms_service/', include('geonode.interactive.wms_service.urls')),

                       # Interactive
                       url(r'^layers/?$', views.layer_interface, name='layer_interface'),
                       url(r'^maps/?$', views.maps_interface, name='maps_interface'),
                       url(r'^maps/ajax/$', views.interactive_map, name='interactive_map'),
                       url(r'^documents/?$', views.documents_interface, name='documents_interface'),
                       # url(r'^projects/?$', 'projects_interface', name='projects_interface'),
                       # url(r'^interface/layerlink/?$', 'layer_links', name='layer_links'),

                       # Auxiliar layers URLs
                       url(r'^layers/categories?$', views.layers_cat_list, name='layers_cat_list'),
                       url(r'^layers/tags?$', views.layers_tags_list, name='layers_tags_list'),

                       # Styles manager
                       url(r'^layers/styles/symbol?$', views.symbol, name='symbol'),
                       url(r'^layers/styles/categorized?$', views.categorized, name='categorized'),
                       url(r'^layers/styles/graduated?$', views.graduated, name='graduated'),
                       url(r'^layers/styles/edit?$', views.edit_style, name='edit_style'),
                       url(r'^layers/styles/getGeomType?$', views.getGeomType, name='getGeomType'),

                       # QuickMap URLs
                       # url(r'^qmap_data/?$', views.qmap_data, name='qmap_data'),
                       # url(r'^qmap_thumb/?$', views.qmap_thumbnail, name='qmap_thumbnail'),
                       # url(r'^save_quickmap/?$', views.save_quickmap, name='save_quickmap'),
                       # url(r'^delete_quickmap/?$', views.delete_quickmap, name='delete_quickmap'),
                       # url(r'^(?P<qmapid>[^/]+)/quickmap_embed$', quickmap_embed, name='quickmap_embed'),

                       url(r'^get_featureinfo/?$', views.get_featureinfo, name='get_featureinfo'),
                       url(r'^get_featureinfostyle/?$', views.get_featureinfostyle, name='get_featureinfostyle'),
                       # url(r'^data_calculator/?$', 'data_calculator', name='data_calculator'),
                       url(r'^face/$', views.face_embed, name='face_embed'),
                       # url(r'^maps/get_csv/$', 'get_csv', name='get_csv'),
                       # url(r'^maps/get_csv_trimestral/$', 'get_csv_trimestral', name='get_csv_trimestral'),
                       url(r'^get_style_perm/$', views.get_style_perm, name='get_style_perm')
                       ]
