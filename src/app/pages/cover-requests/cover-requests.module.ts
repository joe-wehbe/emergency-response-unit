import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoverRequestsPageRoutingModule } from './cover-requests-routing.module';

import { CoverRequestsPage } from './cover-requests.page';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    CoverRequestsPageRoutingModule,
    ComponentsModule

  ],
  declarations: [CoverRequestsPage]
})
export class CoverRequestsPageModule {}
