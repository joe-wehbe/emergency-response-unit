import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtensionsPage } from './extensions.page';

const routes: Routes = [
  {
    path: '',
    component: ExtensionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtensionsPageRoutingModule {}
