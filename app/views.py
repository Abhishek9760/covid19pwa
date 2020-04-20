from django.shortcuts import render

from .servers import get_world_data


def home(request):
    data = get_world_data()
    return render(request, "home.html", {"data": data})
