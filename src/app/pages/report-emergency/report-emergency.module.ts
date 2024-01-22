import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportEmergencyPageRoutingModule } from './report-emergency-routing.module';

import { ReportEmergencyPage } from './report-emergency.page';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportEmergencyPageRoutingModule
  ],
  declarations: [ReportEmergencyPage, MenuComponent, TabsComponent]
})
export class ReportEmergencyPageModule {}
