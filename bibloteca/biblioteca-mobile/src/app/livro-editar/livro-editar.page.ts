import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonBackButton, LoadingController, NavController, ToastController, IonButtons, IonMenuButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonItemSliding, IonThumbnail, IonLabel, IonItemOptions, IonItemOption,IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular';
import { Livro } from '../livro/livro.model';
import { Usuario } from '../home/usuario.model';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import { IonInput, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
export interface Autor {
  id: number;
  nome: string;
  // Outras propriedades do autor, se houver, ex: nacionalidade?: string;
}

@Component({
  selector: 'app-livro-editar',
  templateUrl: './livro-editar.page.html',
  styleUrls: ['./livro-editar.page.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel,IonBackButton, IonItemSliding,IonInput,IonButton, IonItem, IonList, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonText, IonButtons, IonMenuButton, IonContent, IonHeader, IonTitle, IonToolbar, IonThumbnail, CommonModule, IonSelect, IonSelectOption, FormsModule],
  providers: [Storage]
})
export class LivroEditarPage implements OnInit {
 public usuario: Usuario = new Usuario();
  public listaAutores: Autor[] = [];
  id!: number;
  constructor(
    public storage: Storage,
    private rota: ActivatedRoute,
    public controle_toast: ToastController,
    public controle_navegacao: NavController,
    public controle_carregamento: LoadingController
  ) { }

  public livro: Livro = {
    id:0,
    titulo: '',
    autor: 0,
    nome_autor: '', // Ou 0, dependendo do que sua API espera para um autor não selecionado
    ano: 2000,
    numero_de_paginas:20, // Se for opcional e numérico
    disponivel: true,
    foto: undefined, // Ou false, conforme o padrão
  };

  async ngOnInit() {

    // Verifica se existe registro de configuração para o último usuário autenticado
    this.id = Number(this.rota.snapshot.paramMap.get('id'));
    await this.storage.create();
    const registro = await this.storage.get('usuario');

    if(registro) {
      this.usuario = Object.assign(new Usuario(), registro);
      this.AtualizarLivro();
    }
    else{
      this.controle_navegacao.navigateRoot('/home');
    }
    await this.carregarAutores(); 
  }


async carregarAutores() {
    if (!this.usuario.token) {
      // Mensagem já é tratada em loadUserFromStorage ou em carregarLivros se chamada antes
      return;
    }

    const options: HttpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.usuario.token}`
      },
      url: 'http://127.0.0.1:8000/livro/autor/api/', // 
    };

    try {
      const response: HttpResponse = await CapacitorHttp.get(options);
      if (response.status === 200) {
        this.listaAutores = response.data;
        console.log('Autores carregados:', this.listaAutores);
      } else {
        this.apresenta_mensagem(`Erro ao carregar autores: ${response.status} - ${response.data?.detail || ''}`);
      }
    } catch (error: any) {
      console.error('Erro de conexão ao carregar autores:', error);
      this.apresenta_mensagem('Erro de conexão ao carregar autores.');
    }
  }
  async AtualizarLivro() {
    if (!this.usuario.token) {
      this.apresenta_mensagem('Token de autenticação não disponível. Faça login novamente.');
      this.controle_navegacao.navigateRoot('/login');
      return;
    }

    const loading = await this.controle_carregamento.create({
      message: 'Atualizando livro...',
      duration: 10000
    });
    await loading.present();

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    };

    // Certifique-se de que o campo `autor` no `livro` é um ID válido
    if (!this.livro.titulo || !this.livro.autor) {
      loading.dismiss();
      this.apresenta_mensagem('Por favor, preencha o título e selecione um autor.');
      return;
    }

    const options: HttpOptions = {
      headers: headers,
      url: `http://127.0.0.1:8000/livro/api/editar/${this.id}/`,
      data: this.livro
    };

    try {
      const response: HttpResponse = await CapacitorHttp.put(options);

      if (response.status === 200) {
        await this.apresenta_mensagem('Livro editado com sucesso!');
        //this.consultarLivrosSistemaWeb(); // Refresh the list
        this.livro = {
          id:0,
          titulo: '',
          autor: 0,
          nome_autor: '', // Ou 0, dependendo do que sua API espera para um autor não selecionado
          ano: 2000,
          numero_de_paginas:20, // Se for opcional e numérico
          disponivel: true,
          foto: undefined,
        };
        this.controle_navegacao.navigateRoot('/livro');
      } else {
        console.error('Erro na resposta da API:', response);
        await this.apresenta_mensagem(`Erro ao cadastrar livro: ${response.status}. Detalhes: ${JSON.stringify(response.data)}`);
      }
    } catch (error: any) {
      console.error('Erro na requisição de livro:', error);
      await this.apresenta_mensagem(`Erro de conexão ou servidor: ${error?.status || 'desconhecido'}.`);
    } finally {
      loading.dismiss();
    }
  }
  async apresenta_mensagem(texto: string) {
    const mensagem = await this.controle_toast.create({
      message: texto,
      cssClass: 'ion-text-center',
      duration: 2000
    });
    mensagem.present();
  }

}
