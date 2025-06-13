from rest_framework import serializers
from livro.models import Livro
class SerializadorLivro(serializers.ModelSerializer):
    nome_autor = serializers.SerializerMethodField()
    
    class Meta:
        model = Livro
        exclude = []
    def get_nome_autor(self,instancia):
        return instancia.get_autor_display()
    