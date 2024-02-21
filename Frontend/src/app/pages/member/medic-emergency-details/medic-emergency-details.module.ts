import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicEmergencyDetailsPageRoutingModule } from './medic-emergency-details-routing.module';

import { MedicEmergencyDetailsPage } from './medic-emergency-details.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicEmergencyDetailsPageRoutingModule
  ],
  declarations: [MedicEmergencyDetailsPage]
})
export class MedicEmergencyDetailsPageModule {}
