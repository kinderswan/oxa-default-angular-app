import { importProvidersFrom, NgModule } from '@angular/core'

import { RouterModule } from '@angular/router'
import { MediaContainerComponent } from './media-container/media-container.component'
import { NgxsModule } from '@ngxs/store'
import { MediaState } from '@dashboard/media/store/media.state'

@NgModule({
  imports: [MediaContainerComponent, RouterModule.forChild([{ path: '', component: MediaContainerComponent }])],
  providers: [importProvidersFrom(NgxsModule.forFeature([MediaState]))],
  exports: [RouterModule],
})
export class MediaModule {}
