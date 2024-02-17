import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaseReportFormPageRoutingModule } from './case-report-form-routing.module';

import { CaseReportFormPage } from './case-report-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CaseReportFormPageRoutingModule
  ],
  declarations: [CaseReportFormPage]
})
export class CaseReportFormPageModule {}
