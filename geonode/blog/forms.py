from django import forms
from django.forms import ModelForm
from geonode.blog.models import Post, Topic


class TopicForm(ModelForm):
    class Meta:
        model = Topic
        exclude = ['slug']


class PostForm(ModelForm):
    class Meta:
        model = Post
        exclude = ['format', 'slug', 'link']


class PostUpdate(ModelForm):
    class Meta:
        model = Post
        exclude = ['format', 'slug', 'link']


class LinkForm(ModelForm):
    class Meta:
        model = Post
        fields = ['topic', 'format', 'title', 'link', 'image', 'fix_index', 'active']
        widgets = {'format': forms.HiddenInput()}


class LinkUpdate(ModelForm):
    class Meta:
        model = Post
        fields = ['topic', 'title', 'link', 'image', 'fix_index', 'active']