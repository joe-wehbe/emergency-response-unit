import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadingMedicalFaqPage } from './reading-medical-faq.page';

const routes: Routes = [
  {
    path: '',
    component: ReadingMedicalFaqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadingMedicalFaqPageRoutingModule {}
