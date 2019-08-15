import json
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import PermissionDenied
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.contrib.sites.models import Site

from storymaps.narratives.models import Narratives
from storymaps.investigation.models import Investigation
from geonode.maps.models import Map
from geonode.base.forms import CategoryForm
from geonode.base.models import TopicCategory
from geonode.documents.models import Document
from storymaps.narratives.forms import NarrativesForm, Narratives2Update, NarrativesMetadata


def detail_narrative(request, narrative_id):
    item = get_object_or_404(Narratives, pk=narrative_id)
    domain = Site.objects.get(id=1).domain
    return render(request, 'narratives_detail.html', context={'narrative': item, 'domain': domain})


@login_required
def upload_narrative(request, investigation_id):
    user = request.user
    if request.method == 'POST':
        narrative_form = NarrativesForm(request.POST, request.FILES)
        category_form = CategoryForm(
            request.POST,
            prefix="category_choice_field",
            initial=int(request.POST["category_choice_field"]) if "category_choice_field" in request.POST else None)

        if narrative_form.is_valid() and category_form.is_valid():
            new_category = TopicCategory.objects.get(
                id=category_form.cleaned_data['category_choice_field'])
            the_narrative = narrative_form.save()
            Narratives.objects.filter(id=the_narrative.id).update(
                category=new_category)
            Narratives.objects.get(id=the_narrative.id).author.add(user)
            return HttpResponseRedirect(reverse('list_narratives'))
    else:
        narrative_form = NarrativesForm()
        category_form = CategoryForm(prefix="category_choice_field")
        if investigation_id != '0':
            prod = get_object_or_404(Investigation, pk=investigation_id)
            #narrative_form.fields["author"].queryset = prod.project.side_members.all().order_by('username')
            #narrative_form.fields["publisher"].queryset = prod.project.side_members.all().order_by('username')
    return render(request, 'storymap_share.html', context={
        'form': narrative_form, 'coverage': json.dumps('19,-99'), "category_form": category_form
    })


@login_required
def metadata_narrative(request, narrative_id):
    obj = get_object_or_404(Narratives, id=narrative_id)
    topic_category = obj.category

    if request.method == "POST":
        narrative_form = NarrativesMetadata(request.POST, request.FILES, instance=obj)
        category_form = CategoryForm(
            request.POST,
            prefix="category_choice_field",
            initial=int(
                request.POST["category_choice_field"]) if "category_choice_field" in request.POST else None)
    else:
        narrative_form = NarrativesMetadata(instance=obj)
        category_form = CategoryForm(
            prefix="category_choice_field",
            initial=topic_category.id if topic_category else None)

    if obj.coverage:
        coverage = obj.coverage
    else:
        coverage = '19,-99'

    if request.method == 'POST':
        if narrative_form.is_valid() and category_form.is_valid():
            new_category = TopicCategory.objects.get(
                id=category_form.cleaned_data['category_choice_field'])
            the_narrative = narrative_form.save()
            Narratives.objects.filter(id=the_narrative.id).update(
                category=new_category)
            return HttpResponseRedirect(reverse('list_narratives'))

    return render(request, 'narratives_metadata.html', context={
        'form': narrative_form,
        'coverage': json.dumps(coverage),
        "category_form": category_form,
    })


@login_required
def content_narrative(request, narrative_id):
    obj = get_object_or_404(Narratives, id=narrative_id)
    narrative_form = Narratives2Update(request.POST or None, request.FILES or None, instance=obj)
    if request.method == 'POST':
        if narrative_form.is_valid():
            narrative_form.save()
            return HttpResponseRedirect(reverse('storymaps'))
    return render(request, 'narratives_content.html', context={'form': narrative_form, 'narrative': obj})


@login_required
def remove_narrative(request, narrative_id):
    try:
        narrative = get_object_or_404(Narratives, id=narrative_id)
        if request.method == 'POST':
            narrative.delete()
            return HttpResponseRedirect(reverse("list_narratives"))
        else:
            return HttpResponse("Not allowed", status=403)

    except PermissionDenied:
        return HttpResponse(
            'You are not allowed to delete this list_slopes',
            mimetype="text/plain",
            status=401
        )


def list_maps(request):
    maps = Map.objects.all()
    return render(request, 'maps_list.html', context={'items': maps})


def list_documents(request):
    documents = Document.objects.exclude(doc_type="mapa")
    return render(request, 'documents_list.html', context={'items': documents})


def list_narratives(request):
    narratives = Narratives.objects.all()
    cat_list = []
    for narrative in narratives:
        if narrative.category:
            cat_list.append(narrative.category.id)
    categories = TopicCategory.objects.filter(pk__in=cat_list)
    return render(request, 'narratives_list.html', context={'items': narratives, 'categories': categories})


def search_narrative_by_product(request, id_product):
    html_narr = []
    narratives = Narratives.objects.filter(product = id_product)
    html_narr = result_search_narrative(narratives, html_narr)
    return HttpResponse(html_narr)


def search_narrative_by_project(request, project_id):
    html_narr = []
    products_n = Investigation.objects.filter(project = project_id)
    for product in products_n:
        narratives = Narratives.objects.filter(product = product.id)
        html_narr = result_search_narrative(narratives, html_narr)
    return HttpResponse(html_narr)


def result_search_narrative(narratives, html_narr):
    site1 = Site.objects.get(id=1).domain
    for narrative in narratives:
        title_n = narrative.title.encode('unicode_escape')
        id_n = str(narrative.id)
        url = site1+"/storymaps/narratives/"+str(id_n)
        date_n = narrative.creation_date

        html_narr.append("<div class='mm-sjcat-T2-categories'>" \
                    "<a href='"+url+"'>" \
                    "<div class='mm-sjcat-T2-image'>"\
                        "<img src='/static/network/images/icon_narrativas_1.svg'>	"\
                    "</div>"\
                    "<div class='mm-sjcat-T2-title'>"+str(title_n)+"</div>"\
                    "<p class='mm-sjcat-T2-des'><i class='fa fa-calendar-o'></i> "+str(date_n)+"</p>"\
                    "</a>"\
                    "<div class='narrEdit'>"\
                    "<a href='{% url 'update_narrative' "+id_n+" %}' data-toggle='tooltip' title='Editar metadato' class='fa fa-bars fa-1x'></a>"\
                    "<a href='{% url 'update2_narrative' "+id_n+" %}' data-toggle='tooltip' title='Editar narrativa' class='fa fa-file-text-o fa-1x'></a>"\
                    "</div>"\
                    "<div class='mm-sjcat-T2-dot'></div>"\
                    "</div>")
    return html_narr
