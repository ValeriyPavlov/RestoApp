export class Plato {

    nombre: string;
    descripcion: string;
    precio: number;
    categoria: Categoria;
    tipo: Tipo;

    constructor(nombre: string, descripcion: string, precio: number, categoria: Categoria, tipo: Tipo){
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoria = categoria;
        this.tipo = tipo;
    }
}

export type Categoria = "Cocina" | "Barra" | "Otro" | "";
export type Tipo = "Entrada"| "Postre" | "Principal" | "Con Alcohol" | "Sin Alcohol" | "Gasificada" | "Sin Gas" | "Vino" | "Cerveza" | "Trago" | "Otro" |""; 