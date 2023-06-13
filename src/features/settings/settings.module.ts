import { NgModule } from '@angular/core'

import { ProfileModule } from './pages/profile/profile.module'
import { SettingsRoutingModule } from './settings-routing.module'
import { SettingsComponent } from './settings.component'
import { MatButtonModule } from '@angular/material/button'
import { OxaLazy } from '@shared/components/lazy/lazy.directive'

@NgModule({
  declarations: [SettingsComponent],
  imports: [SettingsRoutingModule, ProfileModule, MatButtonModule, OxaLazy],
})
export class SettingsModule {}
