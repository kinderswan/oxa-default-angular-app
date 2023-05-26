import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext, Store } from '@ngxs/store'
import { Media } from './media.actions'
import { HttpClient } from '@angular/common/http'
import { MediaItemModel, MediaStatus } from './media-item.model'
import { of, tap } from 'rxjs'
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators'

export interface MediaModel {
  items: MediaItemModel[]
}

const mediaItemsStub: MediaItemModel[] = [
  {
    id: '9340',
    createdBy: {
      email: 'testuser@gmail.com',
      name: 'Test User',
    },
    name: 'FORECAST FEATURE DELIVERED',
    lastUpdated: new Date(2022, 11, 12, 12, 12),
    status: MediaStatus.COMPLETED,
  },
  {
    id: '9341',
    createdBy: {
      email: 'testuser@gmail.com',
      name: 'Test User',
    },
    name: 'FORECAST FEATURE DELIVERED 2',
    lastUpdated: new Date(2022, 11, 12, 12, 12),
    status: MediaStatus.DELIVERING,
  },
]

@State<MediaModel>({
  name: 'media',
  defaults: {
    items: [],
  },
})
@Injectable()
export class MediaState {
  constructor(private store: Store, private httpService: HttpClient) {}

  @Selector([MediaState])
  static getMedia(state: MediaModel) {
    return state.items
  }

  @Action(Media.LoadMediaItems)
  loadMediaItems({ setState }: StateContext<MediaModel>) {
    return of(mediaItemsStub).pipe(
      tap(items =>
        setState(
          patch({
            items,
          })
        )
      )
    )
  }

  @Action(Media.SaveMediaItem)
  saveMediaItems({ setState }: StateContext<MediaModel>, action: Media.SaveMediaItem) {
    setState(
      patch({
        items: updateItem(
          item => item.id === action.item?.id,
          patch({ name: action.item.name, status: action.item.status })
        ),
      })
    )
  }

  @Action(Media.RemoveMediaItem)
  removeMediaItem({ setState }: StateContext<MediaModel>, action: Media.RemoveMediaItem) {
    setState(
      patch({
        items: removeItem(item => item.id === action?.id),
      })
    )
  }

  @Action(Media.AddMediaItem)
  addMediaItem({ setState }: StateContext<MediaModel>) {
    setState(
      patch({
        items: insertItem(
          {
            id: (Date.now() % 10000).toString(),
            createdBy: {
              email: '',
              name: '',
            },
            name: '',
            lastUpdated: Date.now(),
            status: MediaStatus.DRAFT,
          },
          0
        ),
      })
    )
  }
}
