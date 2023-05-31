import { CommonModule } from '@angular/common'
import { NgModule, importProvidersFrom } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'
import { RouterModule } from '@angular/router'
import { NgxsModule } from '@ngxs/store'
import { HeaderComponent } from '@shared/components/header/header.component'
import { ProfileContainerComponent } from './profile-container/profile-container.component'
import { ProfileState } from './store/profile.state'
import { ProfileInfoComponent } from './components/profile-info/profile-info.component'
import { ProfileActionsComponent } from './components/profile-actions/profile-actions.component'

@NgModule({
  declarations: [ProfileContainerComponent],
  imports: [
    RouterModule.forChild([{ path: '', component: ProfileContainerComponent }]),
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    HeaderComponent,
    ProfileInfoComponent,
    ProfileActionsComponent,
  ],
  providers: [importProvidersFrom(NgxsModule.forFeature([ProfileState]))],
  exports: [ProfileContainerComponent],
})
export class ProfileModule {}
