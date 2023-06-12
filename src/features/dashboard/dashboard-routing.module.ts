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
      {
        path: 'test',
        loadChildren: () => import('./pages/test/test.module').then(m => m.TestModule),
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
