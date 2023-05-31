import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CoreState } from '@core/store/core.state'
import { Action, Selector, State, StateContext, Store } from '@ngxs/store'
import { insertItem, patch, removeItem } from '@ngxs/store/operators'
import { tap } from 'rxjs'
import { MediaItemModel, MediaStatus, Paginated } from './media-item.model'
import { Media } from './media.actions'

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
  private baseUrl = ''

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
    const params: Record<string, string | number> = {
      limit: action.limit,
    }

    if (action.lastId) {
      params['lastId'] = action.lastId
    }

    if (action.order) {
      params['order'] = action.order
    }

    if (action.sort) {
      params['sort'] = action.sort
    }
    return this.httpService.get<Paginated<MediaItemModel>>(this.baseUrl, { params }).pipe(
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
    const currentUser = this.store.selectSnapshot(CoreState.getCurrentUser)
    if (action.item.id === 'null') {
      return this.httpService.post<MediaItemModel>(this.baseUrl, {
        name: action.item.name,
        status: action.item.status,
        createdBy: currentUser,
      })
    }
    return this.httpService.put<MediaItemModel>(this.baseUrl, {
      name: action.item.name,
      status: action.item.status,
      id: action.item.id,
    })
  }

  @Action(Media.RemoveMediaItem)
  removeMediaItem(_: StateContext<MediaModel>, action: Media.RemoveMediaItem) {
    return this.httpService.delete(`${this.baseUrl}/${action.id}`)
  }

  @Action(Media.RemoveNotAddedMediaItem)
  removeNotAddedMediaItem({ setState }: StateContext<MediaModel>) {
    return setState(
      patch({
        items: removeItem(item => item.id === 'null'),
      })
    )
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

  @Action(Media.MergeMediaItems)
  mergeMediaItems(_: StateContext<MediaModel>, action: Media.MergeMediaItems) {
    return this.httpService.post<{ ids: MediaItemModel['id'][] }>(`${this.baseUrl}/merge`, {
      ids: action.selectedIds,
    })
  }
}
