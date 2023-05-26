import { importProvidersFrom, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { NgxsModule } from '@ngxs/store'
import { SupportState } from '@dashboard/support/store/support.state'
import { SupportContainerComponent } from '@dashboard/support/support-container.component'

@NgModule({
  declarations: [SupportContainerComponent],
  imports: [RouterModule.forChild([{ path: '', component: SupportContainerComponent }]), CommonModule],
  providers: [importProvidersFrom(NgxsModule.forFeature([SupportState]))],
  exports: [RouterModule],
})
export class SupportModule {}
