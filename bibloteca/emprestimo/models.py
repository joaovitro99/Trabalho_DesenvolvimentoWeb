from django.db import models
from django.contrib.auth.models import User
from livro.models import *
# Create your models here.
class Emprestimo(models.Model):

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emprestimos')
    # Assumindo um modelo Livro (você pode substituir por outro modelo, como Veiculo)
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE, related_name='emprestimos')
    data_emprestimo = models.DateTimeField(auto_now_add=True)
    data_devolucao_prevista = models.DateField()
    data_devolucao_real = models.DateField(null=True, blank=True)
    devolvido = models.BooleanField(default=False)