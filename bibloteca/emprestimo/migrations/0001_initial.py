# Generated by Django 5.1.7 on 2025-06-01 01:18

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('livro', '0002_livro_usuario_alter_livro_disponivel_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Emprestimo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_emprestimo', models.DateTimeField(auto_now_add=True)),
                ('data_devolucao_prevista', models.DateField()),
                ('data_devolucao_real', models.DateField(blank=True, null=True)),
                ('devolvido', models.BooleanField(default=False)),
                ('livro', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='emprestimos', to='livro.livro')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='emprestimos', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
