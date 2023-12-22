export class Mesa {

    numero: number;
    estado: EstadoMesa;
    x: number;
    y: number;

    constructor(numero: number, estado: EstadoMesa) {
        this.numero = numero;
        this.estado = estado;
        this.x = 0;
        this.y = 0;
    }
}

export type EstadoMesa = "Libre" | "A Cobrar" | "Ocupada" | "Controlada"; 