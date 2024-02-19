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
    path: 'emergency-details',
    loadChildren: () => import('./pages/emergency-details/emergency-details.module').then( m => m.EmergencyDetailsPageModule)
  },
  {
    path: 'on-scene',
    loadChildren: () => import('./pages/on-scene/on-scene.module').then( m => m.OnScenePageModule)
  },
  {
    path: 'announcement',
    loadChildren: () => import('./pages/announcement/announcement.module').then( m => m.AnnouncementPageModule)
  },
  {
    path: 'extensions',
    loadChildren: () => import('./pages/extensions/extensions.module').then( m => m.ExtensionsPageModule)
  },
  {
    path: 'cover-requests',
    loadChildren: () => import('./pages/cover-requests/cover-requests.module').then( m => m.CoverRequestsPageModule)
  },
  {
    path: 'case-report-form',
    loadChildren: () => import('./pages/case-report-form/case-report-form.module').then( m => m.CaseReportFormPageModule)
  },
  {
    path: 'case-report',
    loadChildren: () => import('./pages/case-report/case-report.module').then( m => m.CaseReportPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
