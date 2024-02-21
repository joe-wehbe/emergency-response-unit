import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaseReportFormPage } from './case-report-form.page';

const routes: Routes = [
  {
    path: '',
    component: CaseReportFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseReportFormPageRoutingModule {}
