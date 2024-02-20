import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageExtensionsPageRoutingModule } from './manage-extensions-routing.module';

import { ManageExtensionsPage } from './manage-extensions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageExtensionsPageRoutingModule
  ],
  declarations: [ManageExtensionsPage]
})
export class ManageExtensionsPageModule {}
