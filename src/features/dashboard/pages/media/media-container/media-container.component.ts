import { ChangeDetectionStrategy, Component } from '@angular/core'
import { OxaLazy } from '@shared/components/lazy/lazy.directive'
import { lazyServiceFactoryProvider } from '@shared/components/lazy/lazy.service'

@Component({
  selector: 'oxa-media-container',
  templateUrl: './media-container.component.html',
  styleUrls: ['./media-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [OxaLazy],
  providers: [
    lazyServiceFactoryProvider({
      'oxa-media-wrapper': () =>
        import('@features/dashboard/pages/media/components/media-wrapper/media-wrapper.component').then(
          c => c.MediaWrapperComponent
        ),
    }),
  ],
})
export class MediaContainerComponent {}
