import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaseReportPageRoutingModule } from './case-report-routing.module';

import { CaseReportPage } from './case-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CaseReportPageRoutingModule
  ],
  declarations: [CaseReportPage]
})
export class CaseReportPageModule {}
