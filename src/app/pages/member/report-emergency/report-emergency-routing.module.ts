import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportEmergencyPage } from './report-emergency.page';

const routes: Routes = [
  {
    path: '',
    component: ReportEmergencyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportEmergencyPageRoutingModule {}
