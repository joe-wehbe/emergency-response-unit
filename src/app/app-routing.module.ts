import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin-panel',
    pathMatch: 'full'
  },
  {
    path: 'login-requests',
    loadChildren: () => import('./pages/admin/login-requests/login-requests.module').then( m => m.LoginRequestsPageModule)
  },
  {
    path: 'medical-faq',
    loadChildren: () => import('./pages/admin/medical-faq/medical-faq.module').then( m => m.MedicalFAQPageModule)
  },
  {
    path: 'manage-faq',
    loadChildren: () => import('./pages/admin/manage-faq/manage-faq.module').then( m => m.ManageFAQPageModule)
  },
  {
    path: 'manage-announcements',
    loadChildren: () => import('./pages/admin/manage-announcements/manage-announcements.module').then( m => m.ManageAnnouncementsPageModule)
  },
  {
    path: 'manage-extensions',
    loadChildren: () => import('./pages/admin/manage-extensions/manage-extensions.module').then( m => m.ManageExtensionsPageModule)
  },
  {
    path: 'manage-members',
    loadChildren: () => import('./pages/admin/manage-members/manage-members.module').then( m => m.ManageMembersPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/admin/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'admin-panel',
    loadChildren: () => import('./pages/admin/admin-panel/admin-panel.module').then( m => m.AdminPanelPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
