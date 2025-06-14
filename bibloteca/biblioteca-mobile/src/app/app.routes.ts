import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'livro',
    loadComponent: () => import('./livro/livro.page').then( m => m.LivroPage)
  },
  {
    path: 'emprestimo',
    loadComponent: () => import('./emprestimo/emprestimo.page').then( m => m.EmprestimoPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./cadastro/cadastro.page').then( m => m.CadastroPage)
  },
];
