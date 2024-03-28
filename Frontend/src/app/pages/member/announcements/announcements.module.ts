import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnnouncementsPageRoutingModule } from './announcements-routing.module';

import { AnnouncementsPage } from './announcements.page';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common'; 
@NgModule({
  declarations: [AnnouncementsPage],
  providers: [DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    AnnouncementsPageRoutingModule,
    
  ]
})
export class AnnouncementsPageModule {}
