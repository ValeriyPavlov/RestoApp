import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatosRoutingModule } from './platos-routing.module';
import { PlatosComponent } from './platos.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PlatosComponent
  ],
  imports: [
    CommonModule,
    PlatosRoutingModule,
    FormsModule
  ]
})
export class PlatosModule { }
