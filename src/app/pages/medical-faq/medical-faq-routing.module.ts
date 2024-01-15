import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicalFAQPage } from './medical-faq.page';

const routes: Routes = [
  {
    path: '',
    component: MedicalFAQPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalFAQPageRoutingModule {}
