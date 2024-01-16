import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Admin Panel',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login-requests',
    loadChildren: () => import('./pages/login-requests/login-requests.module').then( m => m.LoginRequestsPageModule)
  },
  {
    path: 'no-requests',
    loadChildren: () => import('./pages/no-requests/no-requests.module').then( m => m.NoRequestsPageModule)
  },
  {
    path: 'medical-faq',
    loadChildren: () => import('./pages/medical-faq/medical-faq.module').then( m => m.MedicalFAQPageModule)
  },
  {
    path: 'manage-faq',
    loadChildren: () => import('./pages/manage-faq/manage-faq.module').then( m => m.ManageFAQPageModule)
  },
  {
    path: 'no-faqs',
    loadChildren: () => import('./pages/no-faqs/no-faqs.module').then( m => m.NoFAQsPageModule)
  },
  {
    path: 'add-faq',
    loadChildren: () => import('./pages/add-faq/add-faq.module').then( m => m.AddFAQPageModule)
  },
  {
    path: 'add-announcements',
    loadChildren: () => import('./pages/add-announcements/add-announcements.module').then( m => m.AddAnnouncementsPageModule)
  },
  {
    path: 'manage-announcements',
    loadChildren: () => import('./pages/manage-announcements/manage-announcements.module').then( m => m.ManageAnnouncementsPageModule)
  },
  {
    path: 'no-announcements',
    loadChildren: () => import('./pages/no-announcements/no-announcements.module').then( m => m.NoAnnouncementsPageModule)
  },
  {
    path: 'manage-extensions',
    loadChildren: () => import('./pages/manage-extensions/manage-extensions.module').then( m => m.ManageExtensionsPageModule)
  },
  {
    path: 'add-extension',
    loadChildren: () => import('./pages/add-extension/add-extension.module').then( m => m.AddExtensionPageModule)
  },
  {
    path: 'manage-members',
    loadChildren: () => import('./pages/manage-members/manage-members.module').then( m => m.ManageMembersPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
