import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GradientControlComponent } from './gradient-control.component';



@NgModule({
  declarations: [
    GradientControlComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    GradientControlComponent
  ]
})
export class GradientControlModule { }
