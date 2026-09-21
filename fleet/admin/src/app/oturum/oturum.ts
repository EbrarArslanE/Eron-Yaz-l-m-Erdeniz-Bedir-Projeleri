import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { oturumRoutingModule } from './oturum-routing';
import { girisComponent } from './giris/giris';
import { NgOtpInputModule } from 'ng-otp-input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormDirective } from '../core/directives/form.directive';

@NgModule({
  imports: [
    CommonModule,
    oturumRoutingModule,
    FormsModule,
    NgOtpInputModule,
    ReactiveFormsModule
  ],
  declarations: [
    girisComponent,
    
    FormDirective
  ]
})

export class oturumModule { }