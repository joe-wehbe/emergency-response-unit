import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaseReportPageRoutingModule } from './case-report-routing.module';

import { CaseReportPage } from './case-report.page';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [CaseReportPage],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        IonicModule,
        CaseReportPageRoutingModule,
        ComponentsModule
    ]
})
export class CaseReportPageModule {}
