import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, AlertController, ToastController } from '@ionic/angular';
import { CapacitorHttp, HttpResponse, HttpOptions } from '@capacitor/core';
import { Emprestimo } from './emprestimo.model'; 
import { Livro } from '../livro/livro.model'; 
import { Usuario } from '../home/usuario.model';
import { formatISO } from 'date-fns';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-emprestimo',
  templateUrl: './emprestimo.page.html',
  styleUrls: ['./emprestimo.page.scss'],
})
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // <<<< Adicione IonicModule aqui
    
  ],
  declarations: [EmprestimoPage]
})
export class EmprestimoPage implements OnInit {

  // Instância do empréstimo a ser criado/editado
  public emprestimo: Emprestimo = {
    id: 0,
    livro: null,
    usuario: null,
    data_emprestimo: '',
    data_devolucao_prevista: '',
    devolvido: false // Valor padrão
  };
  public usuario: Usuario = new Usuario();
  public listaLivros: Livro[] = []; // Lista para popular o ion-select
  public minDate: string = new Date().toISOString(); // Define a data mínima para o datetime como hoje

  constructor(
    public storage: Storage,
    public controle_toast: ToastController,
    public controle_navegacao: NavController,
    public controle_carregamento: LoadingController

  ) { }

  async ngOnInit() {
    await this.carregarLivros();
  }

  async carregarLivros() {
    const options: HttpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.usuario.token}`
      },
      url: '[http://127.0.0.1:8000/livro/api/](http://127.0.0.1:8000/livro/api/)', 
    };

    try {
      const response: HttpResponse = await CapacitorHttp.get(options);
      if (response.status === 200) {
        this.listaLivros = response.data; // Assuma que a resposta é um array de objetos Livro/Veiculo
        console.log('Livros carregados:', this.listaLivros);
      } else {
        this.apresenta_mensagem(`Erro ao carregar livros: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Erro de conexão ao carregar livros:', error);
      this.apresenta_mensagem('Erro de conexão ao carregar livros.');
    }
  }

  async salvarEmprestimo() {
    const loading = await this.controle_carregamento.create({ message: 'Salvando empréstimo...', duration: 15000 });
    await loading.present();


    if (this.usuario.id === null || this.usuario.token === null) {
      loading.dismiss();
      this.apresenta_mensagem('Usuário não autenticado. Não é possível registrar o empréstimo.');
      return;
    }
    this.emprestimo.usuario = this.usuario.id;
  
    this.emprestimo.data_emprestimo = formatISO(new Date(), { representation: 'date' });
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    };
    const options: HttpOptions = {
      headers: headers,
      url: 'http://127.0.0.1:8000/emprestimo/api/',
      data: this.emprestimo // Os dados do empréstimo a serem enviados
    };

    try {
      const resposta: HttpResponse = await CapacitorHttp.post(options);

      if (resposta.status === 201) { // 201 Created é o esperado para POST de sucesso
        await this.apresenta_mensagem('Empréstimo registrado com sucesso!');
        loading.dismiss();
        this.controle_navegacao.navigateRoot('/home'); // Redirecionar para uma página de sucesso ou lista de empréstimos
      } else {
        loading.dismiss();
        console.error('Erro na resposta da API:', resposta);
        await this.apresenta_mensagem(`Erro ao registrar empréstimo: ${resposta.status}.`);
      }
    } catch (erro: any) {
      console.error('Erro na requisição de empréstimo:', erro);
      loading.dismiss();
      await this.apresenta_mensagem(`Erro de conexão ou servidor: ${erro?.status || 'desconhecido'}.`,);
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
