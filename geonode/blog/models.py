# encoding:utf-8
import os
from django.core import validators
from django.db import models
from django.core.urlresolvers import reverse
from ckeditor.fields import RichTextField
from django.template import defaultfilters


def get_upload_path(instance, filename):
    return os.path.join(
        "blog", filename)

FORMAT_CHOICES = (
    ('standard', 'Historia'),
    #('image', 'Imagen'),
    ('link', 'Enlace'),
    #('gallery', 'Galería'),
)


class Topic(models.Model):
    name = models.CharField(verbose_name="Tema", max_length=100)
    slug = models.SlugField()
    image = models.ImageField(verbose_name="Imagen", upload_to=get_upload_path, null=True, blank=True)
    description = models.TextField(verbose_name="Descripción", null=True, blank=True)
    active = models.BooleanField(verbose_name = "Activo", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def get_absolute_url(self):
        return reverse("blog_topic", kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        self.slug = defaultfilters.slugify(self.name[:50])
        super(Topic, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Post(models.Model):
    topic = models.ForeignKey(Topic, verbose_name="Asociar a una tema", null=True,
                                 blank=True)
    title = models.CharField(verbose_name = "Título", max_length=150, unique=True)
    slug = models.SlugField(blank=True)
    format = models.CharField(choices=FORMAT_CHOICES, default='standard', max_length=20)
    link = models.URLField(verbose_name="Enlace", null=True, blank=True)
    author = models.CharField(verbose_name="Autor", max_length=100, blank=True)
    post = RichTextField(verbose_name="Entrada", null=True, blank=True)
    image = models.ImageField(verbose_name="Imagen", upload_to=get_upload_path, null=True, blank=True)
    fix_index = models.BooleanField(verbose_name = "Destacado en inicio", default=False)
    active = models.BooleanField(verbose_name = "Activo", default=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def get_absolute_url(self):
        return reverse("blog_post", kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        self.slug = defaultfilters.slugify(self.title[:50])
        super(Post, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.title


class PostGallery(models.Model):
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to=get_upload_path)
    description = models.CharField(verbose_name = "Descripción", max_length=100, null=True, blank=True)

    def __str__(self):
        return self.image.url