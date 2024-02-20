import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendingRequestPage } from './pending-request.page';

const routes: Routes = [
  {
    path: '',
    component: PendingRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingRequestPageRoutingModule {}
