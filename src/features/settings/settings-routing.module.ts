import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SettingsComponent } from './settings.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile',
  },
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
