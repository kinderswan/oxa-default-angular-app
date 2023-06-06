import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MediaItemModel, MediaStatus } from '@dashboard/media/store/media-item.model'
import { Media } from '@dashboard/media/store/media.actions'
import { MediaState } from '@dashboard/media/store/media.state'
import { Actions, Select, Store, ofActionDispatched, ofActionSuccessful } from '@ngxs/store'
import { RxIf } from '@rx-angular/template/if'
import { LetDirective } from '@rx-angular/template/let'
import {
  BaseFormTable,
  ColumnConfig,
  FormTableComponent,
  FormTableSelectionConfig,
  FormTableState,
} from '@shared/components/form-table/form-table.component'
import { SearchFieldComponent } from '@shared/components/search-field/search-field.component'
import { Observable, tap } from 'rxjs'

@Component({
  selector: 'oxa-media-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormTableComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RxIf,
    LetDirective,
    SearchFieldComponent,
  ],
  templateUrl: './media-wrapper.component.html',
  styleUrls: ['./media-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaWrapperComponent {
  @Select(MediaState.getMedia) items$: Observable<MediaItemModel[]>

  @Select(MediaState.getMediaTotal) total$: Observable<number>

  @Select(MediaState.getIsSearchMode) searchMode$: Observable<boolean>

  @ViewChild(FormTableComponent, { static: true }) tableComponent: BaseFormTable<MediaItemModel>

  @ViewChild(SearchFieldComponent, { static: true }) searchField: SearchFieldComponent

  selectedItems: MediaItemModel[] = []

  columnsConfig: ColumnConfig<MediaItemModel> = {
    id: {
      editable: true,
      cellType: 'string',
      headerCellType: 'string',
      headerName: 'Id',
      sortable: true,
    },
    name: {
      editable: true,
      cellType: 'input',
      headerCellType: 'string',
      headerName: 'Name',
      sortable: true,
    },
    status: {
      editable: true,
      cellType: 'dropdown',
      headerCellType: 'string',
      headerName: 'Status',
      sortable: true,
      data: Object.values(MediaStatus),
    },
    createdBy: {
      editable: false,
      cellType: 'string',
      headerCellType: 'string',
      headerName: 'Created By',
      sortable: true,
    },
    lastUpdated: {
      editable: false,
      cellType: 'date',
      headerCellType: 'string',
      headerName: 'Last Updated',
      sortable: true,
    },
  }

  isLoading$ = this.actions.pipe(
    ofActionDispatched(
      Media.MergeMediaItems,
      Media.SaveMediaItem,
      Media.RemoveMediaItem,
      Media.Search,
      Media.LoadMediaItems
    )
  )

  tableForm = this.fb.group({
    items: this.fb.array<MediaItemModel>([]),
  })

  currentRow: string | null | undefined

  selectionConfig: FormTableSelectionConfig = {
    active: false,
    isDisabledFn: () => !!this.currentRow,
  }

  tableItems$: Observable<MediaItemModel[]>

  allowEditFn = (id?: MediaItemModel['id']) => this.currentRow === id || id === 'null'

  private rawItems: MediaItemModel[]

  constructor(private store: Store, private actions: Actions, private fb: FormBuilder) {
    this.tableItems$ = this.items$.pipe(
      tap(data => {
        this.rawItems = data && [...data]
        if (this.tableForm) {
          this.setControlsArray(data)
        }
      })
    )

    this.actions.pipe(ofActionSuccessful(Media.LoadMediaItems), takeUntilDestroyed()).subscribe(() => {
      this.searchField.reset()
    })

    this.actions
      .pipe(ofActionSuccessful(Media.SaveMediaItem, Media.RemoveMediaItem, Media.MergeMediaItems), takeUntilDestroyed())
      .subscribe(() => this.loadTableData(this.tableComponent.tableState))

    this.actions
      .pipe(ofActionSuccessful(Media.AddMediaItem), takeUntilDestroyed())
      .subscribe(() => (this.currentRow = 'null'))

    this.actions.pipe(ofActionSuccessful(Media.Search), takeUntilDestroyed()).subscribe(() => {
      this.tableComponent.tableState = {
        pageDisabled: true,
        pageIndex: 0,
        pageSize: 100,
        sortActive: '',
        sortDirection: '',
      }
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

  loadTableData($event: FormTableState) {
    if (this.searchField.value) {
      this.store.dispatch(new Media.Search(this.searchField.value))
    } else {
      const paginationConfig = {
        skip: $event.pageIndex * $event.pageSize,
        limit: $event.pageSize,
        sort: $event.sortActive,
        order: $event.sortDirection,
      }
      this.store.dispatch(new Media.LoadMediaItems(paginationConfig))
    }
  }

  onRemoveItem(id: string) {
    this.store.dispatch(new Media.RemoveMediaItem(id))
  }

  onRowEdit(id: string, isEditing: boolean) {
    this.tableComponent.selection.clear()
    const item = this.tableForm.controls.items.getRawValue().find(x => x?.id === id)

    if (isEditing && item && !this.checkIfChanged(item, id)) {
      this.store.dispatch(new Media.SaveMediaItem(item))
    }
    this.currentRow = isEditing ? null : item?.id
  }

  onRowRemove(id: MediaItemModel['id']) {
    this.store.dispatch(new Media.RemoveMediaItem(id))
  }

  onRowCancel(id: MediaItemModel['id']) {
    this.currentRow = null
    if (id === 'null') {
      return this.store.dispatch(new Media.RemoveDraftItem())
    }
    return this.resetControl(id)
  }

  onSearchChange($event: string) {
    if ($event) {
      this.store.dispatch(new Media.Search($event))
    } else {
      this.store.dispatch(
        new Media.LoadMediaItems({
          skip: 0,
          limit: 25,
        })
      )
    }
  }

  private resetControl(id: MediaItemModel['id']) {
    const controlToReset = this.tableForm.controls.items.controls.find(control => control.get('id')?.value === id)
    const dataToReset = this.rawItems.find(x => x.id === id)
    if (dataToReset) {
      return controlToReset?.setValue(
        {
          id: dataToReset['id'],
          name: dataToReset['name'],
          status: dataToReset['status'],
        } as any,
        {
          emitEvent: false,
        }
      )
    }
  }

  private checkIfChanged(newItem: MediaItemModel, id: string) {
    const oldItem = this.rawItems.find(x => x.id === id)
    return ['name', 'status'].every(
      prop => oldItem?.[prop as keyof MediaItemModel] === newItem[prop as keyof MediaItemModel]
    )
  }

  private setControlsArray(data: MediaItemModel[]) {
    const controlsArray = this.tableForm.controls.items as FormArray

    data?.forEach((item, idx) => {
      controlsArray.setControl(idx, this.setControlsGroup(item), { emitEvent: false })
    })
  }

  private setControlsGroup(item: MediaItemModel | Partial<MediaItemModel>) {
    const fieldsToSet = Object.entries(this.columnsConfig).reduce(
      (acc, [key, value]) => (value.editable ? { ...acc, [key]: item[key as keyof MediaItemModel] } : acc),
      {} as { [P in keyof MediaItemModel]: MediaItemModel[P] }
    )

    return this.fb.group<Partial<MediaItemModel>>(fieldsToSet)
  }
}
