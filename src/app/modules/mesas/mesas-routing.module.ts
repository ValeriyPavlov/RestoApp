import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MesasComponent } from './mesas.component';

const routes: Routes = [
  {
    path: '', component: MesasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MesasRoutingModule { }
