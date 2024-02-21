import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StandbyPageRoutingModule } from './standby-routing.module';

import { StandbyPage } from './standby.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StandbyPageRoutingModule
  ],
  declarations: [StandbyPage]
})
export class StandbyPageModule {}
