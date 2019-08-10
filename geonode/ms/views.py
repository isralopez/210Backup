import json

from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.core.exceptions import PermissionDenied
from django.contrib.sites.models import Site

from geonode.maps.models import Map
from geonode.documents.models import Document
from geonode.base.models import TopicCategory
from geonode.people.models import Profile

from geonode.ms.models import Microsite, Section, Category, Narrative
from geonode.ms.forms import MicrositeForm, SectionForm, MicrositeUpdate, SectionUpdate, CategoryForm, CategoryUpdate, SectionFullForm, NarrativeForm, NarrativeUpdate, MicrositeColorsForm, NarrativeMetaUpdate, NarrativeDespublishedUpdate, NarrativePublishedUpdate, MSPublishedUpdate, MicrositeUrlForm, SectionFullForm, Category_to_ms_Form, Category_to_ms_Update, Category_to_ms_Upd, CategoryMSForm, Narrative_to_msForm,NarrativeMetaUpdate_to_ms, Narrative_to_catForm, MicrositeTematizingForm,MicrositeLogoForm, MicrositeAdvanced


def ms_index(request, msurlname=None, template='ms_index.html'):
    group_list = []
    if request.user.is_authenticated():
        group_list = request.user.group_list_all()
    try:
        config = Microsite.objects.get(url_name=msurlname)
    except Microsite.DoesNotExist as e:
        raise Http404
    if config.public != True:
        if not config.group in group_list:
            if not request.user.is_superuser:
                raise Http404
    sections = Section.objects.filter(microsite=config).order_by('id')
    categorys = Category.objects.filter(microsite=config)
    cat_not_parent = Category.objects.filter(microsite=config).filter(parent_category=None)
    narratives = Narrative.objects.filter(public=True).filter(Q(microsite=config) | Q(category__in=categorys))
    cat = len(categorys)

    if (config.thematic == 8):
        template = 'index_vis/vis_smooth_scroll.html'
        cat_not_parent = list(i for i in cat_not_parent)

    return render(request, template, context={'config': config, 'sections': sections, 'categorys': categorys, 'cat_not_parent': cat_not_parent, 'cat': cat, 'narratives': narratives})


def ms_section(request, msurlname=None, idsection=None, template='ms_section.html'):
    group_list = []
    if request.user.is_authenticated():
        group_list = request.user.group_list_all()
    try:
        config = Microsite.objects.get(url_name=msurlname)
    except Microsite.DoesNotExist as e:
        raise Http404
    if config.public != True:
        if not config.group in group_list:
            if not request.user.is_superuser:
                raise Http404
    sections = Section.objects.filter(microsite=config).order_by('id')
    config_section = Section.objects.get(pk=idsection)
    return render(request, template, context={'config': config, 'sections': sections, 'config_section': config_section})


def ms_category(request, msurlname=None, idcategory=None, template='ms_category.html'):
    group_list = []
    if request.user.is_authenticated():
        group_list = request.user.group_list_all()
    try:
        config = Microsite.objects.get(url_name=msurlname)
    except Microsite.DoesNotExist as e:
        raise Http404
    if config.public != True:
        if not config.group in group_list:
            if not request.user.is_superuser:
                raise Http404
    sections = Section.objects.filter(microsite=config).order_by('id')
    try:
        config_category = Category.objects.get(pk=idcategory)
    except Category.DoesNotExist as e:
        raise Http404
    if config_category.microsite != config:
        raise Http404
    categorys = Category.objects.filter(parent_category=config_category)
    narratives = Narrative.objects.filter(Q(category=config_category) | Q(category__in=categorys)).filter(public=True)
    narratives_category = Narrative.objects.filter(category=config_category).filter(public=True)
    return render(request, template, context={'config': config, 'sections': sections, 'config_category': config_category, 'categorys': categorys, 'narratives': narratives, 'narratives_category':narratives_category})


def ms_narrative(request, msurlname=None, idnarrative=None, template='ms_narrative.html'):
    group_list = []
    if request.user.is_authenticated():
        group_list = request.user.group_list_all()
    try:
        config = Microsite.objects.get(url_name=msurlname)
    except Microsite.DoesNotExist as e:
        raise Http404
    sections = Section.objects.filter(microsite=config).order_by('id')
    config_narrative = Narrative.objects.get(pk=idnarrative)
    if config_narrative.public != True or config.public != True:
        if not config.group in group_list:
            if not request.user.is_superuser:
                raise Http404
    narratives = {}
    categorys = {}
    if config_narrative.category != None:
        narratives = Narrative.objects.filter(category=config_narrative.category).exclude(pk=idnarrative)
        if config_narrative.category.parent_category != None:
            categorys = Category.objects.filter(parent_category=config_narrative.category.parent_category).exclude(pk=config_narrative.category.id)
    return render(request, template, context={'config': config, 'sections': sections, 'narratives': narratives, 'categorys':categorys, 'config_narrative': config_narrative})


def category_json(request, idms=None, idcategory=None, template='index_vis/vis_category.json'):
    try:
        microsite = Microsite.objects.get(id=idms)
    except Microsite.DoesNotExist as e:
        raise Http404
    category_list = Category.objects.filter(id=idcategory)
    data = list(i for i in category_list)
    return render(request, template, context={'category_list': data, 'microsite': microsite})


def ms_json(request, idms=None, template='index_vis/vis.json'):
    try:
        microsite = Microsite.objects.get(id=idms)
    except Microsite.DoesNotExist as e:
        raise Http404
    narratives = Narrative.objects.filter(microsite=microsite).filter(category=None).filter(public=True)
    category_list = Category.objects.filter(microsite=microsite).filter(parent_category__isnull=True)
    data = list(i for i in category_list)
    print data
    return render(request, template, context={'category_list': data, 'narratives': narratives, 'microsite': microsite})


def ms_json_admin(request, idms=None, template='index_vis/vis.json'):
    try:
        microsite = Microsite.objects.get(id=idms)
    except Microsite.DoesNotExist as e:
        raise Http404
    narratives = Narrative.objects.filter(microsite=microsite).filter(category=None)
    category_list = Category.objects.filter(microsite=microsite).filter(parent_category__isnull=True)
    data = list(i for i in category_list)
    return render(request, template, context={'category_list': data, 'narratives': narratives, 'microsite': microsite})


def ms_nar_json(request, idms=None, template='index_vis/vis_narratives.json'):
    try:
        microsite = Microsite.objects.get(id=idms)
    except Microsite.DoesNotExist as e:
        raise Http404
    narratives = Narrative.objects.filter(microsite=microsite).filter(public=True)
    return render(request, template, context={'narratives': narratives, 'microsite': microsite})


# ADMIN GESTOR MS -->
@login_required
def ms_gestor_list(request):
    site1 = Site.objects.get(id=1).domain
    site = site1+"ms/"
    group_list = []
    if request.user.is_authenticated():
        group_list = request.user.group_list_all()
    if request.user.is_superuser:
        ms = Microsite.objects.all()
    else:
        ms = Microsite.objects.filter(group__in=group_list)
    sect = Section.objects.all()
    print ms
    return render(request, 'ms_gestor_list.html', context={'items': ms, 'section': sect, 'site': site})


def ms_public_list(request):
    ms = Microsite.objects.filter(public=True)

    return render(request, 'ms_public_list.html', context={'items': ms})


@login_required
def upload_ms(request):
    no_group = False
    if request.method == 'POST':
        ms_form = MicrositeForm(request.POST, request.FILES)
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../')
    else:
        ms_form = MicrositeForm()
        my_groups = request.user.group_list_all()
        ms_form.fields["group"].queryset = my_groups
        if not my_groups:
            no_group = True
    profile = get_object_or_404(Profile, username=request.user)
    return render(request, 'microSite_form.html', context={'form': ms_form, 'profile':profile, 'no_group': no_group})


@login_required
def ms_category_list(request, ms_id):
    sect = Category.objects.filter(microsite = ms_id)
    return render(request, 'category_list.html', context={'items':sect, 'ms_id':ms_id})


@login_required
def upload_section(request, ms_id):
    if request.method == 'POST':

        name = request.POST.get('name', False)
        url = request.POST.get('url', False)
        description = request.POST.get('description', False)
        icon = request.POST.get('icon', False)
        creation_date = request.POST.get('timestamp', False)
        ms_form = SectionFullForm({'microsite': ms_id, 'name':name, 'url':url, 'description':description,'icon':icon, 'creation_date':creation_date})
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../ms_detail/'+ms_id)
    else:
        ms_form = SectionForm()
    return render(request, 'section_form.html', context= {'form': ms_form, 'ms_id':ms_id})


@login_required
def update_ms(request, ms_id):
    obj = get_object_or_404(Microsite, id=ms_id)
    ms_form = MicrositeUpdate(request.POST or None, request.FILES or None, instance=obj)
    profile = get_object_or_404(Profile, username=request.user)
    if request.method == 'POST':
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../')
    return render(request, 'microSite_form.html', context={'form':ms_form, 'profile':profile, 'obj':obj})


@login_required
def advanced_ms(request, ms_id):
    # isValid = False
    obj = get_object_or_404(Microsite, id=ms_id)
    ms_form = MicrositeAdvanced(request.POST or None, request.FILES or None, instance=obj)
    if request.method == 'POST':
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../')
    return render(request, 'microSite_form.html', context={'form':ms_form})


@login_required
def ms_update_section(request, ms_id, section_id):
    obj = get_object_or_404(Section, id=section_id)
    ms_form = SectionUpdate(request.POST or None, request.FILES or None, instance=obj)
    if request.method == 'POST':
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../../ms_detail/'+ms_id)
    return render(request, 'section_form.html', context={'form':ms_form})


@login_required
def ms_remove_section(request, section_id, template='section_remove.html'):
    try:
        sections = get_object_or_404(Section, id=section_id)
        if request.method == 'GET':
            return render(request, template, context={"sect": sections})
        if request.method == 'POST':
            sections.delete()
            return HttpResponseRedirect(reverse("ms_gestor_list"))
        else:
            return HttpResponse("Not allowed", status=403)

    except PermissionDenied:
        return HttpResponse(
            'You are not allowed to delete this ms_gestor_list',
            mimetype="text/plain",
            status=401
        )


@login_required
def ms_upload_category(request, ms_id):
    if request.method == 'POST':
        ms_name = get_object_or_404(Microsite, id=ms_id)
        name = request.POST.get('name', False)
        description = request.POST.get('description', False)
        creation_date = request.POST.get('timestamp', False)
        parent_category = request.POST.get('parent_category', False)
        ms_form = CategoryForm({'microsite':ms_id,'parent_category': parent_category,'name':name, 'description':description,'creation_date':creation_date}, request.FILES)
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../ms_detail/'+ms_id)
    else:
        ms_name = get_object_or_404(Microsite, id=ms_id)
        ms_form = CategoryMSForm()
        ms_form.fields['parent_category'].queryset = Category.objects.filter(microsite=ms_id)
    return render(request, 'category_form.html', context={'form': ms_form, 'cat_of':ms_name.name})


@login_required
def ms_narrative_list(request, ms_id):
    narratives_ms = Narrative.objects.filter(microsite = ms_id)
    return render(request, 'narrative_list.html', context= {'narratives': narratives_ms, 'ms_id': ms_id})


def ms_upload_narrative(request, ms_id):
    if request.method == 'POST':
        ms_form = NarrativeForm(request.POST, request.FILES)
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../ms_detail/'+ms_id)
    else:
        ms_form = NarrativeForm()
    return render(request, 'narrative_form.html', context={'form': ms_form})


@login_required
def ms_update_category(request, category_id, ms_id):
    obj = get_object_or_404(Category, id=category_id)
    ms_form = CategoryUpdate(request.POST or None, request.FILES or None, instance=obj)
    if request.method == 'POST':

        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../../ms_detail/'+ms_id)
    return render(request, 'category_form.html', context={'form':ms_form})


@login_required
def ms_remove_category(request, category_id, ms_id, template='category_remove.html'):
    try:
        cat = get_object_or_404(Category, id=category_id)
        if request.method == 'GET':
            return render(request, template, context= {
                "cat": cat,
                'ms_id': ms_id
            })
        if request.method == 'POST':
            cat.delete()
            return HttpResponseRedirect('../../ms_category_list/'+ms_id)
        else:
            return HttpResponse("Not allowed", status=403)

    except PermissionDenied:
        return HttpResponse(
            'You are not allowed to delete this ms_category_list',
            mimetype="text/plain",
            status=401
        )

@login_required
def ms_update_narrative_meta(request, narrative_id, ms_id):
    obj = get_object_or_404(Narrative, id=narrative_id)
    ms_form = NarrativeMetaUpdate(request.POST or None, request.FILES or None, instance=obj)
    ms_form.fields["category"].queryset = Category.objects.filter(microsite = ms_id).order_by('name')
    if request.method == 'POST':

        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../../ms_detail/'+ms_id)
    return render(request, 'narrative_form.html', context={'form':ms_form})


@login_required
def ms_remove_narrative(request, narrative_id, ms_id, template='narrative_remove.html'):
    try:
        nar = get_object_or_404(Narrative, id=narrative_id)
        if request.method == 'GET':
            return render(request, template, context={
                "nar": nar,
                'ms_id': ms_id
            })
        if request.method == 'POST':
            nar.delete()
            return HttpResponseRedirect('../../ms_detail/'+ms_id)
        else:
            return HttpResponse("Not allowed", status=403)

    except PermissionDenied:
        return HttpResponse(
            'You are not allowed to delete this ms_narrative_list',
            mimetype="text/plain",
            status=401
        )


def ms_save_color(request):
    if request.is_ajax():
        data_list = []
        query_data = json.loads(request.POST['query_data'])
        id_ms=query_data['id_ms']
        id_color = query_data['id_color']
        try:
            obj = get_object_or_404(Microsite, id=id_ms)
            data_list.append(obj.url_name)
            colors_form = MicrositeColorsForm({'color': id_color}, instance = obj)
            if colors_form.is_valid():
                colors_form.save()
            return HttpResponse( json.dumps(data_list), content_type='application/json' )
        except Microsite.DoesNotExist:
            print("Error No existe el objeto")
            return HttpResponse( json.dumps(data_list), content_type='application/json' )
    else:
        return HttpResponse("Solo Ajax")


def ms_grays(request):
    if request.is_ajax():
        query_data = json.loads(request.POST['query_data'])
        id_ms = query_data['id_ms']
        grays = query_data['grays']
        obj = get_object_or_404(Microsite, id=id_ms)
        obj.gray_colors = grays
        obj.save()

        return HttpResponse( json.dumps({'exito':'si'}), content_type='application/json' )
    else:
        return HttpResponse("Solo Ajax")

@login_required
def ms_update_narrative(request, narrative_id, ms_id):
    obj = get_object_or_404(Narrative, id=narrative_id)
    ms_form = NarrativeUpdate(request.POST or None, request.FILES or None, instance=obj)
    if request.method == 'POST':

        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../../ms_detail/'+ms_id)
    return render(request, 'narrative_form.html', context={'form':ms_form})


@login_required
def ms_narrative_detail(request, narrative_id, ms_id):
    narr = get_object_or_404(Narrative, id=narrative_id)
    return render(request, 'narrative_detail.html', context={'narrative':narr, 'ms_id':ms_id})


@login_required
def ms_narrative_publish(request, narrative_id, ms_id):
    obj = get_object_or_404(Narrative, id=narrative_id)
    public = 1
    ms_form = NarrativePublishedUpdate({'public': public}, instance=obj)
    if ms_form.is_valid():
        ms_form.save()
    return render(request, 'narrative_detail.html', context={'narrative':obj, 'ms_id':ms_id})


@login_required
def ms_narrative_unpublish(request, narrative_id, ms_id):
    obj = get_object_or_404(Narrative, id=narrative_id)
    public = 0
    ms_form = NarrativePublishedUpdate({'public': public}, instance=obj)
    if ms_form.is_valid():
        ms_form.save()
    return render(request, 'narrative_detail.html', context={'narrative':obj, 'ms_id':ms_id})


@login_required
def ms_publish(ms_id):
    ms = get_object_or_404(Microsite, id=ms_id)
    ms.public = True
    ms.save()

    return HttpResponseRedirect(reverse('ms_index', args=[ms.url_name]))


@login_required
def ms_remove(request, ms_id, template='ms_remove.html'):
    try:
        sections = get_object_or_404(Microsite, id=ms_id)
        if request.method == 'GET':
            return render(request, template, context={
                "ms": sections
            })
        if request.method == 'POST':
            sections.delete()
            return HttpResponseRedirect(reverse("ms_gestor_list"))
        else:
            return HttpResponse("Not allowed", status=403)

    except PermissionDenied:
        return HttpResponse(
            'You are not allowed to delete this ms_gestor_list',
            mimetype="text/plain",
            status=401
        )


@login_required
def ms_detail(request, ms_id):
    site1 = Site.objects.get(id=1).domain
    site = site1+"ms/"
    ms = get_object_or_404(Microsite, id= ms_id)
    sect = Section.objects.filter(microsite = ms_id).order_by('name')
    nar_msite = Narrative.objects.filter(microsite = ms_id).filter(category__isnull=True)
    cat_msite = Category.objects.filter(microsite = ms_id)
    cat_of_narras = Category.objects.filter(microsite = ms_id).filter(parent_category__isnull=True)
    data = list(i for i in cat_of_narras)
    return render(request, 'ms_detail.html', context= {
        'cat_of_narras': data,
        'ms': ms,
        'section': sect,
        'site': site,
        'cats': cat_msite,
        'narras': nar_msite
    })


@login_required
def ms_category_edit(request, ms_id, cat_id):
    ms = get_object_or_404(Microsite, id= ms_id)
    cat = get_object_or_404(Category, id=cat_id)
    nar_msite = Narrative.objects.filter(microsite = ms_id).filter(category=cat_id)
    cat_of_narras = Category.objects.filter(microsite = ms_id).filter(parent_category=cat_id)
    return render(request, 'ms_category_edit.html', context={
        'cat_of_narras': cat_of_narras,
        'ms': ms,
        'cat': cat,
        'narras': nar_msite
    })


@login_required
def ms_upload_category_to_ms(request, ms_id):
    if request.method == 'POST':
        ms_name = get_object_or_404(Microsite, id=ms_id)
        name = request.POST.get('name', False)
        description = request.POST.get('description', False)
        creation_date = request.POST.get('timestamp', False)
        ms_form = Category_to_ms_Update({'microsite': ms_id, 'name':name, 'description':description,'creation_date':creation_date}, request.FILES)
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../ms_detail/'+ms_id)
    else:
        ms_name = get_object_or_404(Microsite, id=ms_id)
        ms_form = Category_to_ms_Form()
    return render(request, 'category_form.html', context={'form': ms_form, 'cat_of':ms_name.name})


@login_required
def ms_upload_category_to_parent_cat(request, ms_id, category_id):
    if request.method == 'POST':
        cat_name = get_object_or_404(Category, id=category_id)
        name = request.POST.get('name', False)
        description = request.POST.get('description', False)
        creation_date = request.POST.get('timestamp', False)
        ms_form = CategoryForm({'microsite': ms_id, 'parent_category':category_id, 'name':name, 'description':description,'creation_date':creation_date}, request.FILES)
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../../ms_detail/'+ms_id)
    else:
        cat_name = get_object_or_404(Category, id=category_id)
        ms_form = Category_to_ms_Form()
    return render(request, 'category_form.html', context={'form': ms_form, 'cat_of':cat_name.name})


@login_required
def ms_update_category_to_ms(request, category_id, ms_id):
    obj = get_object_or_404(Category, id=category_id)
    ms_name = get_object_or_404(Microsite, id=ms_id)
    ms_form = Category_to_ms_Upd(request.POST or None, request.FILES or None, request.FILES or None, instance=obj)
    if request.method == 'POST':
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../../ms_detail/'+ms_id)
    return render(request, 'category_form.html', context={'form':ms_form, 'cat_of':ms_name.name})


@login_required
def ms_upload_narrative_to_ms(request, ms_id):
    if request.method == 'POST':
        ms_name = get_object_or_404(Microsite, id=ms_id)
        name = request.POST.get('name', False)
        author = request.POST.get('author', False)
        description = request.POST.get('description', False)
        creation_date = request.POST.get('timestamp', False)
        public = request.POST.get('public', False)
        url = request.POST.get('url', False)
        narrative = request.POST.get('narrative', False)
        ms_form = NarrativeForm({'microsite': ms_id, 'name': name, 'author':author, 'url':url, 'description':description,'narrative':narrative,'public':public,'creation_date':creation_date}, request.FILES)
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../ms_detail/'+ms_id)
    else:
        ms_name = get_object_or_404(Microsite, id=ms_id)
        ms_form = Narrative_to_msForm()
    return render(request, 'narrative_form.html', context={'form': ms_form, 'nar_of':ms_name.name})


@login_required
def ms_update_narrative_meta_to_ms(request, narrative_id, ms_id):
    obj = get_object_or_404(Narrative, id=narrative_id)
    ms_form = NarrativeMetaUpdate_to_ms(request.POST or None, request.FILES or None, instance=obj)
    if request.method == 'POST':
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../../ms_update_narrative/'+narrative_id+'/'+ms_id)
    return render(request, 'narrative_form.html', context={'form':ms_form})

@login_required
def ms_upload_narrative_to_cat(request, ms_id, category_id):
    if request.method == 'POST':
        ms_name = get_object_or_404(Microsite, id=ms_id)
        name = request.POST.get('name', False)
        author = request.POST.get('author', False)
        description = request.POST.get('description', False)
        creation_date = request.POST.get('timestamp', False)
        public = request.POST.get('public', False)
        url = request.POST.get('url', False)
        narrative = request.POST.get('narrative', False)
        ms_form = NarrativeForm({'microsite': ms_id, 'category': category_id, 'name':name, 'author':author, 'description':description, 'url':url, 'narrative':narrative,'public':public,'creation_date':creation_date}, request.FILES)
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../../ms_detail/'+ms_id)
    else:
        ms_name = get_object_or_404(Microsite, id=ms_id)
        ms_form = Narrative_to_catForm()
    return render(request, 'narrative_form.html', context={'form': ms_form, 'nar_of':ms_name.name})


def ms_search_narrative(request):
    if request.is_ajax():
        data_list = []
        query_data = json.loads(request.POST['query_data'])
        id_ms=query_data['id_ms']
        id_cat = query_data['cat']
        try:
            site1 = Site.objects.get(id=1).domain
            site = site1+"ms/"
            if id_cat=="0":
                nar = Narrative.objects.filter(microsite = id_ms, category__isnull=False)
            else:
                nar = Narrative.objects.filter(category = id_cat, microsite = id_ms)
            for narrativ in nar:
                data_l = []
                data_l.append(narrativ.name)
                data_l.append(narrativ.category.name)
                data_l.append(narrativ.description)
                data_l.append(narrativ.id)
                data_l.append(site)
                data_list.append(data_l)
            return HttpResponse( json.dumps(data_list), content_type='application/json' )
        except Microsite.DoesNotExist:
            print("Error No existe el objeto")
            return HttpResponse( json.dumps(data_list), content_type='application/json' )
    else:
        return HttpResponse("Solo Ajax")


def ms_save_thmatizing(request):
    if request.is_ajax():
        data_list = []
        query_data = json.loads(request.POST['query_data'])
        id_ms=query_data['id_ms']
        id_tematics = query_data['id_tematics']
        try:
            obj = get_object_or_404(Microsite, id=id_ms)
            data_list.append(obj.url_name)
            colors_form = MicrositeTematizingForm({'thematic': id_tematics}, instance = obj)
            if colors_form.is_valid():
                colors_form.save()
            return HttpResponse( json.dumps(data_list), content_type='application/json' )
        except Microsite.DoesNotExist:
            print("Error No existe el objeto")
            return HttpResponse( json.dumps(data_list), content_type='application/json' )

    else:
        return HttpResponse("Solo Ajax")


@login_required
def upload_section_parent(request, ms_id, sect_id):
    if request.method == 'POST':
        name = request.POST.get('name', False)
        url = request.POST.get('url', False)
        description = request.POST.get('description', False)
        icon = request.POST.get('icon', False)
        creation_date = request.POST.get('timestamp', False)
        ms_form = SectionFullForm({'parent_section': sect_id, 'name':name, 'url':url, 'description':description,'icon':icon, 'creation_date':creation_date})
        if ms_form.is_valid():
            ms_form.save()
            return HttpResponseRedirect('../../ms_detail/'+ms_id)
    else:
        ms_form = SectionForm()
    return render(request, 'section_form.html', context={'form': ms_form, 'ms_id':ms_id})


def ms_search_cat(request):
    if request.is_ajax():

        category_list = []
        query_data = json.loads(request.POST['query_data'])
        id_ms=query_data['id_ms']
        id_cat = query_data['cat']
        try:
            site1 = Site.objects.get(id=1).domain
            site = site1+"ms/"
            cat_padre = Category.objects.filter(parent_category = id_cat, microsite = id_ms)
            if cat_padre is None:
                cat_padre = Category.objects.filter(category = id_cat, microsite = id_ms)
            for cats in cat_padre:
                data_list = []
                data_list.append(cats.name)
                data_list.append(cats.parent_category.name)
                data_list.append(cats.description)
                data_list.append(cats.id)
                data_list.append(site)
                category_list.append(data_list)
            return HttpResponse( json.dumps(category_list), content_type='application/json' )
        except Microsite.DoesNotExist:
            print("Error No existe el objeto")
            return HttpResponse( json.dumps(category_list), content_type='application/json' )
    else:
        return HttpResponse("Solo Ajax")


def ms_list_maps(request):

    maps = Map.objects.order_by('title')

    return render(request, 'maps_list.html', context={'maps': maps})


def ms_list_documents(request):

    category_list = TopicCategory.objects.all().order_by('gn_description')
    category_dict = {}

    for category in category_list:
        document_dict = {}
        document_list = Document.objects.filter(category=category.id).exclude(doc_type="mapa").order_by('title')
        if document_list:
            for document in document_list:
                document_dict[document] = document
            category_dict[category] = document_dict

    return render(request, 'documents_list.html', context={'categorys':category_dict})


def sort_menu(request):
    if request.is_ajax():
        sorted_ids = json.loads(request.POST['sorted_ids'])
        st_order=1
        for e in sorted_ids:
            section = get_object_or_404(Section, id=int(e))
            section.stack_order = st_order
            section.save()
            st_order += 1

        return HttpResponse(json.dumps({'ok': 'ok'}), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")


@login_required
def sort_category(request):
    if request.is_ajax():
        sorted_ids = json.loads(request.POST['sorted_ids'])
        st_order=1
        for e in sorted_ids:
            item = get_object_or_404(Category, id=int(e))
            item.order = st_order
            item.save()
            st_order += 1

        return HttpResponse(json.dumps({'ok': 'ok'}), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")


@login_required
def sort_narrative(request):
    if request.is_ajax():
        sorted_ids = json.loads(request.POST['sorted_ids'])
        st_order=1
        for e in sorted_ids:
            item = get_object_or_404(Narrative, id=int(e))
            item.order = st_order
            item.save()
            st_order += 1

        return HttpResponse(json.dumps({'ok': 'ok'}), content_type="application/json")
    else:
        return HttpResponse("Not ajax request")
