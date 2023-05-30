import { Injectable } from '@angular/core'
import { CognitoService } from '@core/auth/cognito.service'
import { CoreState } from '@core/store/core.state'
import { Action, Selector, State } from '@ngxs/store'
import { Profile } from './profile.actions'
import { UserProfileModel } from './user-profile.model'

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
  constructor(private cognitoService: CognitoService) {}

  @Action(Profile.Logout)
  logout() {
    this.cognitoService.signOut()
  }
}
