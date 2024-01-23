import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [
    MenuComponent,
    TabsComponent
  ],
  exports: [
    MenuComponent,
    TabsComponent
  ]

})
export class ComponentsModule {}
