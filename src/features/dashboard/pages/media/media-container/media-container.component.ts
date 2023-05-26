import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { MediaListComponent } from '../components/media-list/media-list.component'
import { Select, Store } from '@ngxs/store'
import { Media } from '../store/media.actions'
import { MediaState } from '../store/media.state'
import { MediaItemModel } from '../store/media-item.model'
import { Observable } from 'rxjs'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'

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
    this.store.dispatch(new Media.LoadMediaItems())
  }

  @Select(MediaState.getMedia) mediaItems$: Observable<MediaItemModel[]>

  addNewItem() {
    this.store.dispatch(new Media.AddMediaItem())
  }
}
