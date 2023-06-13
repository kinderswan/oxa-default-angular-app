import { NgModule } from '@angular/core'
import { DashboardRoutingModule } from './dashboard-routing.module'
import { DashboardComponent } from './dashboard.component'

import { MatButtonModule } from '@angular/material/button'
import { OxaLazy } from '@shared/components/lazy/lazy.directive'

@NgModule({
  declarations: [DashboardComponent],
  imports: [DashboardRoutingModule, MatButtonModule, OxaLazy],
})
export class DashboardModule {}
