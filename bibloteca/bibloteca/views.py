from django.views.generic import View
from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login,logout
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.models import User
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
class Login(View):
    def get(self, request):
        contexto = {'mensagem': '', 'base_html': 'base.html'}
        if request.user.is_authenticated:
            return redirect("/livro")
        else:
            return render(request, 'bibloteca/autenticacao.html', contexto)

    def post(self, request):
        usuario = request.POST.get('usuario', None)
        senha = request.POST.get('senha', None)

        # verificação
        user = authenticate(request, username=usuario, password=senha)
        if user is not None:
            if user.is_active:
                login(request, user)
                return redirect("/livro")
            return render(request, 'bibloteca/autenticacao.html', {'mensagem': 'usuario ou senha incorretos', 'base_html': 'base.html'})
        return render(request, 'bibloteca/autenticacao.html', {'mensagem': 'usuario incorreto', 'base_html': 'base.html'})
    
class Logout(View):
    def get(self,request):
        contexto = {'mensagem':''}
        logout(request)
        return redirect(settings.LOGIN_URL)
    
class CadastroView(View):
   
    def get(self, request):
      
        if request.user.is_authenticated:

            return redirect("/livro")
        # Renderiza o template de cadastro
        return render(request, 'bibloteca/cadastro.html') 

    def post(self, request):

        # Obtém os dados do formulário POST
        nome_usuario = request.POST.get('nome_usuario')
        email = request.POST.get('email')
        senha = request.POST.get('senha')
        confirmar_senha = request.POST.get('confirmar_senha')

       
        if not all([nome_usuario, email, senha, confirmar_senha]):
            messages.error(request, 'Todos os campos são obrigatórios.')
            return render(request, 'bibloteca/cadastro.html')

        if senha != confirmar_senha:
            messages.error(request, 'As senhas não coincidem.')
            return render(request, 'bibloteca/cadastro.html')

        if User.objects.filter(username=nome_usuario).exists():
            messages.error(request, 'Nome de usuário já existe. Por favor, escolha outro.')
            return render(request, 'bibloteca/cadastro.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'E-mail já cadastrado. Por favor, use outro e-mail ou faça login.')
            return render(request, 'bibloteca/cadastro.html')

        
        try:
            user = User.objects.create_user(username=nome_usuario, email=email, password=senha)
            user.save() # Salva o usuário no banco de dados

            user_auth = authenticate(request, username=nome_usuario, password=senha)
            if user_auth is not None:
                
                login(request, user_auth)
                messages.success(request, 'Cadastro realizado com sucesso! Você está logado.')
                return redirect("/livro")
            else:
                messages.error(request, 'Erro ao fazer login automaticamente após o cadastro. Por favor, tente fazer login.')
                return render(request, 'bibloteca/cadastro.html')

        except Exception as e:
            messages.error(request, f'Ocorreu um erro ao cadastrar: {e}')
            return render(request, 'bibloteca/cadastro.html')
        
class LoginAPI(ObtainAuthToken):
    def post(self,request,*args,**kwargs):
        serializer = self.serializer_class(
            data = request.data,
            context={
                'request': request
            }
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'id':user.id,
            'nome':user.first_name,
            'email': user.email,
            'token': token.key

        })