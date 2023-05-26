import { importProvidersFrom, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RouterModule } from '@angular/router'
import { AdminContainerComponent } from './admin-container/admin-container.component'
import { NgxsModule } from '@ngxs/store'
import { AdminState } from '@dashboard/admin/store/admin.state'

@NgModule({
  declarations: [AdminContainerComponent],
  imports: [RouterModule.forChild([{ path: '', component: AdminContainerComponent }]), CommonModule],
  providers: [importProvidersFrom(NgxsModule.forFeature([AdminState]))],
  exports: [RouterModule],
})
export class AdminModule {}
