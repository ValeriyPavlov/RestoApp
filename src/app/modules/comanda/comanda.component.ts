import { Component } from '@angular/core';
import { CdkDrag, CdkDragHandle, CdkDragStart, CdkDragEnd} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf} from "@angular/common";
import { DbService } from '../../services/db.service';
import { Mesa } from '../../entities/Mesa';
import { Comanda, Pedido } from '../../entities/Comanda';
import { Plato } from '../../entities/Plato';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
  styleUrls: ['./comanda.component.scss'],
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, NgForOf, NgIf, FormsModule],
})
export class ComandaComponent {

  public mesas: Mesa[] = [];
  public comandas: Comanda[] = [];
  public selectedMesa: Mesa | undefined = undefined;
  public pedidos: Pedido[] = [];
  public pedidosViejos: Pedido [] = [];
  public platos: Plato[] = [];
  public barra: Plato[] = [];
  public cocina: Plato[] = [];
  public precioFinal: number = 0;
  public comentario: string = "";
  public botonesCocina: boolean = false;
  public botonesBarra: boolean = true;
  public tipoSeleccionado: string = "";
  public cerrarM: boolean = false;
  public cerrarDeshabilitado: boolean = true;
  public efectivo: number = 0;
  public tarjeta: number = 0;

  constructor(public dbService: DbService, public printService: NgxPrintService, private sanitizer: DomSanitizer, public alertService: AlertService){
    this.mesas = this.dbService.leerJson('mesas') as Mesa[];
    this.platos = this.dbService.leerJson('platos') as Plato[];
    this.barra = this.platos.filter(item => item.categoria == "Barra") as Plato[];
    this.cocina = this.platos.filter(item => item.categoria == "Cocina") as Plato[]
  }

  public seleccionar(mesa: Mesa){
    this.selectedMesa = mesa;
    this.pedidosViejos = [];
    if(this.selectedMesa.estado != "Libre"){
      this.comandas = this.dbService.leerJson('comandas') as Comanda[];
      let ultimaComanda = this.buscarComanda();
      if(ultimaComanda != undefined){
        this.pedidos = ultimaComanda.pedido;
        this.comentario = "";
        this.pedidosViejos = this.setPedidosViejos(ultimaComanda.pedido);
      }
      this.calcularPrecioFinal();
    }
  }


  public setPedidosViejos(pedidos: Pedido[]){
    const viejos: Pedido[] = [];
    pedidos.forEach(p => {
      let pedido = new Pedido(p.plato, p.cantidad);
      viejos.push(pedido);
    });
    return viejos;
  }


  public buscarComanda(){
    const comandas = this.comandas.filter(c => c.mesa === this.selectedMesa?.numero);
    if (comandas.length > 0) {
      comandas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      return comandas[0];
    } else {
      return undefined;
    }
  }

  public agregar(plato: Plato){
    if(plato != undefined && this.controlPlatosRepetidos(plato) == true)
    {
      let pedido = new Pedido(plato, 1);
      this.pedidos.push(pedido);
    }
    this.calcularPrecioFinal();
  }

  public calcularPrecioFinal(){
    this.precioFinal = this.pedidos.reduce((acumulador, pedido) => acumulador + (pedido.cantidad * pedido.plato.precio), 0);
  }

  public controlPlatosRepetidos(plato: Plato){
    let retorno = true;
    this.pedidos.forEach(pedido => {
      if(pedido.plato.nombre == plato.nombre){
        retorno = false;
      }
    });
    return retorno;
  }

  public inicializar(){
    this.selectedMesa = undefined;
    this.pedidos = [];
    this.precioFinal = 0;
    this.comentario = "";
    this.tipoSeleccionado = "";
    this.pedidosViejos = [];
    this.cerrarDeshabilitado = true;
    this.tarjeta = 0;
    this.efectivo = 0;
  }

  public crearComanda(){
    if(this.pedidos.length > 0 && this.selectedMesa != undefined && this.selectedMesa.estado == "Libre"){
      let comanda = new Comanda(this.selectedMesa.numero, this.pedidos, this.comentario);
      this.mesas.forEach(m => {
        if(this.selectedMesa?.numero == m.numero){
          m.estado = "Ocupada";
        }
      });
      this.dbService.modificarJson(this.mesas, "mesas");
      this.dbService.agregarJson(comanda, "comandas");
      console.log("Pedido creado");
      this.imprimir("comanda");
      this.inicializar();
    }
    if(this.pedidos.length > 0 && this.selectedMesa != undefined && this.selectedMesa.estado != "Libre"){
      let ultimaComanda = this.buscarComanda();
      if(ultimaComanda != undefined){
        ultimaComanda.comentario = this.comentario;
        ultimaComanda.pedido = this.pedidos;
      }
      if(this.chequearNuevos()){
        this.dbService.modificarJson(this.comandas, "comandas");
        console.log("Pedido adicional creado.");
        this.imprimir("comanda");
      }
      this.inicializar();
    }
  }

  public chequearNuevos(){
    let retorno = false;
    this.pedidos.forEach(p => {
      let bandera = false;
      this.pedidosViejos.forEach(v => {
        if(p.plato.nombre == v.plato.nombre){
          bandera = true;
          if(p.cantidad != v.cantidad){
            retorno = true;
          }
        }
      });
      if(bandera == false){
        retorno = true;
      }
    });
    return retorno;
  }

  public setColor(mesa: Mesa){
    switch(mesa.estado){
      case "Libre":
        return "#8dc071";
      case "Ocupada":
        return "#d28678";
      case "A Cobrar":
        return "#54c5e8";
      case "Controlada":
        return "#f0fa97";
    }
  }

  public mostrarBotones(key:string){
    if(key == "Cocina"){
      this.botonesCocina = true;
      this.botonesBarra = false;
    }
    if(key == "Barra"){
      this.botonesBarra = true;
      this.botonesCocina = false;
    }
    this.tipoSeleccionado = "";
  }

  public seleccionarTipo(tipo: string){
    this.tipoSeleccionado = tipo;
  }

  public getPlatos(){
    return this.platos.filter(item => item.tipo == this.tipoSeleccionado) as Plato[]
  }

  public getTipos(){

    if(this.botonesCocina){
      return Array.from(new Set(this.cocina.map(plato => plato.tipo)));
    }
    else{
      return Array.from(new Set(this.barra.map(plato => plato.tipo)));
    }
  }

  public seleccionarCategoria(sector: boolean){
    if(sector){
      return 'rgb(120, 240, 180)';
    }
    else{
      return '#adbabb';
    }
  }

  public modificarCantidad(pedido: Pedido, cant: number){

    if(this.pedidosViejos.length == 0){
      this.pedidos.forEach(p => {
        if(p === pedido){
          if(cant == 0 || (cant == -1 && p.cantidad == 1)){
            this.pedidos = this.pedidos.filter(item => item !== pedido);
          }
          else{
            p.cantidad = p.cantidad + cant;
          }
        }
      });
    }
    else{
      const platos = this.pedidosViejos.map(p => p.plato.nombre);
      if(platos.includes(pedido.plato.nombre)){
        this.pedidos.forEach(p => {
          this.pedidosViejos.forEach(v => {
            if(p.plato.nombre == v.plato.nombre && p.plato.nombre == pedido.plato.nombre){
              if(cant == -1 && p.cantidad > v.cantidad){
                p.cantidad = p.cantidad + cant;
              }
              if(cant == 1){
                p.cantidad = p.cantidad + cant;
              }
            }
          });
        });
      }
      else{
        this.pedidos.forEach(p => {
          if(p === pedido){
            if(cant == 0 || (cant == -1 && p.cantidad == 1)){
              this.pedidos = this.pedidos.filter(item => item !== pedido);
            }
            else{
              p.cantidad = p.cantidad + cant;
            }
          }
        });
      }
    }
    this.calcularPrecioFinal();
  }


  public cerrarMesa(){
    this.cerrarM = !this.cerrarM;
  }

  public confirmarCerrarMesa(){
    if(this.pedidos.length > 0 && this.selectedMesa != undefined && this.selectedMesa.estado == "Libre"){
      let comanda = new Comanda(this.selectedMesa.numero, this.pedidos, this.comentario);
      this.dbService.agregarJson(comanda, "comandas");
    }
    if(this.pedidos.length > 0 && this.selectedMesa != undefined && this.selectedMesa.estado != "Libre"){
      let ultimaComanda = this.buscarComanda();
      if(ultimaComanda != undefined){
        ultimaComanda.comentario = this.comentario;
        ultimaComanda.pedido = this.pedidos;
      }
      if(this.chequearNuevos()){
        this.dbService.modificarJson(this.comandas, "comandas");
      }
    }
    
    this.mesas.forEach(m => {
      if(this.selectedMesa?.numero == m.numero){
        m.estado = "Libre";
      }
    });
    let efect = this.dbService.leerJson("efectivo");
    let tarj = this.dbService.leerJson("tarjeta");
    if(efect != null){
      efect = efect + this.efectivo;
    }else{
      efect = this.efectivo;
    }
    if(tarj != null){
      tarj = tarj + this.tarjeta;
    }else{
      tarj = this.tarjeta;
    }
    this.dbService.modificarJson(efect, "efectivo");
    this.dbService.modificarJson(tarj, "tarjeta");
    this.dbService.modificarJson(this.mesas, "mesas");
    this.controlar();
    this.inicializar();
    this.cerrarM = false;
  }

  public async anularCantidad(pedido: Pedido){
    let pass = "12345";
    let retorno = await this.alertService.alerta("Ingrese contraseña para ANULAR el item del pedido:");
    if(retorno.isConfirmed && retorno.value === pass){
      this.pedidos.forEach(p => {
        if(pedido == p){
          p.plato.precio = 0;
          p.plato.nombre = `A_${p.plato.nombre}`;
        }
      });
      if(this.comandas.length > 0){
        this.dbService.modificarJson(this.comandas, "comandas");
      }
      this.calcularPrecioFinal();
    }
  }


  public onDragStarted(event: CdkDragStart, elementId: number) {
    console.log("Moviendo mesa");
  }

  public onDragEnded(event: CdkDragEnd, elementId: number) {
    this.mesas.forEach(m => {
      if(m.numero == elementId){
        m.x = event.source.getFreeDragPosition().x;
        m.y = event.source.getFreeDragPosition().y;
      }
    });
    this.dbService.modificarJson(this.mesas, "mesas");
  }

  public imprimir(id: string) {

    const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: id,
    });
    this.printService.print(customPrintOptions);
  }

  public getHora(){
    const hora = new Date();
    let horas = hora.getHours();
    let minutos = hora.getMinutes();
    let dia = hora.getDate();
    let mes = hora.getMonth() + 1;
    let anio = hora.getFullYear();
    let horasStr = "";
    let miutosStr = "";
    if(horas < 10){
      horasStr = `0${horas}`;
    }else{
      horasStr = `${horas}`;
    }
    if(minutos < 10){
      miutosStr = `0${minutos}`;
    }else{
      miutosStr = `${minutos}`;
    }
    return `${horasStr}:${miutosStr}   ${dia}/${mes}/${anio}`;
  }

  public getPedidos(): SafeHtml{

    let retorno = "";
    let listaPedidos: Pedido[] = [];

    if(this.pedidosViejos.length == 0){
      listaPedidos = this.pedidos;
    }else{
      listaPedidos = this.getComandaAdicional();
    }

    listaPedidos.forEach(p => {
      if(p.plato.categoria == "Barra"){
        retorno = retorno + p.cantidad.toString() + " - " + p.plato.nombre + "<br>";
      }
    });
    retorno = retorno + "<br>";
    listaPedidos.forEach(p => {
      if(p.plato.categoria == "Cocina"){
        retorno = retorno + p.cantidad.toString() + " - " + p.plato.nombre + "<br>";
      }
    });
    return this.sanitizer.bypassSecurityTrustHtml(retorno);
  }

  public getComandaAdicional(){
    let pedidosExtra: Pedido[] = [];

    this.pedidos.forEach(p => {
      let bandera = false;
      this.pedidosViejos.forEach(v => {
        if(p.plato.nombre == v.plato.nombre){
          bandera = true;
          if(p.cantidad != v.cantidad){
            pedidosExtra.push(new Pedido(p.plato, (p.cantidad - v.cantidad)));
          }
        }
      });
      if(bandera == false){
        pedidosExtra.push(p);
      }
    });
    return pedidosExtra;
  }

  public controlar(){
    this.imprimir("control");
  }

  public getTotal(){

    let total: number = 0;
    this.pedidos.forEach(p => {
      total = total + p.plato.precio * p.cantidad;
    });
    return total;
  }

  
}



