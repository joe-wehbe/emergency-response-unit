import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageFAQPageRoutingModule } from './manage-faq-routing.module';

import { ManageFAQPage } from './manage-faq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageFAQPageRoutingModule
  ],
  declarations: [ManageFAQPage]
})
export class ManageFAQPageModule {}
