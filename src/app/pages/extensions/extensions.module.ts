import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtensionsPageRoutingModule } from './extensions-routing.module';

import { ExtensionsPage } from './extensions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExtensionsPageRoutingModule
  ],
  declarations: [ExtensionsPage]
})
export class ExtensionsPageModule {}
