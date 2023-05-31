import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MediaWrapperComponent } from '../components/media-wrapper/media-wrapper.component'
import { HeaderComponent } from '@shared/components/header/header.component'

@Component({
  selector: 'oxa-media-container',
  templateUrl: './media-container.component.html',
  styleUrls: ['./media-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MediaWrapperComponent, MatButtonModule, MatDividerModule, HeaderComponent],
})
export class MediaContainerComponent {}
