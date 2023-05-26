import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'media',
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'media',
        loadChildren: () => import('./pages/media/media.module').then(m => m.MediaModule),
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
