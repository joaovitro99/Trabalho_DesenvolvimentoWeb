from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from emprestimo.models import Emprestimo
from livro.models import Livro
from datetime import datetime, timedelta
from emprestimo.forms import *

class TestesModelEmprestimo(TestCase):
    def setUp(self):
        self.usuario = User.objects.create_user(username='testeuser', password='123456')
        self.livro = Livro.objects.create(
            titulo='ABCDE',
            autor=1,
            ano=datetime.now().year,
            numero_de_paginas=2,
            disponivel=True
        )
        self.emprestimo = Emprestimo.objects.create(
            usuario=self.usuario,
            livro=self.livro,
            data_devolucao_prevista=datetime.now().date() + timedelta(days=7)
        )

    def test_ano_livro_passado(self):
        self.livro.ano = datetime.now().year - 10
        self.livro.save()
        self.assertEqual(self.livro.ano, datetime.now().year - 10)

class TestesViewListarEmprestimos(TestCase):
    def setUp(self):
        # Criar usuário
        self.user = User.objects.create_user(username='teste', password='12345')
        self.client.force_login(self.user)

        # Criar livro
        self.livro = Livro.objects.create(
            autor=1,
            titulo='ABCDE',
            ano=2020,
            numero_de_paginas=100,
            disponivel=True
        )

        # Criar empréstimo
        self.emprestimo = Emprestimo.objects.create(
            usuario=self.user,
            livro=self.livro,
            data_devolucao_prevista=datetime.now().date() + timedelta(days=7),
            devolvido=False
        )

        # URL da view que lista os empréstimos
        self.url = reverse('listar-emprestimos')

    def test_get_emprestimos(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('emprestimos', response.context)
        self.assertEqual(len(response.context['emprestimos']), 1)
        self.assertEqual(response.context['emprestimos'][0], self.emprestimo)
    
class TestesViewCriarEmprestimos(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='teste', password='12345')
        self.client.force_login(self.user)
        self.livro = Livro.objects.create(
            titulo='Livro de Teste',
            autor=1,
            ano=2022,
            numero_de_paginas=123,
            disponivel=True
        )
        self.url = reverse('criar-emprestimos')

    def test_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.context.get('form'), FormularioEmprestimo)

    def test_post(self):
        data = {
            'livro': self.livro.id,
            'data_devolucao_prevista': (datetime.now().date() + timedelta(days=7)).isoformat()
        }
        response = self.client.post(self.url, data)

        # Redirecionamento após criação
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('listar-emprestimos'))

        # Verifica criação do empréstimo
        self.assertEqual(Emprestimo.objects.count(), 1)
        emprestimo = Emprestimo.objects.first()
        self.assertEqual(emprestimo.usuario, self.user)
        self.assertEqual(emprestimo.livro, self.livro)

class TestesViewEditarEmprestimos(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='teste', password='12345')
        self.client.login(username='teste', password='12345')

        self.livro = Livro.objects.create(
            titulo='Livro Teste',
            autor=1,
            ano=2020,
            numero_de_paginas=100,
            disponivel=True
        )

        self.emprestimo = Emprestimo.objects.create(
            usuario=self.user,
            livro=self.livro,
            data_devolucao_prevista=datetime.now().date() + timedelta(days=7),
            devolvido=False
        )

        self.url = reverse('editar-emprestimos', kwargs={'pk': self.emprestimo.pk})

    def test_get_editar_emprestimo(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'emprestimo/editar.html')
        self.assertIsInstance(response.context['object'], Emprestimo)
        self.assertIsInstance(response.context['form'], FormularioEmprestimo)
        self.assertEqual(response.context['object'].pk, self.emprestimo.pk)

    def test_post_editar_emprestimo(self):
        nova_data = (datetime.now().date() + timedelta(days=10)).isoformat()
        data = {
            'livro': self.livro.pk,
            'data_devolucao_prevista': nova_data,
            'devolvido': False,
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('listar-emprestimos'))

        self.emprestimo.refresh_from_db()
        self.assertEqual(self.emprestimo.data_devolucao_prevista.isoformat(), nova_data)
        self.assertFalse(self.emprestimo.devolvido)


class TestesViewDeletarEmprestimos(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='teste', password='12345')
        self.client.force_login(self.user)

        self.livro = Livro.objects.create(
            titulo='Livro Teste',
            autor=1,
            ano=2020,
            numero_de_paginas=100,
            disponivel=True
        )

        self.emprestimo = Emprestimo.objects.create(
            usuario=self.user,
            livro=self.livro,
            data_devolucao_prevista=datetime.now().date() + timedelta(days=7),
            devolvido=False
        )

        self.url = reverse('deletar-emprestimos', kwargs={'pk': self.emprestimo.pk})

    def test_get_confirmar_exclusao(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'emprestimo/deletar.html')
        self.assertEqual(response.context.get('object').pk, self.emprestimo.pk)

    def test_post_deletar_emprestimo(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('listar-emprestimos'))
        self.assertFalse(Emprestimo.objects.filter(pk=self.emprestimo.pk).exists())


