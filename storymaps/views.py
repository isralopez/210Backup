import json
from django.shortcuts import render

from storymaps.narratives.models import Narratives


def storymaps(request):
    narratives = Narratives.objects.all()

    narr_dict = {}
    for item in narratives:
        narr_dict[item.id] = {
            'id': item.id,
            "title": item.title,
            "coverage": item.coverage,
            "description": item.description,
            "image": item.image.url,
            "ext_url": item.ext_url
        }
    return render(request, 'storymaps.html', context={'narratives': json.dumps(narr_dict)})
