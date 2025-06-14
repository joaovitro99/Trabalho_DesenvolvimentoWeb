import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, LoadingController, NavController, ToastController, IonButtons, IonMenuButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonItemSliding, IonThumbnail, IonLabel, IonItemOptions, IonItemOption } from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular';
import { Livro } from './livro.model';
import { Usuario } from '../home/usuario.model';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';

@Component({
  standalone: true,
  selector: 'app-livro',
  templateUrl: './livro.page.html',
  styleUrls: ['./livro.page.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItemSliding, IonItem, IonList, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonText, IonButtons, IonMenuButton, IonContent, IonHeader, IonTitle, IonToolbar, IonThumbnail, CommonModule, FormsModule],
  providers: [Storage]
})
export class LivroPage implements OnInit {

  public usuario: Usuario = new Usuario();
  public lista_livros: Livro[] = [];

  constructor(
    public storage: Storage,
    public controle_toast: ToastController,
    public controle_navegacao: NavController,
    public controle_carregamento: LoadingController
  ) { }

  async ngOnInit() {

    // Verifica se existe registro de configuração para o último usuário autenticado
    await this.storage.create();
    const registro = await this.storage.get('usuario');

    if(registro) {
      this.usuario = Object.assign(new Usuario(), registro);
      this.consultarLivrosSistemaWeb();
    }
    else{
      this.controle_navegacao.navigateRoot('/home');
    }
  }

  async consultarLivrosSistemaWeb() {

    // Inicializa interface com efeito de carregamento
    const loading = await this.controle_carregamento.create({message: 'Pesquisando...', duration: 60000});
    await loading.present();

    // Define informações do cabeçalho da requisição
    const options: HttpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Token ${this.usuario.token}`
      },
      url: `http://127.0.0.1:8000/livro/api/`,
    };

    CapacitorHttp.get(options)
      .then(async (resposta: HttpResponse) => {

        // Verifica se a requisição foi processada com sucesso
        if(resposta.status == 200) {
          this.lista_livros = resposta.data;
        
          // Finaliza interface com efeito de carregamento
          loading.dismiss();
        }
        else {

          // Finaliza autenticação e apresenta mensagem de erro
          loading.dismiss();
          this.apresenta_mensagem('Falha ao consultar livros: código ${resposta.status}');
        }
      })
      .catch(async (erro: any) => {
        console.log(erro);
        loading.dismiss();
        this.apresenta_mensagem('Falha ao consultar livros: código ${erro?.status}');
      });
  }

  async excluirLivro(id: number) {

    // Inicializa interface com efeito de carregamento
    const loading = await this.controle_carregamento.create({message: 'Autenticando...', duration: 30000});
    await loading.present();

    const options: HttpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.usuario.token}`
      },
      url: `http://127.0.0.1:8000/livro/api/${id}`,
    };

    CapacitorHttp.delete(options)
      .then(async (resposta: HttpResponse) => {

        // Verifica se a requisição foi processada com sucesso
        if(resposta.status == 200) {
        
          // Finaliza interface com efeito de carregamento
          loading.dismiss();

          // Consulta novamente a lista de veículos
          this.consultarLivrosSistemaWeb();
        }
        else {

          // Finaliza autenticação e apresenta mensagem de erro
          loading.dismiss();
          this.apresenta_mensagem('Falha ao excluir o livro: código ${resposta.status}');
        }
      })
      .catch(async (erro: any) => {
        console.log(erro);
        loading.dismiss();
        this.apresenta_mensagem('Falha ao excluir o livro: código ${erro?.status}');
      });
  }

  async apresenta_mensagem(texto: string) {
    const mensagem = await this.controle_toast.create({
      message: texto,
      cssClass: 'ion-text-center',
      duration: 2000
    });
    mensagem.present();
  }
  irEmprestimo(){
    const loading = this.controle_carregamento.create({message: 'Pegar livro emprestado...', duration: 1000});
    this.controle_navegacao.navigateRoot('/emprestimo');

  }
}
