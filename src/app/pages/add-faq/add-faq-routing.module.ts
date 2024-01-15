import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddFAQPage } from './add-faq.page';

const routes: Routes = [
  {
    path: '',
    component: AddFAQPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddFAQPageRoutingModule {}
