import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageFAQsPage } from './manage-faqs.page';

const routes: Routes = [
  {
    path: '',
    component: ManageFAQsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageFAQsPageRoutingModule {}
