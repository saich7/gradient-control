import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GradientControlModule } from 'gradient-control';
import { RotateControlModule } from 'rotate-control';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    GradientControlModule,
    RotateControlModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
