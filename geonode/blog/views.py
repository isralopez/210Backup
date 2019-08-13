from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404
from django.template import RequestContext
from django.core.exceptions import PermissionDenied
from django.contrib.auth.decorators import login_required
#from geonode.directory.models import Institution
from geonode.blog.models import Topic, Post
from geonode.blog.forms import TopicForm, PostForm, PostUpdate, LinkForm, LinkUpdate


def blog_index(request, template='blog/blog_index.html'):

    posts = Post.objects.filter(active=True).filter(fix_index=True).exclude(image__isnull=True).exclude(image__exact='')
    topics = Topic.objects.filter(active=True)
    #institutions = Institution.objects.filter(active=True).filter(highlight=True).order_by('order')

    return render(request, template, context= {'posts': posts, 'topics': topics})


def blog(request, template='blog/blog.html'):

    posts = Post.objects.filter(active=True).exclude(image__isnull=True).exclude(image__exact='')
    topics = Topic.objects.filter(active=True)
    #institutions = Institution.objects.filter(active=True).filter(highlight=True).order_by('order')

    return render(request, template, context= {'posts': posts, 'topics': topics})


def blog_post(request, slug, template='blog/blog_post.html'):

    try:
        post = Post.objects.get(slug=slug)
    except Post.DoesNotExist as e:
        raise Http404

    if not post.active:
        if not request.user.is_superuser:
            raise Http404

    topics = Topic.objects.filter(active=True)
    #institutions = Institution.objects.filter(active=True).filter(highlight=True).order_by('order')

    return render(request, template, context= {'post': post, 'topics': topics})


def blog_topics(request, template='blog/blog_topics.html'):

    topics = Topic.objects.filter(active=True)
    institutions = Institution.objects.filter(active=True).filter(highlight=True).order_by('order')

    return render(request, template, context= {'topics': topics, 'institutions': institutions})


def blog_topic_detail(request, slug, template='blog/blog_topic_detail.html'):

    try:
        topic = Topic.objects.get(slug=slug)
    except Topic.DoesNotExist as e:
        raise Http404

    posts = Post.objects.filter(active=True).filter(topic=topic)
    topics = Topic.objects.filter(active=True)
    #institutions = Institution.objects.filter(active=True).filter(highlight=True).order_by('order')

    return render(request, template, context= {'posts': posts, 'topic': topic, 'topics': topics})


# Admin
@login_required
def blog_admin(request, template='admin/blog_admin.html'):
    print template
    posts = Post.objects.all()
    topics = Topic.objects.all()

    return render(request, template, context={'posts': posts, 'topics': topics})


@login_required
def blog_post_add(request):

    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('../admin/')
    else:
        form = PostForm()

    return render(request, 'admin/blog_form.html', context={'form': form})


@login_required
def blog_post_edit(request, id):

    obj = get_object_or_404(Post, id=id)
    form = PostUpdate(request.POST or None, request.FILES or None, instance=obj)
    if request.method == 'POST':

        if form.is_valid():
            form.save()
            return HttpResponseRedirect('../../admin/')
    return render(request, 'admin/blog_form.html',context={'form':form})


@login_required
def blog_post_remove(request, id, template='admin/blog_remove.html'):

    try:
        post = get_object_or_404(Post, id=id)
        if request.method == 'GET':
            return render(request, template, context={
                "post": post,
                'id': id
            })
        if request.method == 'POST':
            post.delete()
            return HttpResponseRedirect('/blog/admin/')
        else:
            return HttpResponse("Not allowed", status=403)

    except PermissionDenied:
        return HttpResponse(
            'You are not allowed to delete this ms_narrative_list',
            mimetype="text/plain",
            status=401
        )


@login_required
def blog_link_add(request):

    if request.method == 'POST':
        form = LinkForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('../admin/')
    else:
        form = LinkForm(initial={'format': 'link'})

    return render(request, 'admin/blog_form.html', context={'form': form})


@login_required
def blog_link_edit(request, id):

    obj = get_object_or_404(Post, id=id)
    form = LinkUpdate(request.POST or None, request.FILES or None, instance=obj)
    if request.method == 'POST':

        if form.is_valid():
            form.save()
            return HttpResponseRedirect('../../admin/')
    return render(request, 'admin/blog_form.html', context={'form':form})


@login_required
def blog_topic_add(request):

    if request.method == 'POST':
        form = TopicForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('../admin/')
    else:
        form = TopicForm()

    return render(request, 'admin/blog_form.html', context={'form': form})


@login_required
def blog_topic_edit(request, id):

    obj = get_object_or_404(Topic, id=id)
    form = TopicForm(request.POST or None, request.FILES or None, instance=obj)
    if request.method == 'POST':

        if form.is_valid():
            form.save()
            return HttpResponseRedirect('../../admin/')
    return render(request, 'admin/blog_form.html', context={'form': form})


@login_required
def blog_topic_remove(request, id):

    obj = get_object_or_404(Topic, id=id)
    form = TopicForm(request.POST or None, request.FILES or None, instance=obj)
    if request.method == 'POST':

        if form.is_valid():
            form.save()
            return HttpResponseRedirect('../../admin/')
    return render(request, 'admin/blog_form.html', context={'form': form})