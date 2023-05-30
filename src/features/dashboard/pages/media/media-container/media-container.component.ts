import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { Store } from '@ngxs/store'
import { MediaListComponent } from '../components/media-list/media-list.component'
import { Media } from '../store/media.actions'

@Component({
  selector: 'oxa-media-container',
  templateUrl: './media-container.component.html',
  styleUrls: ['./media-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MediaListComponent, MatButtonModule, MatDividerModule],
})
export class MediaContainerComponent {
  constructor(private store: Store) {
    this.store.dispatch(new Media.LoadMediaItems(0, 25))
  }

  addNewItem() {
    this.store.dispatch(new Media.AddMediaItem())
  }
}
