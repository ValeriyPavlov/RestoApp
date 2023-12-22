import { Component } from '@angular/core';
import { Plato, Categoria, Tipo } from '../../entities/Plato';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-platos',
  templateUrl: './platos.component.html',
  styleUrls: ['./platos.component.scss']
})

export class PlatosComponent {

  public nombre: string = "";
  public descripcion: string = "";
  public precio: number | undefined = undefined;
  public categoria: Categoria = "";
  public tipo: Tipo = "";

  public order: boolean = true;

  public platos: Plato[] = [];

  public boton: string = "Agregar";
  public platoSeleccionado: Plato | undefined = undefined;

  constructor(public dbService: DbService){
    this.initialize();
    this.platos = this.dbService.leerJson("platos") as Plato[];
  }

  public agregar(){
    if(this.nombre != "" && this.precio != undefined && this.categoria != "" && this.tipo != ""){

      if(this.boton == "Agregar"){
        let plato = new Plato(this.nombre, this.descripcion, this.precio, this.categoria, this.tipo);
        this.dbService.agregarJson(plato, "platos");
        this.initialize();
        console.log("Plato Agregado!");
        this.platos = this.dbService.leerJson("platos") as Plato[];
      }

      if(this.boton == "Modificar"){
        let index = this.platos.findIndex(p => p == this.platoSeleccionado);
        let platoModificado = new Plato(this.nombre, this.descripcion, this.precio, this.categoria, this.tipo);
        this.platos[index] = platoModificado;
        this.dbService.modificarJson(this.platos, "platos");
        this.initialize();
        console.log("Plato Modificado!");
      }
    }
  }

  public initialize(){
    this.nombre = "";
    this.descripcion = "";
    this.precio = undefined;
    this.categoria = "";
    this.tipo = "";
    this.boton = "Agregar";
    this.platoSeleccionado = undefined;
  }

  public modificar(plato: Plato){
    this.nombre = plato.nombre;
    this.descripcion = plato.descripcion;
    this.tipo = plato.tipo;
    this.precio = plato.precio;
    this.categoria = plato.categoria;
    this.boton = "Modificar";
    this.platoSeleccionado = plato;
  }

  public eliminar(plato: Plato){
    if(confirm(`¿Eliminar ${plato.nombre}?`)){
      this.platos = this.platos.filter(item => item !== plato);
      this.dbService.modificarJson(this.platos, "platos");
      console.log("Plato Eliminado!");
    }
  }

  public ordenar(key: string){
    if(key == "Precio"){
      if(this.order){
        this.platos = this.platos.sort((a, b) => a.precio - b.precio);
      }
      else{
        this.platos = this.platos.sort((a, b) => b.precio - a.precio);
      }
    }
    if(key == "Nombre"){
      if(this.order){
        this.platos = this.platos.sort((a, b) => b.nombre.localeCompare(a.nombre));
      }
      else{
        this.platos = this.platos.sort((a, b) => a.nombre.localeCompare(b.nombre));
      }
    }
    if(key == "Categoria"){
      if(this.order){
        this.platos = this.platos.sort((a, b) => b.categoria.localeCompare(a.categoria));
      }
      else{
        this.platos = this.platos.sort((a, b) => a.categoria.localeCompare(b.categoria));
      }
    }
    if(key == "Tipo"){
      if(this.order){
        this.platos = this.platos.sort((a, b) => b.tipo.localeCompare(a.tipo));
      }
      else{
        this.platos = this.platos.sort((a, b) => a.tipo.localeCompare(b.tipo));
      }
    }
    this.order = !this.order;
  }
}
