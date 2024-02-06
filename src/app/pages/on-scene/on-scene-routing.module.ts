import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnScenePage } from './on-scene.page';

const routes: Routes = [
  {
    path: '',
    component: OnScenePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnScenePageRoutingModule {}
