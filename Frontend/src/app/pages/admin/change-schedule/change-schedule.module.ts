import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeSchedulePageRoutingModule } from './change-schedule-routing.module';

import { ChangeSchedulePage } from './change-schedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeSchedulePageRoutingModule
  ],
  declarations: [ChangeSchedulePage]
})
export class ChangeSchedulePageModule {}
