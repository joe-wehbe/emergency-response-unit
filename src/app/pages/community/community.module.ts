import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CommunityPageRoutingModule } from './community-routing.module';

import { CommunityPage } from './community.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityPageRoutingModule,
    HttpClientModule,
    RouterModule.forChild([
      {
        path: '',
        component: CommunityPage
      }
    ])
  ],
  declarations: [CommunityPage]
})
export class CommunityPageModule {}
