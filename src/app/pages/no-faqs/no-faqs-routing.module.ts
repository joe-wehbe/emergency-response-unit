import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoFAQsPage } from './no-faqs.page';

const routes: Routes = [
  {
    path: '',
    component: NoFAQsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoFAQsPageRoutingModule {}
