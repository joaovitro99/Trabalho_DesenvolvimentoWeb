from django.db import models
from datetime import datetime
from livro.consts import *
from django.contrib.auth.models import User
# Create your models here.
class Livro(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE,null=True, related_name='livros_cadastrados')
    titulo = models.CharField(max_length=255)
    autor = models.SmallIntegerField(choices=OPCOES_AUTORES)
    ano = models.IntegerField()
    foto = models.ImageField(blank=True,null=True,upload_to='livro/fotos')
    numero_de_paginas = models.IntegerField(blank=True, null=True)
    disponivel = models.BooleanField(default=True)
    
    def __str__(self):
        return self.titulo