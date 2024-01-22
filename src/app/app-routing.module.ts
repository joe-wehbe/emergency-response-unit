import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pending-request',
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
