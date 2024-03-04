import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeSchedulePage } from './change-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeSchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeSchedulePageRoutingModule {}
