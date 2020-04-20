from django.contrib import admin
from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from app.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

