import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoAnnouncementsPageRoutingModule } from './no-announcements-routing.module';

import { NoAnnouncementsPage } from './no-announcements.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoAnnouncementsPageRoutingModule
  ],
  declarations: [NoAnnouncementsPage]
})
export class NoAnnouncementsPageModule {}
