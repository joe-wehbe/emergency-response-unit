import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddExtensionPageRoutingModule } from './add-extension-routing.module';

import { AddExtensionPage } from './add-extension.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddExtensionPageRoutingModule
  ],
  declarations: [AddExtensionPage]
})
export class AddExtensionPageModule {}
