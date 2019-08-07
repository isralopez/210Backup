# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import fontawesome.fields
import ckeditor.fields
import re
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('layers', '0033_auto_20180606_1543'),
        ('groups', '0028_auto_20180606_1543'),
    ]

    operations = [
        migrations.CreateModel(
            name='LayeridMarker',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lat', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('lng', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('narrative', ckeditor.fields.RichTextField(null=True, verbose_name=b'Narrativa de Marcador', blank=True)),
                ('icon', fontawesome.fields.IconField(default=b'info', max_length=60, verbose_name=b'Icono', blank=True)),
                ('options', models.CharField(max_length=500, null=True, verbose_name=b'Opciones del marcador', blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='LayerIds',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('visible', models.BooleanField(default=False)),
                ('name', models.CharField(max_length=200, null=True)),
                ('title', models.CharField(max_length=200, null=True)),
                ('style', models.CharField(max_length=250, null=True)),
                ('default_style', models.CharField(max_length=250, null=True)),
                ('stack_order', models.IntegerField(null=True, blank=True)),
                ('narrative', ckeditor.fields.RichTextField(null=True, verbose_name=b'Narrativa de Capa', blank=True)),
                ('layer', models.ForeignKey(to='layers.Layer', db_column=b'layer_id')),
                ('markers', models.ManyToManyField(to='mviewer.LayeridMarker', blank=True)),
            ],
            options={
                'db_table': 'mviewer_topic_layer_ids',
            },
        ),
        migrations.CreateModel(
            name='MViewer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200, verbose_name=b'Nombre')),
                ('url_id', models.CharField(null=True, max_length=20, validators=[django.core.validators.RegexValidator(re.compile('^[-a-zA-Z0-9_]+\\Z'), "Enter a valid 'slug' consisting of letters, numbers, underscores or hyphens.", 'invalid')], help_text=b'El identificador no puede tener espacios, caracteres especiales, ni arrobas', unique=True, verbose_name=b'Identificador del visualizador')),
                ('is_public', models.BooleanField(default=False, verbose_name=b'Es p\xc3\xbablico')),
                ('image', models.ImageField(upload_to=b'images/', null=True, verbose_name=b'Imagen', blank=True)),
                ('description', ckeditor.fields.RichTextField(null=True, verbose_name=b'Descripcion', blank=True)),
                ('bbox_x0', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('bbox_y0', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('bbox_x1', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('bbox_y1', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('config', models.CharField(max_length=200, null=True, verbose_name=b'Mapa Base', blank=True)),
                ('creation_date', models.DateField(auto_now_add=True)),
                ('group', models.ForeignKey(verbose_name=b'Grupo', to='groups.GroupProfile')),
                ('layer_mask', models.ForeignKey(blank=True, to='layers.Layer', help_text=b'Seleccione una capa tipo poligono como mascara.', null=True, verbose_name=b'Capa de mascara')),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=40, verbose_name=b'Nombre')),
                ('description', models.TextField(max_length=200, verbose_name=b'Descripcion')),
                ('creation_date', models.DateField(auto_now_add=True)),
                ('stack_order', models.IntegerField(null=True, blank=True)),
                ('layer_ids', models.ManyToManyField(to='layers.Layer', verbose_name=b'IDs de capas', through='mviewer.LayerIds')),
                ('mviewer', models.ForeignKey(verbose_name=b'Visualizador', blank=True, to='mviewer.MViewer', null=True)),
            ],
        ),
        migrations.AddField(
            model_name='layerids',
            name='topic',
            field=models.ForeignKey(to='mviewer.Topic', db_column=b'topic_id'),
        ),
    ]
