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
  searchMode: boolean
}

@State<MediaModel>({
  name: 'media',
  defaults: {
    items: undefined,
    total: 0,
    searchMode: false,
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

  @Selector([MediaState])
  static getIsSearchMode(state: MediaModel) {
    return state.searchMode
  }

  @Action(Media.LoadMediaItems)
  loadMediaItems({ setState }: StateContext<MediaModel>, { options }: Media.LoadMediaItems) {
    const params: Record<string, string | number> = {
      limit: options.limit,
    }

    ;(['limit', 'skip', 'order'] as const).forEach(prop => {
      if (options[prop]) {
        params[prop] = options[prop]!
      }
    })

    if (options.order && options.sort) {
      params['sort'] = options.sort
    }

    return this.httpService.get<Paginated<MediaItemModel>>(this.baseUrl, { params }).pipe(
      tap(data =>
        setState(
          patch({
            items: data.items,
            total: data.total,
            searchMode: false,
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

  @Action(Media.RemoveDraftItem)
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

  @Action(Media.Search)
  searchMediaItem({ setState }: StateContext<MediaModel>, action: Media.Search) {
    return this.httpService
      .get<Paginated<MediaItemModel>>(`${this.baseUrl}`, {
        params: {
          q: action.query,
          limit: action.limit,
        },
      })
      .pipe(
        tap(data =>
          setState(
            patch({
              items: data.items,
              total: data.total,
              searchMode: true,
            })
          )
        )
      )
  }
}
