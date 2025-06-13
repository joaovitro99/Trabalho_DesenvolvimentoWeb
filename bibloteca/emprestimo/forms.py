from django import forms
from .models import Emprestimo, Livro  # Importe seus modelos

class FormularioEmprestimo(forms.ModelForm):
    class Meta:
        model = Emprestimo
        fields = ['livro', 'data_devolucao_prevista'] 
        widgets = {
            ##'usuario': forms.Select(attrs={'class': 'form-control'}), 
            'data_devolucao_prevista': forms.DateInput(attrs={'type': 'date'}), 
            #'data_devolucao_real': forms.DateInput(attrs={'class': 'form-control'}), 
            #'devolvido': forms.CheckboxInput(attrs={'class': 'form-check-input'}), 
            'livro': forms.Select(attrs={'class': 'form-control'}), 
            
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['livro'].queryset = Livro.objects.filter(disponivel=True)
        