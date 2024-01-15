import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAnnouncementsPageRoutingModule } from './add-announcements-routing.module';

import { AddAnnouncementsPage } from './add-announcements.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAnnouncementsPageRoutingModule
  ],
  declarations: [AddAnnouncementsPage]
})
export class AddAnnouncementsPageModule {}
