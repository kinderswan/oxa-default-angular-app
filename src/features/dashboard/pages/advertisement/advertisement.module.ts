import { importProvidersFrom, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { NgxsModule } from '@ngxs/store'
import { AdvertisementContainerComponent } from '@dashboard/advertisement/advertisement-container.component'
import { AdvertisementState } from '@dashboard/advertisement/store/advertisement.state'

@NgModule({
  declarations: [AdvertisementContainerComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: AdvertisementContainerComponent }])],
  providers: [importProvidersFrom(NgxsModule.forFeature([AdvertisementState]))],
  exports: [RouterModule],
})
export class AdvertisementModule {}
