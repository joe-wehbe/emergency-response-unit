import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoverRequestsPage } from './cover-requests.page';

const routes: Routes = [
  {
    path: '',
    component: CoverRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoverRequestsPageRoutingModule {}
