import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicEmergencyDetailsPage } from './medic-emergency-details.page';

const routes: Routes = [
  {
    path: '',
    component: MedicEmergencyDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicEmergencyDetailsPageRoutingModule {}
