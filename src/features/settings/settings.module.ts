import { NgModule } from '@angular/core'

import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component'
import { ProfileModule } from './pages/profile/profile.module'
import { SettingsRoutingModule } from './settings-routing.module'
import { SettingsComponent } from './settings.component'
import { SidenavComponent } from '@shared/components/sidenav/sidenav.component'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [SettingsComponent],
  imports: [SettingsRoutingModule, ProfileModule, ToolbarComponent, SidenavComponent, MatIconModule, MatButtonModule],
})
export class SettingsModule {}
