# -*- coding: utf-8 -*-
# Generated by Django 1.11.22 on 2019-08-12 22:15
from __future__ import unicode_literals

import ckeditor.fields
from django.db import migrations, models
import django.db.models.deletion
import geonode.blog.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150, unique=True, verbose_name=b'T\xc3\xadtulo')),
                ('slug', models.SlugField(blank=True)),
                ('format', models.CharField(choices=[(b'standard', b'Historia'), (b'link', b'Enlace')], default=b'standard', max_length=20)),
                ('link', models.URLField(blank=True, null=True, verbose_name=b'Enlace')),
                ('author', models.CharField(blank=True, max_length=100, verbose_name=b'Autor')),
                ('post', ckeditor.fields.RichTextField(blank=True, null=True, verbose_name=b'Entrada')),
                ('image', models.ImageField(blank=True, null=True, upload_to=geonode.blog.models.get_upload_path, verbose_name=b'Imagen')),
                ('fix_index', models.BooleanField(default=False, verbose_name=b'Destacado en inicio')),
                ('active', models.BooleanField(default=True, verbose_name=b'Activo')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='PostGallery',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=geonode.blog.models.get_upload_path)),
                ('description', models.CharField(blank=True, max_length=100, null=True, verbose_name=b'Descripci\xc3\xb3n')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='blog.Post')),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name=b'Tema')),
                ('slug', models.SlugField()),
                ('image', models.ImageField(blank=True, null=True, upload_to=geonode.blog.models.get_upload_path, verbose_name=b'Imagen')),
                ('description', models.TextField(blank=True, null=True, verbose_name=b'Descripci\xc3\xb3n')),
                ('active', models.BooleanField(default=True, verbose_name=b'Activo')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.AddField(
            model_name='post',
            name='topic',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='blog.Topic', verbose_name=b'Asociar a una tema'),
        ),
    ]