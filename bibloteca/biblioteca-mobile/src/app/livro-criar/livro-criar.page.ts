import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonBackButton, LoadingController, NavController, ToastController, IonButtons, IonMenuButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonItemSliding, IonThumbnail, IonLabel, IonItemOptions, IonItemOption,IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular';
import { Livro } from '../livro/livro.model';
import { Usuario } from '../home/usuario.model';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import { IonInput, IonButton } from '@ionic/angular/standalone';

export interface Autor {
  id: number;
  nome: string;
  // Outras propriedades do autor, se houver, ex: nacionalidade?: string;
}

@Component({
  standalone: true,
  selector: 'app-livro',
  templateUrl: './livro-criar.page.html',
  styleUrls: ['./livro-criar.page.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel,IonBackButton, IonItemSliding,IonInput,IonButton, IonItem, IonList, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonText, IonButtons, IonMenuButton, IonContent, IonHeader, IonTitle, IonToolbar, IonThumbnail, CommonModule, IonSelect, IonSelectOption, FormsModule],
  providers: [Storage]
})
export class LivroCriarPage implements OnInit {

  public usuario: Usuario = new Usuario();
  public listaAutores: Autor[] = [];

  constructor(
    public storage: Storage,
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
    await this.storage.create();
    const registro = await this.storage.get('usuario');

    if(registro) {
      this.usuario = Object.assign(new Usuario(), registro);
      this.salvarLivro();
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
  async salvarLivro() {
    if (!this.usuario.token) {
      this.apresenta_mensagem('Token de autenticação não disponível. Faça login novamente.');
      this.controle_navegacao.navigateRoot('/login');
      return;
    }

    const loading = await this.controle_carregamento.create({
      message: 'Salvando livro...',
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
      url: `http://127.0.0.1:8000/livro/api/criar/`,
      data: this.livro
    };

    try {
      const response: HttpResponse = await CapacitorHttp.post(options);

      if (response.status === 201) {
        await this.apresenta_mensagem('Livro cadastrado com sucesso!');
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

