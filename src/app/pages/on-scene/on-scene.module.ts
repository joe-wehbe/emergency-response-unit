import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnScenePageRoutingModule } from './on-scene-routing.module';

import { OnScenePage } from './on-scene.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnScenePageRoutingModule
  ],
  declarations: [OnScenePage]
})
export class OnScenePageModule {}
