"""
URL configuration for bibloteca project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from bibloteca.views import *
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/',Login.as_view(), name='login'),
    path('',CadastroView.as_view(), name='cadastro'),
    path('logout/',Logout.as_view(),name="logout"),
    path('livro/', include('livro.urls'),name='livros'),
    path('emprestimo/', include('emprestimo.urls'),name='emprestimo'),
    path('autenticacao-api/',LoginAPI.as_view()),
    path('cadastro-api/',CadastroAPI.as_view()),
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)