import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddExtensionPage } from './add-extension.page';

const routes: Routes = [
  {
    path: '',
    component: AddExtensionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddExtensionPageRoutingModule {}
