from django.shortcuts import render
from django.template.loader import get_template
from django.http import HttpResponse

def home(request):
    return render(request, "home.html")

def serviceworker(request, js):
    template = get_template('sw.js')
    html = template.render()
    return HttpResponse(html, content_type="application/x-javascript")