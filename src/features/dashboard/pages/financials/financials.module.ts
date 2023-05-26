import { importProvidersFrom, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { NgxsModule } from '@ngxs/store'
import { FinancialsContainerComponent } from '@dashboard/financials/financials-container/financials-container.component'
import { FinancialsState } from '@dashboard/financials/store/financials.state'

@NgModule({
  declarations: [FinancialsContainerComponent],
  imports: [RouterModule.forChild([{ path: '', component: FinancialsContainerComponent }]), CommonModule],
  providers: [importProvidersFrom(NgxsModule.forFeature([FinancialsState]))],
  exports: [RouterModule],
})
export class FinancialsModule {}
