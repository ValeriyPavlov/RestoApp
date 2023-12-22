import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  public async alerta(message: string){
    return await Swal.fire({
      title: 'Admin',
      text: message,
      icon: 'warning',
      position: 'center',
      iconColor: 'red',
      input: 'password',
      confirmButtonText: 'Confirmar',
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    })
  }

}
