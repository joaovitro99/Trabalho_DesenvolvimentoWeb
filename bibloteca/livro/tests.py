from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from livro.models import Livro
from datetime import datetime
from livro.forms import *

class TestesModelLivro(TestCase):
    def setUp(self):
        self.instancia = Livro(
            autor=1,
            titulo='ABCDE',
            ano=datetime.now().year,
            numero_de_paginas=2,
            disponivel=True,
        )
    

    def test_years_use(self):
        self.instancia.ano = datetime.now().year - 10
        self.assertEqual(self.instancia.ano, 2015)

class TestesViewListarTodosLivros(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='teste', password='12345')
        self.client.force_login(self.user)
        self.url = reverse('listar-outros-livros')
        Livro(autor=1, titulo='ABCDE', ano=2, numero_de_paginas=3,disponivel=True).save()

    def test_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context['livros']), 1)
    
class TestesViewCriarLivros(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='teste', password='12345')
        self.client.force_login(self.user)
        self.url = reverse('criar-livros')
        
    def test_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.context.get('form'), FormularioLivro)
    
    def test_post(self):
        data = {'autor':1, 'titulo':'ABCDE', 'ano':2, 'numero_de_paginas':1}
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('listar-livros'))

        self.assertEqual(Livro.objects.count(), 1)
        self.assertEqual(Livro.objects.first().titulo, 'ABCDE')

class TestesViewEditarLivros(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='teste', password='12345')
        self.client.login(username='teste', password='12345')
        self.livro = Livro.objects.create(autor=1, titulo='ABCDE', ano=2020, numero_de_paginas=100,disponivel=True)
        self.url = reverse('editar-livros', kwargs={'pk': self.livro.pk})

    def test_get_editar_livro(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'livro/editar.html')
        self.assertIsInstance(response.context['object'], Livro)
        self.assertIsInstance(response.context['form'], FormularioLivro)
        self.assertEqual(response.context['object'].pk, self.livro.pk)

    def test_post_editar_livro(self):
        data = {
            'autor': 1,
            'titulo': 'Atualizado',
            'ano': 2021,
            'numero_de_paginas': 150,
            'disponivel':True,
        }
        response = self.client.post(self.url, data)
        self.assertRedirects(response, reverse('listar-livros'))
        self.livro.refresh_from_db()
        self.assertEqual(self.livro.titulo, 'Atualizado')
        self.assertEqual(self.livro.ano, 2021)

class TestesViewDeletarLivros(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='testes', password='12345')
        self.client.force_login(self.user)
        self.instancia = Livro.objects.create(autor=1, titulo='ABCDE', ano=2, numero_de_paginas=3,disponivel=True)
        self.url = reverse('deletar-livros', kwargs={'pk': self.instancia.pk})

    def test_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.context.get('object'), Livro)
        self.assertEqual(response.context.get('object').pk, self.instancia.pk)

    def test_post(self):
        response = self.client.post(self.url)

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('listar-livros'))
        self.assertEqual(Livro.objects.count(), 0)

