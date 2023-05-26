import { Injectable } from '@angular/core'
import { Selector, State, Store } from '@ngxs/store'

export interface AdminModel {
  admin: AdminModel | null
}

@State<AdminModel>({
  name: 'admin',
  defaults: {
    admin: null,
  },
})
@Injectable()
export class AdminState {
  constructor(private store: Store) {}

  @Selector()
  static getAdmin(state: AdminModel) {
    return state.admin
  }
}
