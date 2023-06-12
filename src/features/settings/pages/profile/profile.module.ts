import { NgModule, importProvidersFrom } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NgxsModule } from '@ngxs/store'
import { ProfileContainerComponent } from './profile-container/profile-container.component'
import { ProfileState } from './store/profile.state'

@NgModule({
  imports: [ProfileContainerComponent, RouterModule.forChild([{ path: '', component: ProfileContainerComponent }])],
  providers: [importProvidersFrom(NgxsModule.forFeature([ProfileState]))],
})
export class ProfileModule {}
