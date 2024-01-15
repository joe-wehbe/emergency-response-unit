import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoRequestsPageRoutingModule } from './no-requests-routing.module';

import { NoRequestsPage } from './no-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoRequestsPageRoutingModule
  ],
  declarations: [NoRequestsPage]
})
export class NoRequestsPageModule {}
