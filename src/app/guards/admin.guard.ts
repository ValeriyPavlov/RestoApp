import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AlertService } from '../services/alert.service';

export const adminGuard: CanActivateFn = (route, state) => {

  const service = inject(AlertService);
  let pass = "12345";


  let retorno = service.alerta("Ingrese contraseña del admin:").then((a) => {
    
    if(a.isConfirmed && a.value === pass){
      return true;
    }
    else
    {
      return false;
    }
  });

  return retorno;
};

