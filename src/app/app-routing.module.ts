import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

// import { canActivateAuth } from '@core/auth/auth.service'

const routes: Routes = [
  {
    path: '',
    // canActivate: [canActivateAuth],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../features/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('../features/settings/settings.module').then(m => m.SettingsModule),
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
