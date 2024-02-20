import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginRequestsPage } from './login-requests.page';

const routes: Routes = [
  {
    path: '',
    component: LoginRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRequestsPageRoutingModule {}
