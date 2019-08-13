from django.conf.urls import url
from . import views

js_info_dict = {
    'packages': ('geonode.blog',),
}

urlpatterns = [ # 'geonode.blog.views',
                       url(r'^index/$', views.blog_index, name='blog_index'),
                       url(r'^$', views.blog, name='blog'),
                       url(r'^topics/$', views.blog_topics, name='blog_topics'),
                       url(r'^topic/(?P<slug>[\w-]+)$', views.blog_topic_detail, name='blog_topic_detail'),
                       url(r'^(?P<slug>[\w-]+)$', views.blog_post, name='blog_post'),
                       #Admin
                       url(r'^admin/$', views.blog_admin, name='blog_admin'),
                       url(r'^admin/post$', views.blog_post_add, name='blog_post_add'),
                       url(r'^admin/post/(?P<id>\d+)$', views.blog_post_edit, name='blog_post_edit'),
                       url(r'^admin/post/(?P<id>\d+)/remove$', views.blog_post_remove, name='blog_post_remove'),
                       url(r'^admin/link$', views.blog_link_add, name='blog_link_add'),
                       url(r'^admin/link/(?P<id>\d+)$', views.blog_link_edit, name='blog_link_edit'),
                       url(r'^admin/topic$', views.blog_topic_add, name='blog_topic_add'),
                       url(r'^admin/topic/(?P<id>\d+)$', views.blog_topic_edit, name='blog_topic_edit'),
                       url(r'^admin/topic/(?P<id>\d+)/remove$', views.blog_topic_remove, name='blog_topic_remove'),
                       ]