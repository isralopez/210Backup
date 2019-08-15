from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.template import RequestContext, loader
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.core.exceptions import PermissionDenied
from django.contrib.sites.models import Site

from storymaps.investigation.models import Investigation
from storymaps.narratives.models import Narratives
# from project.models import Project
from storymaps.investigation.forms import InvestigationForm
from geonode.base.models import TopicCategory


def detail_investigation(request, investigation_id):
    item = get_object_or_404(Investigation, pk=investigation_id)
    narratives = Narratives.objects.filter(investigation=item)
    investigations = Investigation.objects.all().order_by('title')
    cat_list = []
    for narrative in narratives:
        if narrative.category:
            cat_list.append(narrative.category.id)
    categories = TopicCategory.objects.filter(pk__in= cat_list)
    return render(request, 'investigation_detail.html', context={
        'investigation': item,
        'narratives': narratives,
        'invest_list': investigations,
        'categories': categories
        })


@login_required
def upload_investigation(request, project_id):
    if request.method=='POST':
        investigation_form = InvestigationForm(request.POST, request.FILES)
        if investigation_form.is_valid():
            investigation_form.save()
            return HttpResponseRedirect(reverse("list_investigation"))
    else:
        investigation_form = InvestigationForm()
        # if project_id != '0':
        #     project = get_object_or_404(Project, pk=project_id)
        #     investigation_form.fields["responsible"].queryset = project.side_members.all().order_by('username')
    return render(request, 'investigation_upload.html', context={'form':investigation_form})


@login_required
def update_investigation(request, investigation_id):
    obj = get_object_or_404(Investigation, id=investigation_id)
    investigation_form = InvestigationForm(request.POST or None, request.FILES or None, instance=obj)
    #investigation_form.fields["responsible"].queryset = obj.project.side_members.all().order_by('username')
    if request.method == 'POST':
        if investigation_form.is_valid():
            investigation_form.save()
            return HttpResponseRedirect(reverse('list_investigation'))
    return render(request, 'investigation_upload.html', context={'form':investigation_form})


def list_investigation(request):
    investigations = Investigation.objects.all()
    return render(request, 'investigation_list.html', context={'items':investigations})


@login_required
def remove_investigation(request, investigation_id):
    try:
        investigation = get_object_or_404(Investigation, id=investigation_id)
        if request.method == 'POST':
            investigation.delete()
            return HttpResponseRedirect(reverse("list_investigation"))
        else:
            return HttpResponse("Not allowed", status=403)

    except PermissionDenied:
        return HttpResponse(
            'You are not allowed to delete this list_slopes',
            mimetype="text/plain",
            status=401
        )

# Vistas para busquedas
# def search_products_by_slope(request, slope_id):
#     html_prod = []
#     projects_n = Project.objects.filter(slope = slope_id)
#     for project in projects_n:
#         prods = Investigation.objects.filter(project = project.id)
#         html_prod = result_search_products(prods, html_prod)
#     return HttpResponse(html_prod)


def search_products_by_project(request, project_id):
    html_prod = []
    products_n = Investigation.objects.filter(project = project_id)
    html_prod = result_search_products(products_n, html_prod)
    return HttpResponse(html_prod)


def result_search_products(product, html_prod):
    site1 = Site.objects.get(id=1).domain
    for products in product:
        title_n = products.title.encode('unicode_escape')
        id_n = str(products.id)
        url = site1+"/storymaps/products/"+str(id_n)
        date_n = products.creation_date
        html_prod.append("<div class='mm-sjcat-T2-categories'>" \
                    "<a href='"+url+"'>" \
                    "<div class='mm-sjcat-T2-image'>"\
                        "<img src='/static/network/images/icon_productos_1.svg'>	"\
                    "</div>"\
                    "<div class='mm-sjcat-T2-title'>"+str(title_n)+"</div>"\
                    "<p class='mm-sjcat-T2-des'><i class='fa fa-calendar-o'></i> "+str(date_n)+"</p>"\
                    "</a>"\
                    "</div>")

    return html_prod