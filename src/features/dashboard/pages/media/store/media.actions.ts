import { MediaItemModel } from './media-item.model'

export namespace Media {
  export class LoadMediaItems {
    static readonly type = '[Media] Load Media Items'
    constructor(
      public options: {
        skip: number
        limit: number
        sort?: string
        order?: 'asc' | 'desc' | ''
      }
    ) {}
  }

  export class AddMediaItem {
    static readonly type = '[Media] Add Media Item'
  }

  export class SaveMediaItem {
    static readonly type = '[Media] Save Media Item'
    constructor(public item: MediaItemModel) {}
  }

  export class RemoveMediaItem {
    static readonly type = '[Media] Remove Media Item'
    constructor(public id?: MediaItemModel['id']) {}
  }

  export class RemoveDraftItem {
    static readonly type = '[Media] Remove Draft Item'
  }

  export class MergeMediaItems {
    static readonly type = '[Media] Merge Media Items'
    constructor(public selectedIds: MediaItemModel['id'][]) {}
  }

  export class Search {
    static readonly type = '[Media] Search Media Items'
    constructor(public query: string, public limit = 100) {}
  }
}
