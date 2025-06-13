from django import forms
from .models import Livro 
from livro.consts import *

class FormularioLivro(forms.ModelForm):
    class Meta:
        model = Livro
        fields = ['titulo', 'numero_de_paginas', 'ano', 'autor', 'foto','disponivel']
        widgets = {
            'titulo': forms.TextInput(attrs={'class': 'form-control'}),
            'ano': forms.NumberInput(attrs={'class': 'form-control'}),
            'numero_de_paginas': forms.NumberInput(attrs={'class': 'form-control'}),
            'autor': forms.Select(attrs={'class': 'form-control'}),
            'foto': forms.FileInput(attrs={'class': 'form-control'}),
            'disponivel': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['autor'].choices = OPCOES_AUTORES
        