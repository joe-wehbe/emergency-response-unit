import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadingMedicalFaqPageRoutingModule } from './reading-medical-faq-routing.module';

import { ReadingMedicalFaqPage } from './reading-medical-faq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadingMedicalFaqPageRoutingModule
  ],
  declarations: [ReadingMedicalFaqPage]
})
export class ReadingMedicalFaqPageModule {}
