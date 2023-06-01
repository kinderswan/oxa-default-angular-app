import { SelectionModel } from '@angular/cdk/collections'
import { CommonModule, DatePipe } from '@angular/common'
import { AfterViewInit, ChangeDetectionStrategy, Component, Output, ViewChild } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'
import { MatSort, MatSortModule, Sort } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MediaItemModel, MediaStatus } from '@dashboard/media/store/media-item.model'
import { Media } from '@dashboard/media/store/media.actions'
import { MediaState } from '@dashboard/media/store/media.state'
import { Actions, Select, Store, ofActionDispatched, ofActionSuccessful } from '@ngxs/store'
import { Observable, Subject, merge, of, startWith, switchMap, tap } from 'rxjs'
import { PushPipe } from '@rx-angular/template/push'
import { RxIf } from '@rx-angular/template/if'
import { LetDirective } from '@rx-angular/template/let'
@Component({
  selector: 'oxa-media-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    DatePipe,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSortModule,
    PushPipe,
    RxIf,
    LetDirective,
  ],
  templateUrl: './media-table.component.html',
  styleUrls: ['./media-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaTableComponent implements AfterViewInit {
  @Select(MediaState.getMedia) items$: Observable<MediaItemModel[]>

  @Select(MediaState.getMediaTotal) total$: Observable<number>

  @ViewChild('paginator') paginator: MatPaginator

  @ViewChild(MatSort) sort: MatSort

  mediaItems$: Observable<MediaItemModel[]>

  suspenseTrigger$ = this.actions.pipe(
    ofActionDispatched(Media.MergeMediaItems, Media.SaveMediaItem, Media.RemoveMediaItem)
  )

  displayedColumns = ['select', 'id', 'name', 'status', 'createdBy', 'lastUpdated', 'actions']

  editingIdx?: string | null

  dataSource = new MatTableDataSource<MediaItemModel>()

  selection = new SelectionModel<MediaItemModel>(true, [])

  @Output() selectionChange = this.selection.changed.pipe(switchMap(() => of(this.selection.selected)))

  mediaStatuses = Object.values(MediaStatus)

  pageSizes = [5, 10, 25, 50, 100]

  mediaForm = this.fb.group({
    media: this.fb.array<MediaItemModel>([]),
  })

  private sortChange$ = new Subject<Sort>()

  constructor(private fb: FormBuilder, private store: Store, private actions: Actions) {
    this.actions
      .pipe(ofActionSuccessful(Media.SaveMediaItem, Media.RemoveMediaItem, Media.MergeMediaItems), takeUntilDestroyed())
      .subscribe(() => this.loadMediaItems())

    this.actions
      .pipe(ofActionSuccessful(Media.AddMediaItem), takeUntilDestroyed())
      .subscribe(() => (this.editingIdx = 'null'))
  }

  ngAfterViewInit(): void {
    this.mediaItems$ = merge(this.paginator.page, this.sortChange$).pipe(
      startWith({}),
      tap(() => this.loadMediaItems()),
      switchMap(() => {
        return this.items$.pipe(
          tap(data => {
            this.dataSource = new MatTableDataSource(data)
            this.selection.clear()
            this.setMediaFormArray(data)
          })
        )
      })
    )
  }

  trackMedia(_: number, item: MediaItemModel) {
    return item.id
  }

  onRowEdit(id: string, isEditing: boolean) {
    this.selection.clear()
    const item = this.mediaForm.controls.media.getRawValue().find(x => x?.id === id)

    if (isEditing && item && !this.checkIfChanged(item, id)) {
      this.store.dispatch(new Media.SaveMediaItem(item))
    }
    this.editingIdx = isEditing ? null : item?.id
  }

  onRowRemove(id: MediaItemModel['id']) {
    this.store.dispatch(new Media.RemoveMediaItem(id))
  }

  onRowCancel(id: MediaItemModel['id']) {
    this.editingIdx = null
    if (id === 'null') {
      return this.store.dispatch(new Media.RemoveNotAddedMediaItem())
    }
    return this.resetControl(id)
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear()
      return
    }

    this.selection.select(...this.dataSource.data)
  }

  onSortChange($event: Sort) {
    this.sortChange$.next($event)
  }

  private loadMediaItems() {
    const lastId = this.dataSource.data?.[this.dataSource.data.length - 1]?.['id']

    this.store.dispatch(
      new Media.LoadMediaItems(lastId, this.paginator.pageSize, this.sort?.active, this.sort?.direction)
    )
  }

  private setMediaFormArray(data: MediaItemModel[]) {
    const mediaArray = this.mediaForm.controls.media as FormArray

    data?.forEach((item, idx) => {
      mediaArray.setControl(idx, this.setMediaGroup(item), { emitEvent: false })
    })
  }

  private setMediaGroup({ id, name, status }: MediaItemModel | Partial<MediaItemModel>) {
    return this.fb.group<Partial<MediaItemModel>>({
      id,
      name,
      status,
    })
  }

  private resetControl(id: MediaItemModel['id']) {
    const controlToReset = this.mediaForm.controls.media.controls.find(control => control.get('id')?.value === id)
    const dataToReset = this.dataSource.data.find(x => x.id === id)
    if (dataToReset) {
      return controlToReset?.setValue(
        { id: dataToReset.id, name: dataToReset.name, status: dataToReset.status } as unknown as MediaItemModel,
        {
          emitEvent: false,
        }
      )
    }
  }

  private checkIfChanged(newItem: MediaItemModel, id: string) {
    const oldItem = this.dataSource.data.find(x => x.id === id)
    return (['name', 'status'] as const).every((prop: keyof MediaItemModel) => oldItem?.[prop] === newItem[prop])
  }
}
