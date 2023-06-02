import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MediaItemModel } from '@dashboard/media/store/media-item.model'
import { Media } from '@dashboard/media/store/media.actions'
import { MediaState } from '@dashboard/media/store/media.state'
import { Actions, Select, Store, ofActionDispatched, ofActionSuccessful } from '@ngxs/store'
import { RxIf } from '@rx-angular/template/if'
import { LetDirective } from '@rx-angular/template/let'
import { Observable, debounceTime } from 'rxjs'
import { MediaTableComponent } from '../media-table/media-table.component'

@Component({
  selector: 'oxa-media-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MediaTableComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RxIf,
    LetDirective,
  ],
  templateUrl: './media-wrapper.component.html',
  styleUrls: ['./media-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaWrapperComponent {
  @Select(MediaState.getMedia) items$: Observable<MediaItemModel[]>

  @Select(MediaState.getMediaTotal) total$: Observable<number>

  @Select(MediaState.getIsSearchMode) searchMode$: Observable<boolean>

  @ViewChild(MediaTableComponent, { static: true }) tableComponent: MediaTableComponent

  selectedItems: MediaItemModel[] = []

  searchControl = new FormControl()

  isLoading$ = this.actions.pipe(
    ofActionDispatched(
      Media.MergeMediaItems,
      Media.SaveMediaItem,
      Media.RemoveMediaItem,
      Media.Search,
      Media.LoadMediaItems
    )
  )

  constructor(private store: Store, private actions: Actions) {
    this.searchControl.valueChanges.pipe(debounceTime(700), takeUntilDestroyed()).subscribe(value => {
      if (value) {
        this.store.dispatch(new Media.Search(value))
      } else {
        this.store.dispatch(
          new Media.LoadMediaItems({
            skip: 0,
            limit: 25,
          })
        )
      }
    })

    this.actions.pipe(ofActionSuccessful(Media.LoadMediaItems), takeUntilDestroyed()).subscribe(() => {
      this.searchControl.setValue('', { emitEvent: false })
    })

    this.actions
      .pipe(ofActionSuccessful(Media.SaveMediaItem, Media.RemoveMediaItem, Media.MergeMediaItems), takeUntilDestroyed())
      .subscribe(() => this.onLoadItems(this.tableComponent.getTableState()))

    this.actions
      .pipe(ofActionSuccessful(Media.AddMediaItem), takeUntilDestroyed())
      .subscribe(() => this.tableComponent.resetEditingIndex())

    this.actions.pipe(ofActionSuccessful(Media.Search), takeUntilDestroyed()).subscribe(() => {
      this.tableComponent.resetTableState()
    })
  }

  addNewItem() {
    this.store.dispatch(new Media.AddMediaItem())
  }

  mergeItems() {
    this.store.dispatch(new Media.MergeMediaItems(this.selectedItems.map(x => x.id)))
  }

  onSelectionChange($event: MediaItemModel[]) {
    this.selectedItems = $event
  }

  onLoadItems($event: { skip: number; limit: number; sort?: string; order?: 'asc' | 'desc' | '' }) {
    if (this.searchControl.value) {
      this.store.dispatch(new Media.Search(this.searchControl.value))
    } else {
      this.store.dispatch(new Media.LoadMediaItems({ ...$event }))
    }
  }

  onSaveItem($event: MediaItemModel) {
    this.store.dispatch(new Media.SaveMediaItem($event))
  }

  onRemoveItem(id: string) {
    this.store.dispatch(new Media.RemoveMediaItem(id))
  }

  onCancelItem() {
    this.store.dispatch(new Media.RemoveDraftItem())
  }
}
