import { importProvidersFrom, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { NgxsModule } from '@ngxs/store'
import {
  ContentManagementContainerComponent
} from '@dashboard/content-management/content-management-container.component'
import { ContentManagementState } from '@dashboard/content-management/store/content-management.state'

@NgModule({
  declarations: [ContentManagementContainerComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ContentManagementContainerComponent }])],
  providers: [importProvidersFrom(NgxsModule.forFeature([ContentManagementState]))],
  exports: [RouterModule],
})
export class ContentManagementModule {}
