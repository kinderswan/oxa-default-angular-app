import { NgModule } from '@angular/core'
import { DashboardRoutingModule } from './dashboard-routing.module'
import { DashboardComponent } from './dashboard.component'

import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { SidenavComponent } from '@shared/components/sidenav/sidenav.component'
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component'
import { OxaLazy } from '@shared/components/lazy/lazy.directive'

@NgModule({
  declarations: [DashboardComponent],
  imports: [DashboardRoutingModule, SidenavComponent, ToolbarComponent, MatIconModule, MatButtonModule, OxaLazy],
})
export class DashboardModule {}
