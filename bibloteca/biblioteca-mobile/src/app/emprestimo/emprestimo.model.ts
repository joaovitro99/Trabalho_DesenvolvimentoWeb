import { Livro } from "../livro/livro.model";

export class Emprestimo
{
  public id: number;
  public livro: number | null;
  public usuario: number | null; 
  public data_emprestimo: string; 
  public data_devolucao_prevista: string; 
  public devolvido?: boolean;

  constructor() { 
    this.id = 0;
    this.livro = null;
    this.usuario = null;
    this.data_emprestimo = '';
    this.data_devolucao_prevista = '';
    this.devolvido = false;
  }
}