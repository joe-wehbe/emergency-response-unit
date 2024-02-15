import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtensionsPageRoutingModule } from './extensions-routing.module';

import { ExtensionsPage } from './extensions.page';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    ExtensionsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ExtensionsPage]
})
export class ExtensionsPageModule {}
