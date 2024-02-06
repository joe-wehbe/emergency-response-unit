import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnScenePageRoutingModule } from './on-scene-routing.module';

import { OnScenePage } from './on-scene.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    OnScenePageRoutingModule
  ],
  declarations: [OnScenePage]
})
export class OnScenePageModule {}
