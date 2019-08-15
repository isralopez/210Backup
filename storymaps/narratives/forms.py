from django import forms
from django.forms import ModelForm
from storymaps.narratives.models import Narratives


class NarrativesForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super(NarrativesForm, self).__init__(*args, **kwargs)
        self.fields['coverage'].widget.attrs['readonly'] = True

    def clean(self):
        """
        Ensures the content or the ext_url field is populated.
        """
        cleaned_data = super(NarrativesForm, self).clean()
        narrative = self.cleaned_data.get('narrative')
        ext_url = self.cleaned_data.get('ext_url')

        if not narrative and not ext_url:
            raise forms.ValidationError("El storymap debe redactarse o contener un url.")

        if narrative and ext_url:
            raise forms.ValidationError(
                "Storymap no puede tener ambos campos: Narrativa y URL")

        return cleaned_data

    class Meta:
        model = Narratives
        fields = ['title', 'description', 'image', 'allow_comments', 'authorize_comments', 'narrative', 'ext_url',
                  'coverage']
        exclude = ['author', 'publisher', 'investigation', 'count_row', 'maps', 'category', 'public']


class Narratives2Update(ModelForm):
    class Meta:
        model = Narratives
        fields = ['narrative', 'ext_url']

    def clean(self):
        """
        Ensures the content or the ext_url field is populated.
        """
        cleaned_data = super(Narratives2Update, self).clean()
        narrative = self.cleaned_data.get('narrative')
        ext_url = self.cleaned_data.get('ext_url')

        if not narrative and not ext_url:
            raise forms.ValidationError("El storymap debe redactarse o contener un url.")

        if narrative and ext_url:
            raise forms.ValidationError(
                "Storymap no puede tener ambos campos: Narrativa y URL")

        return cleaned_data


class NarrativesMetadata(ModelForm):

    def __init__(self, *args, **kwargs):
        super(NarrativesMetadata, self).__init__(*args, **kwargs)
        self.fields['coverage'].widget.attrs['readonly'] = True

    class Meta:
        model = Narratives
        fields = ['title', 'author', 'publisher', 'investigation', 'description',
                  'image', 'allow_comments', 'authorize_comments',
                  'coverage']
        exclude = ['count_row', 'maps', 'category', 'public', 'narrative', 'ext_url']


class NarrativesCountRow(ModelForm):
    class Meta:
        model = Narratives
        fields = ['count_row']


class NarrativesMap(ModelForm):
    class Meta:
        model = Narratives
        fields = ['maps']
