# -*- coding: utf-8 -*-
from django.core import validators
from django.db import models
from fontawesome.fields import IconField
from ckeditor.fields import RichTextField

from geonode.groups.models import GroupProfile
from geonode.layers.models import Layer


class MViewer(models.Model):
    group = models.ForeignKey(GroupProfile, verbose_name = "Grupo")
    name = models.CharField(verbose_name = "Nombre", max_length=200)
    url_id = models.CharField(validators=[validators.validate_slug], verbose_name="Identificador del visualizador",
                                help_text='El identificador no puede tener espacios, caracteres especiales, ni arrobas',
                                max_length=20, unique=True, blank=False, null=True)
    is_public = models.BooleanField(default=False, verbose_name="Es público")
    image = models.ImageField(verbose_name="Imagen", upload_to="images/", null=True, blank=True)
    description = RichTextField(verbose_name="Descripcion", blank=True, null=True)
    layer_mask = models.ForeignKey(Layer, verbose_name="Capa de mascara", null=True, blank=True)
    bbox_x0 = models.DecimalField(max_digits=19, decimal_places=10, blank=True, null=True)
    bbox_y0 = models.DecimalField(max_digits=19, decimal_places=10, blank=True, null=True)
    bbox_x1 = models.DecimalField(max_digits=19, decimal_places=10, blank=True, null=True)
    bbox_y1 = models.DecimalField(max_digits=19, decimal_places=10, blank=True, null=True)
    config = models.CharField(verbose_name = "Mapa Base", max_length=200, null=True, blank=True)
    creation_date = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return self.name


class Topic(models.Model):
    mviewer = models.ForeignKey(MViewer, verbose_name = "Visualizador", null=True, blank=True)
    name = models.CharField(verbose_name = "Nombre", max_length=40)
    description = models.TextField(verbose_name = "Descripcion", max_length=200)
    creation_date = models.DateField(auto_now_add=True)
    layer_ids = models.ManyToManyField(Layer, through='LayerIds', verbose_name="IDs de capas")
    stack_order = models.IntegerField(null=True, blank=True)

    def __unicode__(self):
        return self.name


class LayeridMarker(models.Model):
    lat = models.DecimalField(max_digits=19, decimal_places=10, blank=True, null=True)
    lng = models.DecimalField(max_digits=19, decimal_places=10, blank=True, null=True)
    title = models.CharField(verbose_name='Titulo', null=True, max_length=200)
    narrative = RichTextField(verbose_name="Narrativa de Marcador", blank=True, null=True)
    icon = IconField(default='info', verbose_name="Icono")
    options = models.CharField(verbose_name="Opciones del marcador", max_length=500, null=True, blank=True)

    def __str__(self):
        return str(self.pk)


class LayerIds(models.Model):
    topic = models.ForeignKey(Topic, db_column='topic_id')
    layer = models.ForeignKey(Layer, db_column='layer_id')
    visible = models.BooleanField(default=False)
    name = models.CharField(null=True, max_length=200)
    title = models.CharField(null=True, max_length=200)
    style = models.CharField(max_length=250, null=True)
    default_style = models.CharField(max_length=250, null=True)
    stack_order = models.IntegerField(null=True, blank=True)
    narrative = RichTextField(verbose_name="Narrativa de Capa", blank=True, null=True)
    markers = models.ManyToManyField(LayeridMarker, blank=True)

    class Meta:
        db_table = 'mviewer_topic_layer_ids'

    def __unicode__(self):
        return self.name
