import { SelectionModel } from '@angular/cdk/collections'
import { DatePipe, NgFor, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common'
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
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms'
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
import { BehaviorSubject, Observable, filter, map, merge, of, switchMap, tap, withLatestFrom } from 'rxjs'

export type ColumnConfig<T extends { id: string }> = Record<
  keyof T,
  {
    editable: boolean
    cellType: 'checkbox' | 'dropdown' | 'input' | 'date' | 'string'
    headerCellType: 'checkbox' | 'string'
    headerName?: string
    sortable: boolean
    data?: any
    template?: TemplateRef<T>
    allowEditFn?: (id?: T['id']) => boolean
  }
>

export type FormTableState = {
  pageIndex: number
  pageSize: number
  pageDisabled: boolean
  sortActive: string
  sortDirection: 'asc' | 'desc' | ''
}

export type FormTableSelectionConfig = {
  active: boolean
  isDisabledFn: (...args: any[]) => boolean
}

export interface BaseFormTable<T extends { id: string }> {
  selection: SelectionModel<T>
  get tableState(): FormTableState
  set tableState(value: FormTableState)
}

@Component({
  selector: 'oxa-form-table',
  standalone: true,
  imports: [
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
    NgSwitch,
    NgSwitchCase,
    NgTemplateOutlet,
    NgFor,
  ],
  templateUrl: './form-table.component.html',
  styleUrls: ['./form-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useClass: FormGroupDirective,
    },
  ],
})
export class FormTableComponent<T extends { id: string }> implements AfterViewInit, OnChanges, BaseFormTable<T> {
  paginatedItems$: Observable<T[]>

  tableData$: Observable<{
    items: T[]
    searchMode: boolean
  }>

  dataSource = new MatTableDataSource<T>()

  selection = new SelectionModel<T>(true, [])

  displayedColumns: string[] = []

  dataColumns: (keyof T)[] = []

  get currentSort() {
    return this.sortChange$.value
  }

  get tableState(): FormTableState {
    return {
      pageDisabled: this.paginator.disabled,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      sortActive: this.sort?.active ?? '',
      sortDirection: this.sort?.direction ?? '',
    }
  }

  set tableState({ pageIndex, pageSize, pageDisabled, sortActive, sortDirection }: FormTableState) {
    this.paginator.pageIndex = pageIndex
    this.paginator.pageSize = pageSize
    this.paginator.disabled = pageDisabled
    this.sortChange$.next({
      active: sortActive,
      direction: sortDirection,
    })
  }

  private sortChange$ = new BehaviorSubject<Sort>({
    active: '',
    direction: '',
  })

  @Input('items') items$: Observable<T[]>

  @Input('total') total$: Observable<number>

  @Input('searchMode') searchMode$: Observable<boolean>

  @Input('loading') isLoading$: Observable<unknown>

  @Input() pageSizes = [5, 10, 25, 50, 100]

  @Input() columnConfig: ColumnConfig<T>

  @Input() selectionConfig: FormTableSelectionConfig

  @Input() actionTemplate: TemplateRef<any>

  @Input() tableForm: FormGroup<{
    items: FormArray<FormControl<T | null>>
  }>

  @Input() allowEditFn?: (id?: T['id']) => boolean = () => true

  @Output() selectionChange = this.selection.changed.pipe(switchMap(() => of(this.selection.selected)))

  @Output() tableStateChange = new EventEmitter<FormTableState>()

  @ViewChild('paginator') paginator: MatPaginator

  @ViewChild(MatSort) sort: MatSort

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['columnConfig']?.currentValue) {
      this.dataColumns = Object.keys(this.columnConfig) as (keyof T)[]
      this.displayedColumns = [...(this.dataColumns as string[])]
    }
    if (changes?.['selectionConfig']?.currentValue?.active) {
      this.displayedColumns.unshift('select')
    }

    if (changes?.['actionTemplate']?.currentValue) {
      this.displayedColumns.push('actions')
    }
  }

  ngAfterViewInit(): void {
    this.paginatedItems$ = merge(this.paginator.page, this.sortChange$).pipe(
      tap(() => {
        if (!this.paginator.disabled) {
          this.tableStateChange.emit(this.tableState)
        }
      }),
      switchMap(() => {
        return this.items$.pipe(
          withLatestFrom(this.searchMode$ ?? of(false)),
          tap(([data, searchMode]) => {
            if (!searchMode && this.paginator.disabled) {
              this.paginator.pageSize = 25
              this.paginator.disabled = false
            }
            this.dataSource = new MatTableDataSource(data)
            this.selection.clear()
          }),
          map(([data, _]) => data)
        )
      })
    )

    this.tableData$ = this.paginatedItems$.pipe(
      filter(Boolean),
      switchMap(items =>
        (this.searchMode$ ?? of(false)).pipe(
          map(searchMode => ({
            items,
            searchMode,
          }))
        )
      )
    )
  }

  trackItemsFn(_: number, item: T) {
    return item.id
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
}
