import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceRecordsPageRoutingModule } from './attendance-records-routing.module';

import { AttendanceRecordsPage } from './attendance-records.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceRecordsPageRoutingModule
  ],
  declarations: [AttendanceRecordsPage]
})
export class AttendanceRecordsPageModule {}
