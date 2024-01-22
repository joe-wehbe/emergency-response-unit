import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestRejectedPage } from './request-rejected.page';

const routes: Routes = [
  {
    path: '',
    component: RequestRejectedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRejectedPageRoutingModule {}
