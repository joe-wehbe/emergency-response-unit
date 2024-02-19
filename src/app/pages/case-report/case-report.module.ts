import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaseReportPageRoutingModule } from './case-report-routing.module';

import { CaseReportPage } from './case-report.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CaseReportPageRoutingModule,
  ],
  declarations: [CaseReportPage]
})
export class CaseReportPageModule {}
