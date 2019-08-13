from django import forms
from django.forms import ModelForm
from geonode.references.models import Reference


class ReferenceForm(ModelForm):
    class Meta:
        model = Reference
        exclude = ['slug', 'owner']
