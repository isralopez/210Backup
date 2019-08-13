from django.conf.urls import url
from . import views

js_info_dict = {
    'packages': ('geonode.references',),
}

urlpatterns = [# 'geonode.references.views',
                       url(r'^(?P<slug>[\w-]+)$', views.reference, name='reference'),
                       #Admin
                       url(r'^admin/$', views.references_admin, name='references_admin'),
                       url(r'^admin/list/$', views.references_list, name='references_list'),
                       url(r'^admin/reference$', views.reference_add, name='reference_add'),
                       url(r'^admin/reference/(?P<id>\d+)$', views.reference_edit, name='reference_edit'),
                       url(r'^admin/reference/(?P<id>\d+)/remove$', views.reference_remove, name='reference_remove'),
                       ]