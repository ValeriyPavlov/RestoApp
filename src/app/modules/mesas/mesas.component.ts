import { Component } from '@angular/core';
import { EstadoMesa, Mesa } from '../../entities/Mesa';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.scss']
})

export class MesasComponent {

  public numero: number | undefined = undefined;
  public estado: EstadoMesa = "Libre";
  public mesas: Mesa[] = [];
  public boton: string = "Agregar";
  public mesaSeleccionada: Mesa | undefined = undefined;
  public order: boolean;

  constructor(public dbService: DbService){
    this.initialize();
    this.mesas = this.dbService.leerJson("mesas") as Mesa[];
    this.order = true;
  }

  public agregar(){
    if(this.numero != undefined){

      if(this.boton == "Agregar"){
        let mesa = new Mesa(this.numero, this.estado);
        this.dbService.agregarJson(mesa, "mesas");
        this.initialize();
        console.log("Mesa Agregada!");
        this.mesas = this.dbService.leerJson("mesas") as Mesa[];
      }

      if(this.boton == "Modificar"){
        let index = this.mesas.findIndex(p => p == this.mesaSeleccionada);
        let mesaModificada = new Mesa(this.numero, this.estado);
        this.mesas[index] = mesaModificada;
        this.dbService.modificarJson(this.mesas, "mesas");
        this.initialize();
        console.log("Mesa Modificada!");
      }
    }
  }

  public initialize(){
    this.numero = undefined;
    this.estado = "Libre";
    this.boton = "Agregar";
    this.mesaSeleccionada = undefined;
  }

  public eliminar(mesa: Mesa){
    if(confirm(`¿Eliminar mesa ${mesa.numero}?`)){
      this.mesas = this.mesas.filter(item => item !== mesa);
      this.dbService.modificarJson(this.mesas, "mesas");
      console.log("Mesa Eliminada!");
    }
  }

  public modificar(mesa: Mesa){
    this.numero = mesa.numero;
    this.estado = mesa.estado;
    this.mesaSeleccionada = mesa;
    this.boton = "Modificar";
  }

  public ordenar(key: string){
    if(key == "Numero"){
      if(this.order){
        this.mesas = this.mesas.sort((a, b) => a.numero - b.numero);
      }
      else{
        this.mesas = this.mesas.sort((a, b) => b.numero - a.numero);
      }
      
    }
    if(key == "Estado"){
      if(this.order){
        this.mesas = this.mesas.sort((a, b) => b.estado.localeCompare(a.estado));
      }
      else{
        this.mesas = this.mesas.sort((a, b) => a.estado.localeCompare(b.estado));
      }
    }
    this.order = !this.order;
  }
}
