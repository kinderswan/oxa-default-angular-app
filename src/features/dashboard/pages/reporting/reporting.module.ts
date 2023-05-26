import { importProvidersFrom, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReportingContainerComponent } from './reporting-container.component'
import { RouterModule } from '@angular/router'
import { NgxsModule } from '@ngxs/store'
import { ReportingState } from '@dashboard/reporting/store/reporting.state'

@NgModule({
  declarations: [ReportingContainerComponent],
  imports: [RouterModule.forChild([{ path: '', component: ReportingContainerComponent }]), CommonModule],
  providers: [importProvidersFrom(NgxsModule.forFeature([ReportingState]))],
  exports: [RouterModule],
})
export class ReportingModule {}
