import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicalFaqsPage } from './medical-faqs.page';

const routes: Routes = [
  {
    path: '',
    component: MedicalFaqsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalFaqsPageRoutingModule {}
