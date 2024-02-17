import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaseReportFormPageRoutingModule } from './case-report-form-routing.module';

import { CaseReportFormPage } from './case-report-form.page';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    CaseReportFormPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CaseReportFormPage]
})
export class CaseReportFormPageModule {}
