import { Injectable } from '@angular/core'
import { Selector, State, Store } from '@ngxs/store'

export interface CoachModel {
  coach: CoachModel | null
}

@State<CoachModel>({
  name: 'coach',
  defaults: {
    coach: null,
  },
})
@Injectable()
export class CoachState {
  constructor(private store: Store) {}

  @Selector()
  static getCoach(state: CoachModel) {
    return state.coach
  }
}
