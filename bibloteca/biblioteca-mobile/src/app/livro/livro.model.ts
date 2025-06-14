export class Livro
{
    public id: number;
    public titulo: string;
    public autor: number;
    public nome_autor: string;
    public ano: number;
    public numero_de_paginas: number;
    public disponivel: boolean;
    public foto: string | undefined;
    public usuario?: number;
    constructor() {
        this.id = 0;
        this.titulo = '';
        this.autor = 0,
        this.nome_autor = '';
        this.ano = 0;
        this.numero_de_paginas = 0;
        this.disponivel = true;
        this.usuario = undefined;

    }
}