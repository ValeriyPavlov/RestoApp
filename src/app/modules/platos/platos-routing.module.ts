import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatosComponent } from './platos.component';

const routes: Routes = [
  {
    path: '', component: PlatosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatosRoutingModule { }
