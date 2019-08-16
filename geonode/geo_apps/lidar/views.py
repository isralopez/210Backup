# -*- encoding: utf-8 -*-
from django.shortcuts import render
from django.contrib.sites.models import Site


def lidar(request, template='lidar_rgb.html'):
    site = Site.objects.get(id=1)
    return render(request, template, context={'site':site})


def catastro(request, template='catastro.html'):
    site = Site.objects.get(id=1)
    return render(request, template, context={'site':site})
