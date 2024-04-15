import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './components/tabs/tabs.component';
import { AdminGuard } from './guards/admin/admin.guard';
import { AuthGuard } from './guards/authentication/auth.guard';

const routes: Routes = [
  /* STARTING ROUTES */
  {
    path: 'login',
    loadChildren: () => import('./pages/starting/login/login.module').then( m => m.LoginPageModule), data: { showSideMenu: false } 
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/starting/register/register.module').then( m => m.RegisterPageModule), data: { showSideMenu: false }
  },

  /* MEMBER ROUTES*/
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    component: TabsComponent,
    children: [
      {
        path: 'report-emergency',
        loadChildren: () => import('src/app/pages/member/report-emergency/report-emergency.module').then( m => m.ReportEmergencyPageModule)
      },
      {
        path: 'on-scene',
        loadChildren: () => import('src/app/pages/member/on-scene/on-scene.module').then( m => m.OnScenePageModule)
      },
      {
        path: 'standby',
        loadChildren: () => import('src/app/pages/member/standby/standby.module').then( m => m.StandbyPageModule)
      },
      {
        path: '',
        redirectTo: 'tabs/report-emergency',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'emergency-details/:id',
    loadChildren: () => import('./pages/member/emergency-details/emergency-details.module').then( m => m.EmergencyDetailsPageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard]
  },
  {
    path: 'medic-emergency-details/:id',
    loadChildren: () => import('./pages/member/medic-emergency-details/medic-emergency-details.module').then( m => m.MedicEmergencyDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/member/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/member/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard]
  },
  {
    path: 'community',
    loadChildren: () => import('./pages/member/community/community.module').then( m => m.CommunityPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'announcements',
    loadChildren: () => import('./pages/member/announcements/announcements.module').then( m => m.AnnouncementsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cover-requests',
    loadChildren: () => import('./pages/member/cover-requests/cover-requests.module').then( m => m.CoverRequestsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'case-reports',
    loadChildren: () => import('./pages/member/case-reports/case-reports.module').then( m => m.CaseReportsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'case-report-form/:id',
    loadChildren: () => import('./pages/member/case-report-form/case-report-form.module').then( m => m.CaseReportFormPageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard]
  },
  {
    path: 'extensions',
    loadChildren: () => import('./pages/member/extensions/extensions.module').then( m => m.ExtensionsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'medical-faqs',
    loadChildren: () => import('./pages/member/medical-faqs/medical-faqs.module').then( m => m.MedicalFaqsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reading-medical-faq',
    loadChildren: () => import('./pages/member/reading-medical-faq/reading-medical-faq.module').then( m => m.ReadingMedicalFaqPageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard]
  },

  /* Admin Routes */
  {
    path: 'admin-panel',
    loadChildren: () => import('./pages/admin/admin-panel/admin-panel.module').then( m => m.AdminPanelPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'manage-members',
    loadChildren: () => import('./pages/admin/manage-members/manage-members.module').then( m => m.ManageMembersPageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'user-profile/:id',
    loadChildren: () => import('./pages/admin/user-profile/user-profile.module').then( m => m.UserProfilePageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'change-schedule/:id',
    loadChildren: () => import('./pages/admin/change-schedule/change-schedule.module').then( m => m.ChangeSchedulePageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'manage-announcements',
    loadChildren: () => import('./pages/admin/manage-announcements/manage-announcements.module').then( m => m.ManageAnnouncementsPageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'manage-faqs',
    loadChildren: () => import('./pages/admin/manage-faqs/manage-faqs.module').then( m => m.ManageFAQsPageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'medical-faq',
    loadChildren: () => import('./pages/admin/medical-faq/medical-faq.module').then( m => m.MedicalFAQPageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'manage-extensions',
    loadChildren: () => import('./pages/admin/manage-extensions/manage-extensions.module').then( m => m.ManageExtensionsPageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'emergency-records',
    loadChildren: () => import('./pages/admin/emergency-records/emergency-records.module').then( m => m.EmergencyRecordsPageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'attendance-records',
    loadChildren: () => import('./pages/admin/attendance-records/attendance-records.module').then( m => m.AttendanceRecordsPageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'signup-requests',
    loadChildren: () => import('./pages/admin/signup-requests/signup-requests.module').then( m => m.SignupRequestsPageModule), data: { showSideMenu: false },
    canActivate: [AuthGuard, AdminGuard]
  },

  /* SSF Routes */
  {
    path: 'report',
    loadChildren: () => import('./pages/ssf/report/report.module').then( m => m.ReportPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
