import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicalFAQPageRoutingModule } from './medical-faq-routing.module';

import { MedicalFAQPage } from './medical-faq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicalFAQPageRoutingModule
  ],
  declarations: [MedicalFAQPage]
})
export class MedicalFAQPageModule {}
