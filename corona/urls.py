from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView

from django.conf import settings
from django.conf.urls.static import static

from app.views import home, serviceworker

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('offline/', TemplateView.as_view(template_name='offline.html'), name='offline'),
    path('about/', TemplateView.as_view(template_name='about.html'), name='about'),
    re_path(r'^sw(.*.js)$', serviceworker, name='serviceworker'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
