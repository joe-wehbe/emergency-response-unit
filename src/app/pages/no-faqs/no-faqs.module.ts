import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoFAQsPageRoutingModule } from './no-faqs-routing.module';

import { NoFAQsPage } from './no-faqs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoFAQsPageRoutingModule
  ],
  declarations: [NoFAQsPage]
})
export class NoFAQsPageModule {}
