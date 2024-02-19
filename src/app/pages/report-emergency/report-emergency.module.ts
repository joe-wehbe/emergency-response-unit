import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportEmergencyPageRoutingModule } from './report-emergency-routing.module';

import { ReportEmergencyPage } from './report-emergency.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportEmergencyPageRoutingModule
  ],
  declarations: [ReportEmergencyPage]
})
export class ReportEmergencyPageModule {}
