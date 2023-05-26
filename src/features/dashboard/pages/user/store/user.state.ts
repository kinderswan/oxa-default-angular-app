import { Injectable } from '@angular/core'
import { Selector, State, Store } from '@ngxs/store'

export interface UserModel {
  user: UserModel | null
}

@State<UserModel>({
  name: 'user',
  defaults: {
    user: null,
  },
})
@Injectable()
export class UserState {
  constructor(private store: Store) {}

  @Selector()
  static getUser(state: UserModel) {
    return state.user
  }
}
