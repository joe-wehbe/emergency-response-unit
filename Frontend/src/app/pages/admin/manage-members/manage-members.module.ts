import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageMembersPageRoutingModule } from './manage-members-routing.module';

import { ManageMembersPage } from './manage-members.page';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageMembersPageRoutingModule,
    HttpClientModule
  ],
  declarations: [ManageMembersPage]
})
export class ManageMembersPageModule {}
