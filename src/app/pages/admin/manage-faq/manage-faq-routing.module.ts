import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageFAQPage } from './manage-faq.page';

const routes: Routes = [
  {
    path: '',
    component: ManageFAQPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageFAQPageRoutingModule {}
