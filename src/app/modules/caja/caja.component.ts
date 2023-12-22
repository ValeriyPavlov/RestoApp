import { Component } from '@angular/core';
import { Comanda } from '../../entities/Comanda';
import { Mesa } from '../../entities/Mesa';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.scss']
})
export class CajaComponent {

  public comandas: Comanda[] = [];
  public mesas: Mesa[] = [];
  public cajaInicial: number = 0;
  public cajaIngresada: number = 0;
  public mensaje: string = "";
  public efectivo: number = 0;
  public tarjeta: number = 0;

  constructor(public dbService: DbService){
    this.comandas = this.dbService.leerJson('comandas');
    this.cajaInicial = this.dbService.leerJson('caja');
    this.mesas = this.dbService.leerJson("mesas");
    this.efectivo = this.dbService.leerJson('efectivo');
    this.tarjeta = this.dbService.leerJson('tarjeta');
    this.mensaje = this.setMensaje();
  }

  public establecerCaja(){
    this.cajaInicial = this.cajaIngresada;
    this.dbService.modificarJson(this.cajaInicial, "caja");
  }

  public setMensaje(){
    let resp = this.chequearMesas();
    if(resp){
      return "Todas las mesas estan Libres.";
    }
    else{
      return "Hay mesas que estan Ocupadas";
    }
  }

  public chequearMesas(){
    let retorno = true;
    this.mesas.forEach(m => {
      if(m.estado == "Ocupada"){
        retorno = false;
      }
    });
    return retorno;
  }

  public cerrarCaja(){
    if(this.chequearMesas() && confirm("Esta seguro que desea cerrar la caja?")){
      const fecha = new Date();

      let fileName = `Ventas_${fecha.getDate()}-${fecha.getMonth()+1}-${fecha.getFullYear()}_Efectivo_${this.efectivo}_Tarjeta_${this.tarjeta}`;
      this.dbService.exportComandasToXls(this.comandas, fileName);

      let com: Comanda[] = [];
      this.dbService.modificarJson(0, 'caja');
      this.dbService.modificarJson(0, 'efectivo');
      this.dbService.modificarJson(0, 'tarjeta');
      this.dbService.modificarJson(com, 'comandas');

      this.cajaInicial = 0;
      this.tarjeta = 0;
      this.efectivo = 0;
    }
  }

}
