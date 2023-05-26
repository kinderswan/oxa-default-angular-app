import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users',
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'users',
        loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule),
      },
      {
        path: 'coaches',
        loadChildren: () => import('./pages/coach/coach.module').then(m => m.CoachModule),
      },
      {
        path: 'financials',
        loadChildren: () => import('./pages/financials/financials.module').then(m => m.FinancialsModule),
      },
      {
        path: 'reporting',
        loadChildren: () => import('./pages/reporting/reporting.module').then(m => m.ReportingModule),
      },
      {
        path: 'support',
        loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule),
      },
      {
        path: 'advertisement',
        loadChildren: () => import('./pages/advertisement/advertisement.module').then(m => m.AdvertisementModule),
      },
      {
        path: 'content-management',
        loadChildren: () =>
          import('./pages/content-management/content-management.module').then(m => m.ContentManagementModule),
      },
      {
        path: 'admins',
        loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
