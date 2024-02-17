import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicalFaqsPageRoutingModule } from './medical-faqs-routing.module';

import { MedicalFaqsPage } from './medical-faqs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicalFaqsPageRoutingModule
  ],
  declarations: [MedicalFaqsPage]
})
export class MedicalFaqsPageModule {}
