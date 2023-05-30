import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { canActivateAuth } from '@core/auth/cognito.service'
import { LoginComponent } from '@shared/components/auth/login/login.component'
import { RegisterComponent } from '@shared/components/auth/register/register.component'
import { SignInComponent } from '@shared/components/auth/sign-in/sign-in.component'

const routes: Routes = [
  {
    path: '',
    canActivate: [canActivateAuth],
    runGuardsAndResolvers: 'always',
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
  {
    path: 'login',
    canActivate: [canActivateAuth],
    component: LoginComponent,
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full',
      },
      {
        path: 'signin',
        component: SignInComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
