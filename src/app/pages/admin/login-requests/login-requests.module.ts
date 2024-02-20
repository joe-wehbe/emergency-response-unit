import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginRequestsPageRoutingModule } from './login-requests-routing.module';

import { LoginRequestsPage } from './login-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginRequestsPageRoutingModule
  ],
  declarations: [LoginRequestsPage]
})
export class LoginRequestsPageModule {}
