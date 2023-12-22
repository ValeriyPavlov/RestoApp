import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from '../app/guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: "comanda", pathMatch: 'full' },
  { path: 'platos', loadChildren: () =>import('./modules/platos/platos.module').then((m) => m.PlatosModule),  canActivate: [adminGuard]},
  { path: 'mesas', loadChildren: () =>import('./modules/mesas/mesas.module').then((m) => m.MesasModule),  canActivate: [adminGuard]},
  { path: 'caja', loadChildren: () =>import('./modules/caja/caja.module').then((m) => m.CajaModule),  canActivate: [adminGuard]},
  { path: 'comanda', loadChildren: () =>import('./modules/comanda/comanda.module').then((m) => m.ComandaModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
