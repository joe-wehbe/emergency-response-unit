import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddFAQPageRoutingModule } from './add-faq-routing.module';

import { AddFAQPage } from './add-faq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddFAQPageRoutingModule
  ],
  declarations: [AddFAQPage]
})
export class AddFAQPageModule {}
