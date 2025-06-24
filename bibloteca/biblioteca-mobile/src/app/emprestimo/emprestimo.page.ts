import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, AlertController, ToastController } from '@ionic/angular';
import { CapacitorHttp, HttpResponse, HttpOptions } from '@capacitor/core';
import { Emprestimo } from './emprestimo.model';
import { Livro } from '../livro/livro.model';
import { Usuario } from '../home/usuario.model';
// Import all Ionic components and common Angular modules you use directly
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Important for *ngFor, *ngIf etc.
import { Storage } from '@ionic/storage-angular'; // Keep providers for services

@Component({
  selector: 'app-emprestimo',
  templateUrl: './emprestimo.page.html',
  // Mark the component as standalone
  standalone: true,
  // Directly import all necessary modules and standalone Ionic components
  imports: [
    CommonModule,     // Required for *ngFor
    FormsModule,      // Required for ngModel
    IonHeader,        // From your HTML
    IonToolbar,       // From your HTML
    IonButtons,       // From your HTML
    IonBackButton,    // From your HTML
    IonTitle,         // From your HTML
    IonContent,       // From your HTML (the one causing the error if duplicated)
    IonList,          // From your HTML
    IonItem,          // From your HTML
    IonLabel,         // From your HTML
    IonSelect,        // From your HTML
    IonSelectOption,  // From your HTML
    IonInput,         // From your HTML
    IonButton         // From your HTML
  ],
  styleUrls: ['./emprestimo.page.scss'],
  providers: [Storage], // Services like Storage are provided here
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
    // It's better to load the user and then proceed with other operations
    await this.storage.create(); // <-- Moved this line up
    await this.loadUserFromStorage();
    await this.carregarLivros();
  }

  // Add a method to load user data from storage
  async loadUserFromStorage() {
    try {
      const storedUser = await this.storage.get('usuario');
      if (storedUser) {
        this.usuario = storedUser;
      } else {
        this.apresenta_mensagem('Usuário não encontrado no armazenamento. Faça login novamente.');
        this.controle_navegacao.navigateRoot('/livro'); // Assuming you have a login page
      }
    } catch (error) {
      console.error('Erro ao carregar usuário do storage:', error);
      this.apresenta_mensagem('Erro ao carregar dados do usuário.');
    }
  }

  async carregarLivros() {
    if (!this.usuario.token) {
      this.apresenta_mensagem('Token de autenticação não disponível. Faça login novamente.');
      this.controle_navegacao.navigateRoot('/login');
      return;
    }

    const options: HttpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.usuario.token}`
      },
      url: 'http://127.0.0.1:8000/livro/api/',
    };

    try {
      const response: HttpResponse = await CapacitorHttp.get(options);
      if (response.status === 200) {
        this.listaLivros = response.data;
        console.log('Livros carregados:', this.listaLivros);
      } else {
        this.apresenta_mensagem(`Erro ao carregar livros: ${response.status} - ${response.data?.detail || ''}`);
      }
    } catch (error: any) {
      console.error('Erro de conexão ao carregar livros:', error);
      this.apresenta_mensagem('Erro de conexão ao carregar livros.');
    }
  }

  async salvarEmprestimo() {
    const loading = await this.controle_carregamento.create({ message: 'Salvando empréstimo...', duration: 15000 });
    await loading.present();

    // Ensure user data and token are available
    if (!this.usuario.id || !this.usuario.token) {
      loading.dismiss();
      this.apresenta_mensagem('Usuário não autenticado. Faça login novamente.');
      this.controle_navegacao.navigateRoot('/login');
      return;
    }

    this.emprestimo.usuario = this.usuario.id;
    this.emprestimo.data_emprestimo = new Date().toISOString().split('T')[0];

    // Basic validation
    if (!this.emprestimo.livro || !this.emprestimo.data_devolucao_prevista) {
      loading.dismiss();
      this.apresenta_mensagem('Por favor, selecione um livro e uma data de devolução.');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    };
    const options: HttpOptions = {
      headers: headers,
      url: 'http://127.0.0.1:8000/emprestimo/api/',
      data: this.emprestimo
    };

    try {
      const resposta: HttpResponse = await CapacitorHttp.post(options);

      if (resposta.status === 201) {
        await this.apresenta_mensagem('Empréstimo registrado com sucesso!');
        loading.dismiss();
        this.controle_navegacao.navigateRoot('/emprestimo-listar');
      } else {
        loading.dismiss();
        console.error('Erro na resposta da API:', resposta);
        await this.apresenta_mensagem(`Erro ao registrar empréstimo: ${resposta.status}. Detalhes: ${JSON.stringify(resposta.data)}`);
      }
    } catch (erro: any) {
      console.error('Erro na requisição de empréstimo:', erro);
      loading.dismiss();
      await this.apresenta_mensagem(`Erro de conexão ou servidor: ${erro?.status || 'desconhecido'}.`);
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