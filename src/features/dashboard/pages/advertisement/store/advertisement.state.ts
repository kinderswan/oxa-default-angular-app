import { Injectable } from '@angular/core'
import { Selector, State, Store } from '@ngxs/store'

export interface AdvertisementModel {
  advertisement: AdvertisementModel | null
}

@State<AdvertisementModel>({
  name: 'advertisement',
  defaults: {
    advertisement: null,
  },
})
@Injectable()
export class AdvertisementState {
  constructor(private store: Store) {}

  @Selector()
  static getAdvertisement(state: AdvertisementModel) {
    return state.advertisement
  }
}
