import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Comanda, Pedido } from '../entities/Comanda';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor() { }

  public agregarJson(data: any, key: string){
    let datosGuardados = JSON.parse(localStorage.getItem(key)!);
    if(datosGuardados != null){
      datosGuardados.push(data);
      localStorage.setItem(key, JSON.stringify(datosGuardados));
    }
    else{
      let nuevoArray: any[] = [];
      nuevoArray.push(data);
      localStorage.setItem(key, JSON.stringify(nuevoArray));
    }
  }

  public leerJson(key: string){
    return JSON.parse(localStorage.getItem(key)!);
  }

  public modificarJson(data: any, key: string){
    localStorage.setItem(key, JSON.stringify(data));
  }

  public exportComandasToXls(comandas: Comanda[], fileName: string) {
    const comandasMapped = comandas.map((comanda) => {
      return {
        Fecha: `${comanda.fecha}`,
        Mesa: `${comanda.mesa}`,
        Pedidos: `${this.getPedidos(comanda.pedido)}`
      };
    });
    const workSheet = XLSX.utils.json_to_sheet(comandasMapped);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'comandas');
    XLSX.writeFile(workBook, `${fileName}.xlsx`);
  }

  private getPedidos(pedidos: Pedido[]){
    let retorno = "";
    let i = 1;
    pedidos.forEach(p => {
      retorno += `${i}) ${p.cantidad}x ${p.plato.nombre} `
      i += 1;
    });
    return retorno;
  }




}
