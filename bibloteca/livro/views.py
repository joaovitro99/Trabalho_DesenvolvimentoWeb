from django.shortcuts import render
from django.urls import reverse_lazy
from livro.models import Livro
from livro.forms import FormularioLivro
from django.views.generic import ListView,CreateView,View,UpdateView,DeleteView
from django.http import FileResponse,Http404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.generics import ListAPIView,DestroyAPIView,CreateAPIView,RetrieveUpdateAPIView
from rest_framework.authentication import TokenAuthentication
from rest_framework import permissions
from livro.serializers import SerializadorLivro,SerializadorAutor
from livro.consts import *
from rest_framework.views import APIView
from rest_framework.response import Response
# Create your views here.
class ListarLivros(LoginRequiredMixin, ListView):
    model = Livro 
    context_object_name = 'livros'
    template_name = 'livro/listar.html'

    def get_queryset(self):
        return Livro.objects.filter(usuario=self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['base_html'] = 'base.html' 
        return context
    
class ListarTodosLivros(LoginRequiredMixin, ListView):
    model = Livro 
    context_object_name = 'livros'
    template_name = 'livro/listar_todos.html'

    def get_queryset(self):
        return Livro.objects.filter(disponivel=True)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['base_html'] = 'base.html' 
        return context
    
class CriarLivros(CreateView):
    model = Livro 
    template_name = 'livro/novo.html'
    form_class = FormularioLivro
    success_url = reverse_lazy('listar-livros')

    def form_valid(self, form):
        
        form.instance.usuario = self.request.user
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['base_html'] = 'base.html' 
        return context
    
class EditarLivros(LoginRequiredMixin, UpdateView):
    model = Livro
    template_name = 'livro/editar.html'
    form_class = FormularioLivro
    success_url = reverse_lazy('listar-livros')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['base_html'] = 'base.html' 
        return context
    
class DeletarLivros(LoginRequiredMixin, DeleteView):
    model = Livro
    template_name = 'livro/deletar.html'
    success_url = reverse_lazy('listar-livros')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['base_html'] = 'base.html' 
        return context
    
class FotoLivros(View):
    def get(self,request,arquivo):
        try:
            veiculo = Livro.objects.get(foto='livro/fotos/{}'.format(arquivo))
            return FileResponse(Livro.foto)
        except ObjectDoesNotExist:
            raise Http404("Foto não encontrada ou acesso não autorizado")
        except Exception as exception:
            raise exception
        
class APIListarLivros(ListAPIView):
    serializer_class = SerializadorLivro
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Livro.objects.filter(disponivel=True)
    
class APICriarLivros(CreateAPIView):
    serializer_class = SerializadorLivro
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

class APIEditarLivros(RetrieveUpdateAPIView):
    serializer_class = SerializadorLivro
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]    
    queryset = Livro.objects.all()  
    lookup_field = 'pk'
    
class APIDeletarlivros(DestroyAPIView):
    serializer_class = SerializadorLivro
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Livro.objects.all()
    
class APIListarAutores(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        autores = [{"id": id, "nome": nome} for id, nome in OPCOES_AUTORES]
        serializer = SerializadorAutor(autores, many=True)
        return Response(serializer.data)
