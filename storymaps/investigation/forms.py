from django import forms
from django.forms import ModelForm

from storymaps.investigation.models import Investigation

TYPE_CHOICES = (
    ("Investigacion", "Investigacion"),
    ("Proyecto", "Proyecto")
)


class InvestigationForm(ModelForm):
    type = forms.ChoiceField(choices=TYPE_CHOICES, label="Tipo", widget=forms.Select(), required=True)

    class Meta:
        model = Investigation
        fields = '__all__'
