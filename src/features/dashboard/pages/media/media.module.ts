import { importProvidersFrom, NgModule } from '@angular/core'

import { RouterModule } from '@angular/router'
import { MediaState } from '@dashboard/media/store/media.state'
import { NgxsModule } from '@ngxs/store'
import { MediaContainerComponent } from './media-container/media-container.component'
import { lazyServiceFactoryProvider } from '@shared/components/lazy/lazy.service'

@NgModule({
  imports: [MediaContainerComponent, RouterModule.forChild([{ path: '', component: MediaContainerComponent }])],
  providers: [
    importProvidersFrom(NgxsModule.forFeature([MediaState])),
    lazyServiceFactoryProvider({
      'oxa-media-wrapper': () =>
        import('@features/dashboard/pages/media/components/media-wrapper/media-wrapper.component').then(
          c => c.MediaWrapperComponent
        ),
    }),
  ],
  exports: [RouterModule],
})
export class MediaModule {}
