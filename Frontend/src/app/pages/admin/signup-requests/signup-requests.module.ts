import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupRequestsPageRoutingModule } from './signup-requests-routing.module';

import { SignupRequestsPage } from './signup-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupRequestsPageRoutingModule
  ],
  declarations: [SignupRequestsPage]
})
export class SignupRequestsPageModule {}
