from django.urls import path
from emprestimo.views import *

urlpatterns= [
    path('',ListarEmprestimos.as_view(),name='listar-emprestimos'),
    path('novo/',CriarEmprestimos.as_view(),name='criar-emprestimos'),
    path('deletar/<int:pk>/',DeletarEmprestimos.as_view(),name='deletar-emprestimos'),
    path('<int:pk>/',EditarEmprestimos.as_view(),name='editar-emprestimos'),
    
]