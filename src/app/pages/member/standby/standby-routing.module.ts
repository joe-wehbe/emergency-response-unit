import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StandbyPage } from './standby.page';

const routes: Routes = [
  {
    path: '',
    component: StandbyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StandbyPageRoutingModule {}
