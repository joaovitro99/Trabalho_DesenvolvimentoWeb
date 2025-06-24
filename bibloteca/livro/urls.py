from django.urls import path
from livro.views import *

urlpatterns= [
    path('meus_livros/',ListarLivros.as_view(),name='listar-livros'),
    path('',ListarTodosLivros.as_view(),name='listar-outros-livros'),
    path('novo/',CriarLivros.as_view(),name='criar-livros'),
    path('fotos/<str:arquivo>/',FotoLivros.as_view(),name='foto-livros'),
    path('deletar/<int:pk>/',DeletarLivros.as_view(),name='deletar-livros'),
    path('<int:pk>/',EditarLivros.as_view(),name='editar-livros'),
    path('api/',APIListarLivros.as_view(), name='api-listar-livros'),
    path('autor/api/',APIListarAutores.as_view(), name='api-listar-autores'),
    path('api/<int:pk>/',APIDeletarlivros.as_view(), name='api-deletar-livros'),
    path('api/criar/',APICriarLivros.as_view(), name='api-criar-livros'),
    path('api/editar/<int:pk>/',APIEditarLivros.as_view(), name='api-editar-livros'),
]