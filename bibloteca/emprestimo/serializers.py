from rest_framework import serializers
from emprestimo.models import Emprestimo
from livro.serializers import SerializadorLivro
class SerializadorEmprestimo(serializers.ModelSerializer):
    #livro = SerializadorLivro(read_only=True)
    class Meta:
        model = Emprestimo
        exclude = []
    