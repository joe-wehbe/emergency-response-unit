import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaseReportsPage } from './case-reports.page';

const routes: Routes = [
  {
    path: '',
    component: CaseReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseReportsPageRoutingModule {}
