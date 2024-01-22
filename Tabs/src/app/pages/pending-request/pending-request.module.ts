import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingRequestPageRoutingModule } from './pending-request-routing.module';

import { PendingRequestPage } from './pending-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingRequestPageRoutingModule
  ],
  declarations: [PendingRequestPage]
})
export class PendingRequestPageModule {}
