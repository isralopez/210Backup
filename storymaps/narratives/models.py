#encoding:utf-8
import logging
from django.db.models import Q
from django.db import models
from django.conf import settings
from django.core.urlresolvers import reverse

from storymaps.investigation.models import Investigation
from ckeditor.fields import RichTextField
from geonode.maps.models import Map
from geonode.base.models import TopicCategory

IMGTYPES = ['jpg', 'jpeg', 'tif', 'tiff', 'png', 'gif']

logger = logging.getLogger(__name__)

cover_helpText = 'Busque la ubicacion deseada o mueva el marcador'


class Narratives(models.Model):
    title = models.CharField(verbose_name = "Titulo", max_length=200, unique=True)
    author = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='narratives_author', verbose_name = "Autor", blank=True)
    publisher = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='narratives_publisher', verbose_name = "Editor", blank=True)
    narrative = RichTextField(blank=True, null=True, verbose_name='Contenido')
    ext_url = models.URLField(blank=True, null=True, help_text='Escriba la URL del recurso, sólo si es externo', verbose_name='Liga al recurso')
    investigation = models.ForeignKey(Investigation, verbose_name = "Investigacion", blank=True, null=True)
    description = models.TextField(verbose_name='Descripcion', max_length=250)
    coverage = models.CharField(verbose_name='Cobertura', max_length=150, null=True, blank=False, help_text=cover_helpText)
    image = models.ImageField(verbose_name = "Imagen", upload_to="images/", null=True, blank=False)
    category = models.ForeignKey(TopicCategory, null=True, blank=True, limit_choices_to=Q(is_choice=True))
    public = models.BooleanField(verbose_name = "Publicar", default=False)
    creation_date = models.DateField(auto_now_add=True)
    count_row = models.IntegerField(verbose_name='contador',null=True, blank=True, default=0)
    allow_comments = models.BooleanField(verbose_name = "Permite que los usuarios comenten en tu narrativa", default= False)
    authorize_comments = models.BooleanField(verbose_name = "Autoriza lo comentarios via e-mail", default=False)
    maps = models.ManyToManyField(Map, related_name='narratives_maps', verbose_name = "Mapas relacionados", null=True, blank=True)

    def __unicode__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('detail_narrative', args=(self.id,))
