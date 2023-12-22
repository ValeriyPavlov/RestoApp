import { Plato } from './Plato';

export class Comanda {
    mesa: number;
    fecha: Date;
    pedido: Pedido[];
    comentario: string;

    constructor(mesa: number, pedido: Pedido[], comentario: string){
        this.mesa = mesa;
        this.fecha = new Date();
        this.pedido = pedido;
        this.comentario = comentario;
    }
}


export class Pedido {
    plato: Plato;
    cantidad: number;

    constructor(plato: Plato, cantidad: number){
        this.plato = plato;
        this.cantidad = cantidad;
    }
}