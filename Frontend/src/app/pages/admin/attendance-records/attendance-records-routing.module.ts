import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceRecordsPage } from './attendance-records.page';

const routes: Routes = [
  {
    path: '',
    component: AttendanceRecordsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceRecordsPageRoutingModule {}
