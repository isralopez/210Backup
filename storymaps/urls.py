from django.conf.urls import include, url
from . import views

js_info_dict = {
    'packages': ('storymaps',),
}

urlpatterns = [ # 'storymaps.views',
    # Index
    url(r'^/?$', views.storymaps, name='storymaps'),
    # Investigation views
    url(r'^investigation/', include('storymaps.investigation.urls')),
    # Narratives views
    url(r'^narratives/', include('storymaps.narratives.urls')),
    ]
