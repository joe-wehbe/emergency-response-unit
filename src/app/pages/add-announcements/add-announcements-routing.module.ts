import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAnnouncementsPage } from './add-announcements.page';

const routes: Routes = [
  {
    path: '',
    component: AddAnnouncementsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAnnouncementsPageRoutingModule {}
