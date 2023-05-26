import { Injectable } from '@angular/core'
import { Selector, State } from '@ngxs/store'

export interface SupportModel {
  support: SupportModel | null
}

@State<SupportModel>({
  name: 'support',
  defaults: {
    support: null,
  },
})
@Injectable()
export class SupportState {
  @Selector()
  static getSupport(state: SupportModel) {
    return state.support
  }
}
