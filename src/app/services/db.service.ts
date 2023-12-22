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
        Fecha: `${this.getFecha(comanda.fecha)}`,
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
    let i = 0;
    pedidos.forEach(p => {
      i += 1;
      if(i != 1){retorno += ", "}
      retorno += `${i}) ${p.cantidad}x ${p.plato.nombre} $${p.plato.precio * p.cantidad}`
    });
    return retorno;
  }

  private getFecha(date: Date){

    const fecha = new Date(date);

    let horas = fecha.getHours();
    let minutos = fecha.getMinutes();
    let segundos = fecha.getSeconds();
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let anio = fecha.getFullYear();
    let horasStr = "";
    let minutosStr = "";
    let segundosStr = "";
    if(horas < 10){
      horasStr = `0${horas}`;
    }else{
      horasStr = `${horas}`;
    }
    if(minutos < 10){
      minutosStr = `0${minutos}`;
    }else{
      minutosStr = `${minutos}`;
    }
    if(segundos < 10){
      segundosStr = `0${segundos}`;
    }else{
      segundosStr = `${segundos}`;
    }
    return `${horasStr}:${minutosStr}:${segundosStr} ${dia}/${mes}/${anio}`;
  }




}
