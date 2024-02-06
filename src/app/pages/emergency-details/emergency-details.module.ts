import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmergencyDetailsPageRoutingModule } from './emergency-details-routing.module';

import { EmergencyDetailsPage } from './emergency-details.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    EmergencyDetailsPageRoutingModule
  ],
  declarations: [EmergencyDetailsPage]
})
export class EmergencyDetailsPageModule {}
