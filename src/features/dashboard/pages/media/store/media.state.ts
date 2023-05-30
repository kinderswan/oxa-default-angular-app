import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CoreState } from '@core/store/core.state'
import { Action, Selector, State, StateContext, Store } from '@ngxs/store'
import { insertItem, patch, removeItem } from '@ngxs/store/operators'
import { tap } from 'rxjs'
import { MediaItemModel, MediaStatus, Paginated } from './media-item.model'
import { Media } from './media.actions'
import { CognitoService } from '@core/auth/cognito.service'

export interface MediaModel {
  items?: MediaItemModel[]
  total: number
}

@State<MediaModel>({
  name: 'media',
  defaults: {
    items: undefined,
    total: 0,
  },
})
@Injectable()
export class MediaState {
  private apiUrl = '/media'
  private baseUrl: string | undefined

  constructor(private store: Store, private httpService: HttpClient) {
    this.baseUrl = `${this.store.selectSnapshot(CoreState.getAppConfig).baseUrl}${this.apiUrl}`
  }

  @Selector([MediaState])
  static getMedia(state: MediaModel) {
    return state.items
  }

  @Selector([MediaState])
  static getMediaTotal(state: MediaModel) {
    return state.total
  }

  @Action(Media.LoadMediaItems)
  loadMediaItems({ setState }: StateContext<MediaModel>, action: Media.LoadMediaItems) {
    return this.httpService
      .get<Paginated<MediaItemModel>>(this.baseUrl!, {
        params: {
          skip: action.skip,
          limit: action.limit,
        },
      })
      .pipe(
        tap(data =>
          setState(
            patch({
              items: data.items,
              total: data.total,
            })
          )
        )
      )
  }

  @Action(Media.SaveMediaItem)
  saveMediaItems(_: StateContext<MediaModel>, action: Media.SaveMediaItem) {
    const currentUser = this.store.selectSnapshot(CoreState.getProfile)
    if (action.item.id === 'null') {
      return this.httpService.post<MediaItemModel>(this.baseUrl!, {
        name: action.item.name,
        status: action.item.status,
        createdBy: currentUser?.email ?? '',
      })
    }
    return this.httpService.put<MediaItemModel>(this.baseUrl!, {
      name: action.item.name,
      status: action.item.status,
      id: action.item.id,
    })
  }

  @Action(Media.RemoveMediaItem)
  removeMediaItem({ setState }: StateContext<MediaModel>, action: Media.RemoveMediaItem) {
    if (action.id === 'null') {
      return setState(
        patch({
          items: removeItem(item => item.id === action?.id),
        })
      )
    }
    return this.httpService.delete(`${this.baseUrl}/${action.id}`)
  }

  @Action(Media.AddMediaItem)
  addMediaItem({ setState, getState }: StateContext<MediaModel>) {
    if (getState().items?.find(x => x.id === 'null')) {
      return
    }
    setState(
      patch({
        items: insertItem(
          {
            id: 'null',
            createdBy: '',
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
