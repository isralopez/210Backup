import logging
from django.db import models
from django.conf import settings
from django.core.urlresolvers import reverse

IMGTYPES = ['jpg', 'jpeg', 'tif', 'tiff', 'png', 'gif']

logger = logging.getLogger(__name__)


class Investigation(models.Model):
    title = models.CharField(verbose_name = "Titulo", max_length=250, unique=True)
    alias = models.CharField(max_length=128, blank=True, null=True, verbose_name='Alias')
    leader = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name = "Responsable")
    side_members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="miembros_proyecto",
                                          verbose_name="Miembros de Proyecto", null=True, blank=True)
    abstract = models.TextField(verbose_name='Resumen')
    frontpage = models.FileField(upload_to='frontpages', null=True, blank=False, verbose_name='Caratula de Investigacion')
    coverage = models.CharField(verbose_name='Cobertura', max_length=250, null=True, blank=True)
    type = models.CharField(verbose_name="Tipo", max_length=125)
    public = models.BooleanField(verbose_name="Publicar")
    creation_date = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('detail_investigation', args=(self.id,))
