import { Injectable } from '@angular/core'
import { AuthService } from '@core/auth/auth.service'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { patch } from '@ngxs/store/operators'
import { from, tap } from 'rxjs'
import { UserProfileModel } from './user-profile.model'
import { Profile } from './profile.actions'
import { ProfileService } from '../services/profile.service'

export interface ProfileModel {
  profile?: UserProfileModel
}

@State<ProfileModel>({
  name: 'profile',
  defaults: {
    profile: undefined,
  },
})
@Injectable()
export class ProfileState {
  constructor(private authService: AuthService, private profileService: ProfileService) {}

  @Selector([ProfileState])
  static getProfile(state: ProfileModel) {
    return state.profile
  }

  @Action(Profile.Logout)
  logout() {
    this.authService.logout()
  }

  @Action(Profile.LoadUserProfile)
  loadAdminProfile({ setState, getState }: StateContext<ProfileModel>) {
    const currentProfile = getState()?.profile
    if (currentProfile) {
      return
    }
    return from(this.profileService.loadAdminProfile()).pipe(
      tap(profile =>
        setState(
          patch({
            profile,
          })
        )
      )
    )
  }
}
