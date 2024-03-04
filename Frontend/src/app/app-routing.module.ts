import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './components/tabs/tabs.component';

const routes: Routes = [

  /* Member Routes*/
  {
    path: '',
    redirectTo: '/tabs/report-emergency',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
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
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'pending-request',
    loadChildren: () => import('./pages/member/pending-request/pending-request.module').then( m => m.PendingRequestPageModule)
  },
  {
    path: 'request-rejected',
    loadChildren: () => import('./pages/member/request-rejected/request-rejected.module').then( m => m.RequestRejectedPageModule)
  },
  {
    path: 'emergency-details',
    loadChildren: () => import('./pages/member/emergency-details/emergency-details.module').then( m => m.EmergencyDetailsPageModule)
  },
  {
    path: 'medic-emergency-details',
    loadChildren: () => import('./pages/member/medic-emergency-details/medic-emergency-details.module').then( m => m.MedicEmergencyDetailsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/member/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/member/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'community',
    loadChildren: () => import('./pages/member/community/community.module').then( m => m.CommunityPageModule)
  },
  {
    path: 'case-report',
    loadChildren: () => import('./pages/member/case-report/case-report.module').then( m => m.CaseReportPageModule)
  },
  {
    path: 'announcement',
    loadChildren: () => import('./pages/member/announcement/announcement.module').then( m => m.AnnouncementPageModule)
  },
  {
    path: 'extensions',
    loadChildren: () => import('./pages/member/extensions/extensions.module').then( m => m.ExtensionsPageModule)
  },
  {
    path: 'cover-requests',
    loadChildren: () => import('./pages/member/cover-requests/cover-requests.module').then( m => m.CoverRequestsPageModule)
  },
  {
    path: 'case-report-form',
    loadChildren: () => import('./pages/member/case-report-form/case-report-form.module').then( m => m.CaseReportFormPageModule)
  },
  {
    path: 'case-report',
    loadChildren: () => import('./pages/member/case-report/case-report.module').then( m => m.CaseReportPageModule)
  },
  {
    path: 'medical-faqs',
    loadChildren: () => import('./pages/member/medical-faqs/medical-faqs.module').then( m => m.MedicalFaqsPageModule)
  },
  {
    path: 'reading-medical-faq',
    loadChildren: () => import('./pages/member/reading-medical-faq/reading-medical-faq.module').then( m => m.ReadingMedicalFaqPageModule)
  },


  /* Admin Routes */
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
    path: 'user-profile',
    loadChildren: () => import('./pages/admin/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'admin-panel',
    loadChildren: () => import('./pages/admin/admin-panel/admin-panel.module').then( m => m.AdminPanelPageModule)
  },

  /* SSF Routes */
  {
    path: 'report',
    loadChildren: () => import('./pages/ssf/report/report.module').then( m => m.ReportPageModule)
  },  {
    path: 'emergency-records',
    loadChildren: () => import('./pages/admin/emergency-records/emergency-records.module').then( m => m.EmergencyRecordsPageModule)
  },
  {
    path: 'attendance-records',
    loadChildren: () => import('./pages/admin/attendance-records/attendance-records.module').then( m => m.AttendanceRecordsPageModule)
  },
  {
    path: 'change-schedule',
    loadChildren: () => import('./pages/admin/change-schedule/change-schedule.module').then( m => m.ChangeSchedulePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
