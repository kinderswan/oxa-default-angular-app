import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MediaTableComponent } from '../media-table/media-table.component'
import { MediaItemModel } from '@dashboard/media/store/media-item.model'
import { Media } from '@dashboard/media/store/media.actions'
import { Store } from '@ngxs/store'

@Component({
  selector: 'oxa-media-wrapper',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MediaTableComponent],
  templateUrl: './media-wrapper.component.html',
  styleUrls: ['./media-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaWrapperComponent {
  selectedItems: MediaItemModel[] = []

  constructor(private store: Store) {}

  addNewItem() {
    this.store.dispatch(new Media.AddMediaItem())
  }

  mergeItems() {
    this.store.dispatch(new Media.MergeMediaItems(this.selectedItems.map(x => x.id)))
  }

  onSelectionChange($event: MediaItemModel[]) {
    this.selectedItems = $event
  }
}
