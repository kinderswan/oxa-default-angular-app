import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { MediaItemModel, MediaStatus } from '@dashboard/media/store/media-item.model'
import { Observable, map, tap } from 'rxjs'
import { RxCommonModule } from '@shared/rx-common.module'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { Actions, Store, ofActionSuccessful } from '@ngxs/store'
import { Media } from '@dashboard/media/store/media.actions'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatSelectModule } from '@angular/material/select'

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
  ],
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaListComponent implements OnInit {
  @Input('items') items$: Observable<MediaItemModel[]>

  mediaItems$: Observable<MediaItemModel[]>

  displayedColumns = ['id', 'name', 'status', 'createdBy', 'lastUpdated', 'actions']

  editingIdx?: string | null

  @ViewChild('paginator') paginator: MatPaginator

  dataSource: MatTableDataSource<MediaItemModel>

  mediaStatuses = Object.values(MediaStatus)

  constructor(private fb: FormBuilder, private store: Store, private actions: Actions) {
    this.actions.pipe(ofActionSuccessful(Media.SaveMediaItem)).pipe(takeUntilDestroyed()).subscribe(console.log)
  }

  ngOnInit(): void {
    this.mediaItems$ = this.items$.pipe(
      tap(data => {
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator
      }),
      tap(data => this.setMediaFormArray(data))
    )
  }

  mediaForm = this.fb.group({
    media: this.fb.array<MediaItemModel>([]),
  })

  onRowEdit(id: string, isEditing: boolean) {
    const item = this.mediaForm.controls.media.getRawValue().find(x => x?.id === id)

    if (isEditing && item) {
      this.store.dispatch(new Media.SaveMediaItem(item))
    }
    this.editingIdx = isEditing ? null : item?.id
  }

  onRowRemove(id: MediaItemModel['id']) {
    this.store.dispatch(new Media.RemoveMediaItem(id))
  }

  onPaginatorChange($event: PageEvent) {}

  getDataSource(items: MediaItemModel[]) {
    const dataSource = new MatTableDataSource(items)
    // dataSource.paginator = this.paginator
    return dataSource
  }

  private setMediaFormArray(data: MediaItemModel[]) {
    console.log(data)
    const mediaArray = this.mediaForm.controls.media as FormArray

    data.forEach((item, idx) => {
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
