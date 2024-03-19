import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupRequestsPage } from './signup-requests.page';

const routes: Routes = [
  {
    path: '',
    component: SignupRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupRequestsPageRoutingModule {}
