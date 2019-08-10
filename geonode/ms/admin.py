import autocomplete_light

from geonode.ms.models import Microsite, Section, Category, Narrative
from django.contrib import admin

admin.site.register(Microsite)
admin.site.register(Section)
admin.site.register(Category)
admin.site.register(Narrative)
