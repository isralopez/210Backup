# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-06-05 16:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitoring', '0023_auto_20190528_0906'),
    ]

    operations = [
        migrations.AlterField(
            model_name='host',
            name='name',
            field=models.CharField(max_length=255),
        ),
    ]
