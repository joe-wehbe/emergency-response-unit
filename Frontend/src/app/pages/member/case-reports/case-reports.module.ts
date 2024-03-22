import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaseReportsPageRoutingModule } from './case-reports-routing.module';

import { CaseReportsPage } from './case-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CaseReportsPageRoutingModule,
  ],
  declarations: [CaseReportsPage]
})
export class CaseReportsPageModule {}
