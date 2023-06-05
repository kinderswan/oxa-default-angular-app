import { SelectionModel } from '@angular/cdk/collections'
import { CommonModule, DatePipe } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
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
import { RxFor } from '@rx-angular/template/for'
import { RxIf } from '@rx-angular/template/if'
import { LetDirective } from '@rx-angular/template/let'
import { PushPipe } from '@rx-angular/template/push'
import { BehaviorSubject, Observable, map, merge, of, switchMap, tap, withLatestFrom } from 'rxjs'

const ejectEditable = <T>(editableProps: (keyof T)[], item: T | Partial<T>) => {
  return editableProps.reduce((acc, prop) => ({ ...acc, ...{ [prop]: item[prop as keyof T] } }), {})
}

export type ColumnConfig<T> = Record<
  keyof T,
  {
    editable: boolean
    cellType: 'checkbox' | 'dropdown' | 'input' | 'date' | 'string'
    headerCellType: 'checkbox' | 'string'
    headerName?: string
    sortable: boolean
    data?: any
    template?: TemplateRef<T>
  }
>

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
    RxFor,
  ],
  templateUrl: './media-table.component.html',
  styleUrls: ['./media-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaTableComponent<T extends { id: string }> implements AfterViewInit, OnChanges {
  paginatedItems$: Observable<T[]>

  editingIdx?: string | null

  dataSource = new MatTableDataSource<T>()

  selection = new SelectionModel<T>(true, [])

  pageSizes = [5, 10, 25, 50, 100]

  tableForm = this.fb.group({
    items: this.fb.array<T>([]),
  })

  displayedColumns: string[] = []

  dataColumns: (keyof T)[] = []

  editableProps: (keyof T)[]

  @Input('items') items$: Observable<T[]>

  @Input('total') total$: Observable<number>

  @Input('searchMode') searchMode$: Observable<boolean>

  @Input('loading') isLoading$: Observable<unknown>

  @Input() columnConfig: ColumnConfig<T>

  @Input() selectable = false

  @ViewChild('paginator') paginator: MatPaginator

  @ViewChild(MatSort) sort: MatSort

  @Output() selectionChange = this.selection.changed.pipe(switchMap(() => of(this.selection.selected)))

  @Output() loadItems = new EventEmitter<{
    skip: number
    limit: number
    sort?: string
    order?: 'asc' | 'desc' | ''
  }>()

  @Output() saveItem = new EventEmitter<T>()

  @Output() removeItem = new EventEmitter<T['id']>()

  @Output() cancelItem = new EventEmitter<void>()

  get currentSort() {
    return this.sortChange$.value
  }

  private sortChange$ = new BehaviorSubject<Sort>({
    active: '',
    direction: '',
  })

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['columnConfig']?.currentValue) {
      this.dataColumns = Object.keys(this.columnConfig) as (keyof T)[]
      this.editableProps = Object.entries(this.columnConfig).reduce(
        (acc, [key, value]) => (value.editable ? [...acc, key as keyof T] : acc),
        [] as (keyof T)[]
      )
    }
    if (changes?.['selectable']?.currentValue) {
      this.displayedColumns = ['select', ...(this.dataColumns as string[]), 'actions']
    } else {
      this.displayedColumns = [...(this.dataColumns as string[]), 'actions']
    }
  }

  ngAfterViewInit(): void {
    this.paginatedItems$ = merge(this.paginator.page, this.sortChange$).pipe(
      withLatestFrom(this.searchMode$),
      tap(([_, searchMode]) => {
        if (!searchMode) {
          this.loadTableItems()
        }
      }),
      switchMap(() => {
        return this.items$.pipe(
          withLatestFrom(this.searchMode$),
          tap(([data, searchMode]) => {
            if (!searchMode && this.paginator.disabled) {
              this.paginator.pageSize = 25
              this.paginator.disabled = false
            }
            this.dataSource = new MatTableDataSource(data)
            this.selection.clear()
            this.setControlsArray(data)
          }),
          map(([data, _]) => data)
        )
      })
    )
  }

  itemAction() {
    this.loadTableItems()
  }

  trackItemsFn(_: number, item: T) {
    return item.id
  }

  onRowEdit(id: string, isEditing: boolean) {
    this.selection.clear()
    const item = this.tableForm.controls.items.getRawValue().find(x => x?.id === id)

    if (isEditing && item && !this.checkIfChanged(item, id)) {
      this.saveItem.emit(item)
    }
    this.editingIdx = isEditing ? null : item?.id
  }

  onRowRemove(id: T['id']) {
    this.removeItem.emit(id)
  }

  onRowCancel(id: T['id']) {
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

  private loadTableItems() {
    this.loadItems.emit(this.getTableState())
  }

  private setControlsArray(data: T[]) {
    const controlsArray = this.tableForm.controls.items as FormArray

    data?.forEach((item, idx) => {
      controlsArray.setControl(idx, this.setControlsGroup(item), { emitEvent: false })
    })
  }

  private setControlsGroup(item: T | Partial<T>) {
    const fieldsToSet = ejectEditable(this.editableProps, item)
    return this.fb.group<Partial<T>>(fieldsToSet)
  }

  private resetControl(id: T['id']) {
    const controlToReset = this.tableForm.controls.items.controls.find(control => control.get('id')?.value === id)
    const dataToReset = this.dataSource.data.find(x => x.id === id)
    if (dataToReset) {
      const fieldsToSet = ejectEditable(this.editableProps, dataToReset)
      return controlToReset?.setValue(fieldsToSet, {
        emitEvent: false,
      })
    }
  }

  private checkIfChanged(newItem: T, id: string) {
    const oldItem = this.dataSource.data.find(x => x.id === id)
    return this.editableProps.every(prop => oldItem?.[prop as keyof T] === newItem[prop as keyof T])
  }
}
