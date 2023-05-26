import { importProvidersFrom, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RouterModule } from '@angular/router'
import { UserContainerComponent } from './user-container/user-container.component'
import { NgxsModule } from '@ngxs/store'
import { UserState } from '@dashboard/user/store/user.state'

@NgModule({
  declarations: [UserContainerComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: UserContainerComponent }])],
  providers: [importProvidersFrom(NgxsModule.forFeature([UserState]))],
  exports: [RouterModule],
})
export class UserModule {}
