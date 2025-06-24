from django.shortcuts import render
from django.urls import reverse_lazy
from emprestimo.models import Emprestimo
from emprestimo.forms import FormularioEmprestimo
from django.views.generic import ListView,CreateView,View,UpdateView,DeleteView
from rest_framework.generics import CreateAPIView,ListAPIView,DestroyAPIView
from django.http import FileResponse,Http404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.authentication import TokenAuthentication
from emprestimo.serializers import SerializadorEmprestimo
from rest_framework import permissions
# Create your views here.
class ListarEmprestimos(LoginRequiredMixin, ListView):
    model = Emprestimo 
    context_object_name = 'emprestimos'
    template_name = 'emprestimo/listar.html'

    def get_queryset(self):
        return Emprestimo.objects.filter(usuario=self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['base_html'] = 'base.html' 
        return context
    
class CriarEmprestimos(LoginRequiredMixin, CreateView):
    model = Emprestimo
    template_name = 'emprestimo/novo.html' 
    form_class = FormularioEmprestimo
    success_url = reverse_lazy('listar-emprestimos') 

    def form_valid(self, form):
        form.instance.usuario = self.request.user

        livro_selecionado = form.instance.livro

        livro_selecionado.disponivel = False
        livro_selecionado.save() 
        return super().form_valid(form)


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['base_html'] = 'base.html'
        return context

    
class EditarEmprestimos(LoginRequiredMixin, UpdateView):
    model = Emprestimo 
    template_name = 'emprestimo/editar.html'
    form_class = FormularioEmprestimo
    success_url = reverse_lazy('listar-emprestimos')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['base_html'] = 'base.html' 
        return context
    
class DeletarEmprestimos(LoginRequiredMixin, DeleteView):
    model = Emprestimo 
    template_name = 'emprestimo/deletar.html'
    success_url = reverse_lazy('listar-emprestimos')

    def form_valid(self, form):
        emprestimo_a_deletar = self.object

        livro_associado = emprestimo_a_deletar.livro

        livro_associado.disponivel = True
        livro_associado.save() 

        
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['base_html'] = 'base.html' 
        return context
    
class APICriarEmprestimos(CreateAPIView):
    serializer_class = SerializadorEmprestimo
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]



       
