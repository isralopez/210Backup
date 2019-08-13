from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from geonode.references.models import Reference
from geonode.references.forms import ReferenceForm
from django.core.exceptions import PermissionDenied


def reference(request, slug, template='reference.html'):

    try:
        reference = Reference.objects.get(slug=slug)
    except Reference.DoesNotExist as e:
        raise Http404

    return render(request, template, context={'reference': reference})


# Admin
@login_required
def references_admin(request, template='admin/references.html'):

    references = Reference.objects.filter(owner=request.user)

    return render(request, template, context={'references': references})


def references_list(request, template='admin/references_list.html'):

    references = Reference.objects.filter(owner=request.user)

    return render(request, template, context={'references': references})


@login_required
def reference_add(request):

    if request.method == 'POST':
        form = ReferenceForm(request.POST, request.FILES)
        if form.is_valid():
            obj = form.save()
            obj.owner = request.user
            obj.save()
            return HttpResponseRedirect('../admin/')
    else:
        form = ReferenceForm()

    return render(request, 'admin/references_form.html', context={'form': form})


@login_required
def reference_edit(request, id):

    obj = get_object_or_404(Reference, id=id)
    form = ReferenceForm(request.POST or None, request.FILES or None, instance=obj)
    if request.method == 'POST':

        if form.is_valid():
            form.save()
            return HttpResponseRedirect('../../admin/')
    return render(request,'admin/references_form.html', context={'form':form})


@login_required
def reference_remove(request, id, template='admin/reference_remove.html'):

    try:
        reference = get_object_or_404(Reference, id=id)
        if request.method == 'GET':
            return render(request, template, context={
                "reference": reference,
                'id': id
            })
        if request.method == 'POST':
            reference.delete()
            return HttpResponseRedirect('/references/admin/')
        else:
            return HttpResponse("Not allowed", status=403)

    except PermissionDenied:
        return HttpResponse(
            'You are not allowed to delete this ms_narrative_list',
            mimetype="text/plain",
            status=401
        )