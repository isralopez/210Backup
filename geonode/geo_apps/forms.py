from django.forms import ModelForm
from geonode.geo_apps.models import Apps


class AppsForm(ModelForm):
    class Meta:
        model = Apps
        fields = '__all__'
