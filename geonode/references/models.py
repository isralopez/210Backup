# encoding:utf-8
from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse
from ckeditor.fields import RichTextField
from django.template import defaultfilters


class Reference(models.Model):
    title = models.CharField(verbose_name = "Título", max_length=150, unique=True)
    slug = models.SlugField(blank=True)
    narrative = RichTextField(verbose_name="Referencia", null=True, blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, verbose_name=_("Owner"))
    creation_date = models.DateField(auto_now_add=True)

    def get_absolute_url(self):
        return reverse("references", kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        self.slug = defaultfilters.slugify(self.title[:50])
        super(Reference, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.title