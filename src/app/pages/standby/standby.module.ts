import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StandbyPageRoutingModule } from './standby-routing.module';

import { StandbyPage } from './standby.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    StandbyPageRoutingModule
  ],
  declarations: [StandbyPage]
})
export class StandbyPageModule {}
