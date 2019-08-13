# encoding:utf-8
import os
from django.core import validators
from django.db import models
from ckeditor.fields import RichTextField
from fontawesome.fields import IconField
from geonode.maps.models import Map
from geonode.blog.models import Topic
from geonode.groups.models import GroupProfile
from django.core.urlresolvers import reverse
from django.template import defaultfilters


def get_upload_path(instance, filename):
    return os.path.join(
        "ms", "%s" % instance.id, filename)


class Microsite(models.Model):
    # size type for size of viewer like topics
    SIZE_TYPE = (
    ('s', 'Small (150x150)'),
    ('m', 'Medium (250x250)'),
    ('l', 'Large (250x150)'),
    ('x', 'XLarge (497x279)'),
    ('h', 'Horizontal (851x315)'),
    ('v', 'Vertical (1080x608)'),
    )
    group = models.ForeignKey(GroupProfile, verbose_name = "Grupo")
    topic = models.ManyToManyField(Topic, verbose_name="Tematicas", null=True, blank=True,
                                    help_text='Seleccione las tematicas.')
    name = models.CharField(verbose_name = "Nombre", max_length=200, unique=True)
    subtitle = models.CharField(verbose_name="Sub-Titulo", max_length=200, null=False, blank=True)
    description = RichTextField(verbose_name="Descripcion")
    url_name = models.CharField(validators=[validators.validate_slug],verbose_name = "Complementa la URL del sitio (http://idegeo.centrogeo.org.mx/ms/)",
                                help_text='El slug no puede tener espacios, caracteres especiales, ni arrobas', max_length=20, unique=True, blank=False, null=True)
    color = models.IntegerField(verbose_name='Color',null=True, blank=True, default=0)
    thematic = models.IntegerField(verbose_name='Thematizador',null=True, blank=True, default=0)
    cover_image = models.ImageField(verbose_name = "Imagen de portada", upload_to=get_upload_path, null=True, blank=True)
    image_1 = models.ImageField(verbose_name = "Logo 1", help_text='Este logo va en la parte superior izquierda del micro sitio (max 130x80 px)', upload_to=get_upload_path, null=True, blank=True, default=None)
    image_2 = models.ImageField(verbose_name = "Logo 2", help_text='Este logo va en la parte superior derecha del micro sitio (max 130x80 px)', upload_to=get_upload_path, null=True, blank=True)
    image_3 = models.ImageField(verbose_name = "Logo 3", help_text='Este logo va en la parte inferior izquierda del micro sitio (max 400x100 px)', upload_to=get_upload_path, null=True, blank=True)
    image_4 = models.ImageField(verbose_name = "Logo Red", help_text='Este logo es para vizualizarlo en el tipo de vizualizador red', upload_to=get_upload_path,null=True, blank=True)
    public = models.BooleanField(verbose_name = "Publicar", blank=True)
    header = models.TextField(verbose_name = "Encabezado",help_text='Aquí puedes personalizar el encabezado de la página',null=True, blank=True)
    viewer = models.TextField(verbose_name = "Visualizador",help_text='Aquí puedes personalizar el visualizador',null=True, blank=True)
    footer = models.TextField(verbose_name = "Pie de página",help_text='Aquí puedes personalizar el pie de página',null=True, blank=True)
    gray_colors = models.BooleanField(verbose_name="Marco en gris", blank=False, default=False)
    size = models.CharField(verbose_name = "Tipo", max_length=250, choices=SIZE_TYPE, blank=True, null=True, default='m')
    creation_date = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return self.name


class Section(models.Model):
    microsite = models.ForeignKey(Microsite, verbose_name="Micrositio", null=True, blank=True)
    parent_section = models.ForeignKey('self', on_delete=models.CASCADE, verbose_name="Section",
                                       related_name='children', null=True, blank=True)
    name = models.CharField(verbose_name="Nombre", max_length=40)
    url = models.URLField(verbose_name="URL externa", help_text='Solo para ligar a sitios externos', null=True, blank=True)
    description = RichTextField(verbose_name="Contenido", null=True, blank=True)
    icon = IconField()
    stack_order = models.IntegerField(null=True, blank=True)
    creation_date = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return self.name


class Category(models.Model):
    microsite = models.ForeignKey(Microsite, verbose_name="Micrositio", null=True, blank=True)
    parent_category = models.ForeignKey('self', on_delete=models.CASCADE, verbose_name="Category",
                                        related_name='children', null=True, blank=True)
    name = models.CharField(verbose_name="Nombre", max_length=100)
    slug = models.SlugField(blank=True)
    description = models.TextField(verbose_name='Descripcion', null=True, blank=True)
    image = models.ImageField(verbose_name="Imagen", help_text='Imagen', upload_to=get_upload_path, null=True, blank=True)
    order = models.PositiveIntegerField(default=0, editable=False, db_index=True)
    creation_date = models.DateField(auto_now_add=True)


    def get_absolute_url(self):
        return reverse("category_detail", kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        self.slug = defaultfilters.slugify(self.name[:50])
        super(Category, self).save(*args, **kwargs)

    class Meta:
        ordering = ['order']


    def __unicode__(self):
        return self.name


class Narrative(models.Model):
    microsite = models.ForeignKey(Microsite, verbose_name="Micrositio", null=True, blank=True)
    category = models.ForeignKey(Category, verbose_name="Asociar a una categoria",
                                 help_text="Elige una categoria para que se asocie a tu narrativa.", null=True,
                                 blank=True)
    name = models.CharField(verbose_name="Nombre", max_length=100)
    slug = models.SlugField(blank=True)
    author = models.CharField(verbose_name="Autor", max_length=100)
    description = models.CharField(verbose_name='Descripcion', max_length=140)
    url = models.URLField(verbose_name="URL externa", help_text='Solo para ligar a sitios externos', null=True, blank=True)
    narrative = RichTextField(verbose_name="Contenido",
                              help_text='Aquí puedes crear tu narrativa que se asociará a un micrositio o categoria', null=True, blank=True)
    image = models.ImageField(verbose_name="Portada", help_text='Portada de la narrativa', upload_to=get_upload_path, null=True, blank=True)
    public = models.BooleanField(verbose_name="Publicar", blank=True)
    draft = models.BooleanField(verbose_name="Draft", blank=True)
    order = models.PositiveIntegerField(default=0, editable=False, db_index=True)
    creation_date = models.DateField(auto_now_add=True)
    maps = models.ManyToManyField(Map, related_name='ms_narratives_maps', verbose_name="Mapas relacionados", null=True,
                                  blank=True)


    def get_absolute_url(self):
        return reverse("narrative_detail", kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        self.slug = defaultfilters.slugify(self.name[:50])
        super(Narrative, self).save(*args, **kwargs)

    class Meta:
        ordering = ['order']


    def __unicode__(self):
        return self.name
