from rest_framework import serializers
from livro.models import Livro
from .models import OPCOES_AUTORES
class SerializadorLivro(serializers.ModelSerializer):
    nome_autor = serializers.SerializerMethodField()
    
    class Meta:
        model = Livro
        exclude = []
    def get_nome_autor(self,instancia):
        return instancia.get_autor_display()
    
class SerializadorAutor(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    nome = serializers.CharField(read_only=True)
    
    
    