import { MediaItemModel } from './media-item.model'

export namespace Media {
  export class LoadMediaItems {
    static readonly type = '[Media] Load Media Items'
    constructor(
      public lastId: string,
      public limit: number,
      public sort?: string,
      public order?: 'asc' | 'desc' | ''
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

  export class RemoveNotAddedMediaItem {
    static readonly type = '[Media] Remove New Media Item'
  }

  export class MergeMediaItems {
    static readonly type = '[Media] Merge Media Items'
    constructor(public selectedIds: MediaItemModel['id'][]) {}
  }
}
