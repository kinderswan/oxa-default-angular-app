import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { DashboardRoutingModule } from './dashboard-routing.module'
import { DashboardComponent } from './dashboard.component'

import { RxCommonModule } from '@shared/rx-common.module'
import { MatIconModule } from '@angular/material/icon'
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component'
import { SidenavComponent } from '@shared/components/sidenav/sidenav.component'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RxCommonModule,
    SidenavComponent,
    ToolbarComponent,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
  ],
})
export class DashboardModule {}
