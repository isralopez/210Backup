# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-02-11 22:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mviewer', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='layeridmarker',
            name='title',
            field=models.CharField(max_length=200, null=True, verbose_name=b'Titulo'),
        ),
    ]