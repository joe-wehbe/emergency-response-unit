import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoAnnouncementsPage } from './no-announcements.page';

const routes: Routes = [
  {
    path: '',
    component: NoAnnouncementsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoAnnouncementsPageRoutingModule {}
