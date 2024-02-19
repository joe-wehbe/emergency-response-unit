import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaseReportPage } from './case-report.page';

const routes: Routes = [
  {
    path: '',
    component: CaseReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseReportPageRoutingModule {}
