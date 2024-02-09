import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'report-emergency',
    pathMatch: 'full'
  },
  {
    path: 'pending-request',
    loadChildren: () => import('./pages/pending-request/pending-request.module').then( m => m.PendingRequestPageModule)
  },
  {
    path: 'request-rejected',
    loadChildren: () => import('./pages/request-rejected/request-rejected.module').then( m => m.RequestRejectedPageModule)
  },
  {
    path: 'report-emergency',
    loadChildren: () => import('./pages/report-emergency/report-emergency.module').then( m => m.ReportEmergencyPageModule)
  },
  {
    path: 'standby',
    loadChildren: () => import('./pages/standby/standby.module').then( m => m.StandbyPageModule)
  },
  {
    path: 'community',
    loadChildren: () => import('./pages/community/community.module').then( m => m.CommunityPageModule)
  },
  {
    path: 'emergency-details',
    loadChildren: () => import('./pages/emergency-details/emergency-details.module').then( m => m.EmergencyDetailsPageModule)
  },  {
    path: 'on-scene',
    loadChildren: () => import('./pages/on-scene/on-scene.module').then( m => m.OnScenePageModule)
  },
  {
    path: 'medic-emergency-details',
    loadChildren: () => import('./pages/medic-emergency-details/medic-emergency-details.module').then( m => m.MedicEmergencyDetailsPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
