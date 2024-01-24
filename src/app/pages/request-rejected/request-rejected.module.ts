import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestRejectedPageRoutingModule } from './request-rejected-routing.module';

import { RequestRejectedPage } from './request-rejected.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestRejectedPageRoutingModule
  ],
  declarations: [RequestRejectedPage]
})
export class RequestRejectedPageModule {}
