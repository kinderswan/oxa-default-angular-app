import { NgModule, importProvidersFrom } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProfileContainerComponent } from './profile-container/profile-container.component'
import { ProfileInfoComponent } from './profile-info/profile-info.component'
import { ProfileActionsComponent } from './profile-actions/profile-actions.component'
import { MatButtonModule } from '@angular/material/button'
import { RxCommonModule } from '@shared/rx-common.module'
import { RouterModule } from '@angular/router'
import { NgxsModule } from '@ngxs/store'
import { ProfileState } from './store/profile.state'
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'

@NgModule({
  declarations: [ProfileContainerComponent, ProfileInfoComponent, ProfileActionsComponent],
  imports: [
    RouterModule.forChild([{ path: '', component: ProfileContainerComponent }]),
    CommonModule,
    RxCommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
  ],
  providers: [importProvidersFrom(NgxsModule.forFeature([ProfileState]))],
  exports: [ProfileContainerComponent],
})
export class ProfileModule {}
