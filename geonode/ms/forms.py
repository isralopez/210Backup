from django.forms import ModelForm
from geonode.ms.models import Microsite, Section, Category, Narrative

class MicrositeForm(ModelForm):
    class Meta:
        model = Microsite
        exclude = ['color', 'image_1', 'thematic', 'header', 'viewer', 'footer']


class MicrositeTematizingForm(ModelForm):
    class Meta:
        model = Microsite
        fields = ['thematic']


class MicrositeColorsForm(ModelForm):
    class Meta:
        model = Microsite
        fields = ['color']


class MicrositeLogoForm(ModelForm):
    class Meta:
        model = Microsite
        fields = ['image_4']


class MicrositeUrlForm(ModelForm):
    class Meta:
        model = Microsite
        fields = ['url_name']


class MicrositeUpdate(ModelForm):
    class Meta:
        model = Microsite
        exclude = ['color', 'image_1', 'thematic', 'header', 'viewer', 'footer']


class MicrositeAdvanced(ModelForm):
    class Meta:
        model = Microsite
        fields = ['header', 'viewer', 'footer', 'size']


class SectionForm(ModelForm):
    class Meta:
        model = Section
        exclude = ['microsite', 'parent_section', 'stack_order']


class SectionFullForm(ModelForm):
    class Meta:
        model = Section
        fields = '__all__'


class SectionUpdate(ModelForm):
    class Meta:
        model = Section
        exclude = ['microsite', 'stack_order']


class CategoryForm(ModelForm):
    class Meta:
        model = Category
        fields = '__all__'


class CategoryUpdate(ModelForm):
    class Meta:
        model = Category
        fields = '__all__'


class CategoryMSForm(ModelForm):
    class Meta:
        model = Category
        exclude = ['microsite']
     

class Category_to_ms_Form(ModelForm):
    class Meta:
        model = Category
        exclude = ['microsite', 'parent_category']


class Category_to_ms_Update(ModelForm):
    class Meta:
        model = Category
        exclude = ['parent_category']

class Category_to_ms_Upd(ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'description', 'image']


class NarrativeForm(ModelForm):
    class Meta:
        model = Narrative
        fields = '__all__'


class NarrativeUpdate(ModelForm):
    class Meta:
        model = Narrative
        fields = ['narrative']


class NarrativeMetaUpdate(ModelForm):
    class Meta:
        model = Narrative
        exclude = ['narrative', 'microsite','maps']


class NarrativeMetaUpdate_to_ms(ModelForm):
    class Meta:
        model = Narrative
        exclude = ['narrative', 'category', 'microsite','maps']


class NarrativePublishedUpdate(ModelForm):
    class Meta:
        model = Narrative
        fields = ['public']


class NarrativeDespublishedUpdate(ModelForm):
    class Meta:
        model = Narrative
        fields = ['public']


class MSPublishedUpdate(ModelForm):
    class Meta:
        model = Narrative
        fields = ['public']


class Narrative_to_msForm(ModelForm):
    class Meta:
        model = Narrative
        exclude = ['microsite','category','maps']


class Narrative_to_catForm(ModelForm):
    class Meta:
        model = Narrative
        exclude = ['microsite','category','maps']
