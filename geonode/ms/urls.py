from django.conf.urls import include, url
from django.views.generic import TemplateView
from . import views

js_info_dict = {
    'packages': ('geonode.ms',),
}

urlpatterns = [  # 'geonode.ms.views',
    url(r'^(?P<msurlname>[^/]+)$', views.ms_index, name='ms_index'),
    url(r'^(?P<msurlname>[^/]+)/section/(?P<idsection>[A-Za-z0-9_\-]+)$', views.ms_section, name='ms_section'),
    url(r'^(?P<msurlname>[^/]+)/category/(?P<idcategory>[A-Za-z0-9_\-]+)$', views.ms_category, name='ms_category'),
    url(r'^(?P<msurlname>[^/]+)/narrative/(?P<idnarrative>[A-Za-z0-9_\-]+)$', views.ms_narrative, name='ms_narrative'),
    url(r'^(?P<idms>[^/]+)/json$', views.ms_json, name='ms_json'),
    url(r'^(?P<idms>[^/]+)/(?P<idcategory>[^/]+)/json$', views.category_json, name='category_json'),
    url(r'^(?P<idms>[^/]+)/nar_json$', views.ms_nar_json, name='ms_nar_json'),
    # Admin
    url(r'^(?P<idms>[^/]+)/json_admin$', views.ms_json_admin, name='ms_json_admin'),
    url(r'^$', views.ms_gestor_list, name='ms_gestor_list'),
    url(r'^public/$', views.ms_public_list, name='ms_public_list'),
    url(r'^upload_ms/$', views.upload_ms, name='upload_ms'),
    url(r'^ms_category_list/(?P<ms_id>\d+)$', views.ms_category_list, name='ms_category_list'),
    url(r'^upload_section/(?P<ms_id>\d+)$', views.upload_section, name='upload_section'),
    url(r'^update_ms/(?P<ms_id>\d+)$', views.update_ms, name='update_ms'),
    url(r'^advanced_ms/(?P<ms_id>\d+)$', views.advanced_ms, name='advanced_ms'),
    url(r'^ms_update_section/(?P<ms_id>\d+)/(?P<section_id>\d+)$', views.ms_update_section, name='ms_update_section'),
    url(r'^remove_sect/(?P<section_id>\d+)$', views.ms_remove_section, name='ms_remove_section'),
    url(r'^ms_upload_category/(?P<ms_id>\d+)$', views.ms_upload_category, name='ms_upload_category'),
    url(r'^ms_narrative_list/(?P<ms_id>\d+)$', views.ms_narrative_list, name='ms_narrative_list'),
    url(r'^ms_upload_narrative/(?P<ms_id>\d+)$', views.ms_upload_narrative, name='ms_upload_narrative'),
    url(r'^ms_update_category/(?P<category_id>\d+)/(?P<ms_id>\d+)$', views.ms_update_category, name='ms_update_category'),
    url(r'^sort_category/$', views.sort_category, name='sort_category'),
    url(r'^remove_cat/(?P<category_id>\d+)/(?P<ms_id>\d+)$', views.ms_remove_category, name='ms_remove_category'),
    url(r'^ms_update_narrative/(?P<narrative_id>\d+)/(?P<ms_id>\d+)$', views.ms_update_narrative, name='ms_update_narrative'),
    url(r'^sort_narrative/$', views.sort_narrative, name='sort_narrative'),
    url(r'^remove_nar/(?P<narrative_id>\d+)/(?P<ms_id>\d+)$', views.ms_remove_narrative, name='ms_remove_narrative'),
    url(r'^ms_save_color/$', views.ms_save_color, name='ms_save_color'),
    url(r'^ms_grays/$', views.ms_grays, name='ms_grays'),
    url(r'^ms_update_narrative_meta/(?P<narrative_id>\d+)/(?P<ms_id>\d+)$', views.ms_update_narrative_meta, name='ms_update_narrative_meta'),
    url(r'^ms_narrative_detail/(?P<narrative_id>\d+)/(?P<ms_id>\d+)$', views.ms_narrative_detail, name='ms_narrative_detail'),
    url(r'^ms_narrative_unpublish/(?P<narrative_id>\d+)/(?P<ms_id>\d+)$', views.ms_narrative_unpublish, name='ms_narrative_unpublish'),
    url(r'^ms_narrative_publish/(?P<narrative_id>\d+)/(?P<ms_id>\d+)$', views.ms_narrative_publish, name='ms_narrative_publish'),
    url(r'^ms_publish/(?P<ms_id>\d+)$', views.ms_publish, name='ms_publish'),
    url(r'^ms_remove/(?P<ms_id>\d+)$', views.ms_remove, name='ms_remove'),
    url(r'^ms_detail/(?P<ms_id>\d+)$', views.ms_detail, name='ms_detail'),
    url(r'^ms_up_cat_to_ms/(?P<ms_id>\d+)$', views.ms_upload_category_to_ms, name='ms_upload_category_to_ms'),
    url(r'^up_cat_to_cat/(?P<ms_id>\d+)/(?P<category_id>\d+)$', views.ms_upload_category_to_parent_cat, name='ms_upload_category_to_parent_cat'),
    url(r'^update_cat_ms/(?P<ms_id>\d+)/(?P<category_id>\d+)$', views.ms_update_category_to_ms, name='ms_update_category_to_ms'),
    url(r'^upload_nar_to_ms/(?P<ms_id>\d+)$', views.ms_upload_narrative_to_ms, name='ms_upload_narrative_to_ms'),
    url(r'^update_narr_meta_to_ms/(?P<narrative_id>\d+)/(?P<ms_id>\d+)$', views.ms_update_narrative_meta_to_ms, name='ms_update_narrative_meta_to_ms'),
    url(r'^upload_nar_to_cat/(?P<ms_id>\d+)/(?P<category_id>\d+)$', views.ms_upload_narrative_to_cat, name='ms_upload_narrative_to_cat'),
    url(r'^ms_search_narrative/$', views.ms_search_narrative, name='ms_search_narrative'),
    url(r'^ms_save_thmatizing/$', views.ms_save_thmatizing, name='ms_save_thmatizing'),
    url(r'^upload_sect_par/(?P<ms_id>\d+)/(?P<sect_id>\d+)$', views.upload_section_parent, name='upload_section_parent'),
    url(r'^ms_search_cat/$', views.ms_search_cat, name='ms_search_cat'),
    url(r'^maps/$', views.ms_list_maps, name='ms_list_maps'),
    url(r'^documents/$', views.ms_list_documents, name='ms_list_documents'),
    url(r'^sort_menu/$', views.sort_menu, name='sort_menu'),
    url(r'^category_edit/(?P<ms_id>\d+)/(?P<cat_id>\d+)$', views.ms_category_edit, name='ms_category_edit'),
    # Capacidad innovacion
    url(r'^ci_imap/$', TemplateView.as_view(template_name='capacidadinnovacion/interactive_map.html'), name='ci_imap'),
    ]
