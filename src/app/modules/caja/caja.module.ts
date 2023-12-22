import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { CajaComponent } from './caja.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CajaComponent
  ],
  imports: [
    CommonModule,
    CajaRoutingModule,
    FormsModule
  ]
})
export class CajaModule { }
