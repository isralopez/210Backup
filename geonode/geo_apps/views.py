from django.http import HttpResponse, HttpResponseRedirect, Http404, HttpResponseNotAllowed, HttpResponseServerError
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from geonode.geo_apps.forms import AppsForm

# Create your views here.
@login_required
def create_app(request):
    if request.method == 'POST':
        ms_form = AppsForm(request.POST, request.FILES)
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../../mviewer')
    else:
        ms_form = AppsForm()
    return render(request, 'apps_form.html', context={'form': ms_form})
