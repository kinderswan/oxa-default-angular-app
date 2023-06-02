import { SelectionModel } from '@angular/cdk/collections'
import { CommonModule, DatePipe } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
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
import { RxIf } from '@rx-angular/template/if'
import { LetDirective } from '@rx-angular/template/let'
import { PushPipe } from '@rx-angular/template/push'
import { BehaviorSubject, Observable, merge, of, switchMap, tap, withLatestFrom } from 'rxjs'
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
  mediaItems$: Observable<MediaItemModel[]>

  displayedColumns = ['select', 'id', 'name', 'status', 'createdBy', 'lastUpdated', 'actions']

  editingIdx?: string | null

  dataSource = new MatTableDataSource<MediaItemModel>()

  selection = new SelectionModel<MediaItemModel>(true, [])

  mediaStatuses = Object.values(MediaStatus)

  pageSizes = [5, 10, 25, 50, 100]

  mediaForm = this.fb.group({
    media: this.fb.array<MediaItemModel>([]),
  })

  @Input('items') items$: Observable<MediaItemModel[]>

  @Input('total') total$: Observable<number>

  @Input('searchMode') searchMode$: Observable<boolean>

  @Input('loading') isLoading$: Observable<unknown>

  @ViewChild('paginator') paginator: MatPaginator

  @ViewChild(MatSort) sort: MatSort

  @Output() selectionChange = this.selection.changed.pipe(switchMap(() => of(this.selection.selected)))

  @Output() loadItems = new EventEmitter<{
    skip: number
    limit: number
    sort?: string
    order?: 'asc' | 'desc' | ''
  }>()

  @Output() saveItem = new EventEmitter<MediaItemModel>()

  @Output() removeItem = new EventEmitter<MediaItemModel['id']>()

  @Output() cancelItem = new EventEmitter<void>()

  get currentSort() {
    return this.sortChange$.value
  }

  private sortChange$ = new BehaviorSubject<Sort>({
    active: '',
    direction: '',
  })

  constructor(private fb: FormBuilder) {}

  ngAfterViewInit(): void {
    this.mediaItems$ = merge(this.paginator.page, this.sortChange$).pipe(
      withLatestFrom(this.searchMode$),
      tap(([_, searchMode]) => {
        if (!searchMode) {
          this.loadMediaItems()
        }
      }),
      switchMap(([_, searchMode]) => {
        return this.items$.pipe(
          tap(data => {
            if (!searchMode && this.paginator.disabled) {
              this.paginator.pageSize = 25
              this.paginator.disabled = false
            }
            this.dataSource = new MatTableDataSource(data)
            this.selection.clear()
            this.setMediaFormArray(data)
          })
        )
      })
    )
  }

  itemAction() {
    this.loadMediaItems()
  }

  trackMedia(_: number, item: MediaItemModel) {
    return item.id
  }

  onRowEdit(id: string, isEditing: boolean) {
    this.selection.clear()
    const item = this.mediaForm.controls.media.getRawValue().find(x => x?.id === id)

    if (isEditing && item && !this.checkIfChanged(item, id)) {
      this.saveItem.emit(item)
    }
    this.editingIdx = isEditing ? null : item?.id
  }

  onRowRemove(id: MediaItemModel['id']) {
    this.removeItem.emit(id)
  }

  onRowCancel(id: MediaItemModel['id']) {
    this.editingIdx = null
    if (id === 'null') {
      return this.cancelItem.emit()
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

  resetEditingIndex(): void {
    this.editingIdx = 'null'
  }

  resetTableState() {
    this.paginator.pageIndex = 0
    this.paginator.pageSize = 100
    this.paginator.disabled = true
    this.sortChange$.next({
      active: '',
      direction: '',
    })
  }

  getTableState() {
    return {
      skip: this.paginator.pageIndex * this.paginator.pageSize,
      limit: this.paginator.pageSize,
      sort: this.currentSort.active,
      order: this.currentSort.direction,
    }
  }

  private loadMediaItems() {
    this.loadItems.emit(this.getTableState())
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
