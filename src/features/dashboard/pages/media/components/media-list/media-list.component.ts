import { CommonModule, DatePipe } from '@angular/common'
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MediaItemModel, MediaStatus } from '@dashboard/media/store/media-item.model'
import { Media } from '@dashboard/media/store/media.actions'
import { MediaState } from '@dashboard/media/store/media.state'
import { Actions, Select, Store, ofActionSuccessful } from '@ngxs/store'
import { RxCommonModule } from '@shared/rx-common.module'
import { Observable, Subject, delay, startWith, switchMap, tap } from 'rxjs'

@Component({
  selector: 'oxa-media-list',
  standalone: true,
  imports: [
    CommonModule,
    RxCommonModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    DatePipe,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaListComponent implements AfterViewInit {
  @Select(MediaState.getMedia) items$: Observable<MediaItemModel[]>

  @Select(MediaState.getMediaTotal) total$: Observable<number>

  @ViewChild('paginator') paginator: MatPaginator

  mediaItems$: Observable<MediaItemModel[]>

  suspenseTrigger$ = new Subject<void>()

  displayedColumns = ['id', 'name', 'status', 'createdBy', 'lastUpdated', 'actions']

  editingIdx?: string | null

  dataSource = new MatTableDataSource<MediaItemModel>()

  mediaStatuses = Object.values(MediaStatus)

  pageSizes = [5, 10, 25, 50, 100]

  mediaForm = this.fb.group({
    media: this.fb.array<MediaItemModel>([]),
  })

  constructor(private fb: FormBuilder, private store: Store, private actions: Actions) {
    this.actions
      .pipe(ofActionSuccessful(Media.SaveMediaItem, Media.RemoveMediaItem))
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.loadMediaItems(this.paginator.pageIndex, this.paginator.pageSize))

    this.actions
      .pipe(ofActionSuccessful(Media.AddMediaItem))
      .pipe(takeUntilDestroyed())
      .subscribe(() => (this.editingIdx = 'null'))
  }

  ngAfterViewInit(): void {
    this.mediaItems$ = this.paginator.page.pipe(
      startWith({}),
      tap(() => this.suspenseTrigger$.next()),
      tap(() => this.loadMediaItems(this.paginator.pageIndex, this.paginator.pageSize)),
      switchMap(() => {
        return this.items$
      }),
      tap(data => {
        this.dataSource = new MatTableDataSource(data)
        this.setMediaFormArray(data)
      })
    )
  }

  trackMedia(_: number, item: MediaItemModel) {
    return item.id
  }

  onRowEdit(id: string, isEditing: boolean) {
    const item = this.mediaForm.controls.media.getRawValue().find(x => x?.id === id)

    if (isEditing && item) {
      this.suspenseTrigger$.next()
      this.store.dispatch(new Media.SaveMediaItem(item))
    }
    this.editingIdx = isEditing ? null : item?.id
  }

  onRowRemove(id: MediaItemModel['id']) {
    this.suspenseTrigger$.next()
    this.store.dispatch(new Media.RemoveMediaItem(id))
  }

  onRowCancel(id: MediaItemModel['id']) {
    this.editingIdx = null
    if (id === 'null') {
      return this.store.dispatch(new Media.RemoveMediaItem(id))
    }

    const controlToReset = this.mediaForm.controls.media.controls.find(control => control.get('id')?.value === id)
    const dataToReset = this.dataSource.data.find(x => x.id === id)
    return controlToReset?.setValue(
      {
        id: dataToReset?.id ?? 'null',
        name: dataToReset?.name ?? '',
        status: dataToReset?.status ?? MediaStatus.DRAFT,
      } as any,
      { emitEvent: false }
    )
  }

  private loadMediaItems(pageNumber: number, pageSize: number) {
    this.store.dispatch(new Media.LoadMediaItems(pageNumber * pageSize, pageSize))
  }

  private setMediaFormArray(data: MediaItemModel[]) {
    const mediaArray = this.mediaForm.controls.media as FormArray

    data?.forEach((item, idx) => {
      mediaArray.setControl(idx, this.setMediaGroup(item), { emitEvent: false })
    })
  }

  private setMediaGroup({ id, name, status }: MediaItemModel) {
    return this.fb.group<Partial<MediaItemModel>>({
      id,
      name,
      status,
    })
  }
}
