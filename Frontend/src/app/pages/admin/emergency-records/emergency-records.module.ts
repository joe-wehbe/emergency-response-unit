import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmergencyRecordsPageRoutingModule } from './emergency-records-routing.module';

import { EmergencyRecordsPage } from './emergency-records.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmergencyRecordsPageRoutingModule
  ],
  declarations: [EmergencyRecordsPage]
})
export class EmergencyRecordsPageModule {}
