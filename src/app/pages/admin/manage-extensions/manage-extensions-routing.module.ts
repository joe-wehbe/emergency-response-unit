import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageExtensionsPage } from './manage-extensions.page';

const routes: Routes = [
  {
    path: '',
    component: ManageExtensionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageExtensionsPageRoutingModule {}
