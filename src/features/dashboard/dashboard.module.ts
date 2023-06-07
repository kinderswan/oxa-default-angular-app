import { NgModule } from '@angular/core'
import { DashboardRoutingModule } from './dashboard-routing.module'
import { DashboardComponent } from './dashboard.component'

import { MatIconModule } from '@angular/material/icon'
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component'
import { SidenavComponent } from '@shared/components/sidenav/sidenav.component'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [DashboardComponent],
  imports: [DashboardRoutingModule, SidenavComponent, ToolbarComponent, MatIconModule, MatButtonModule],
})
export class DashboardModule {}
