import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'

import { EnvConfig } from '@core/env/env-config'
import { EnvironmentLoaderService } from '@core/env/env-loader.service'
import { tap } from 'rxjs'
import { Core } from './core.actions'
import { AwsUser, CognitoService } from '@core/auth/cognito.service'
import { patch } from '@ngxs/store/operators'

export interface CoreModel {
  envConfig: Partial<EnvConfig>
  needCodeConfirm?: AwsUser
  profile?: {
    email: string
  }
}

@State<CoreModel>({
  name: 'core',
  defaults: {
    envConfig: {},
    needCodeConfirm: undefined,
    profile: undefined,
  },
})
@Injectable()
export class CoreState {
  constructor(private envService: EnvironmentLoaderService, private cognitoService: CognitoService) {}

  @Selector([CoreState])
  static getAppConfig(state: CoreModel) {
    return state.envConfig
  }

  @Selector([CoreState])
  static needCodeConfirmation(state: CoreModel) {
    return state.needCodeConfirm
  }

  @Selector([CoreState])
  static getProfile(state: CoreModel) {
    return state.profile
  }

  @Action(Core.LoadAppConfig)
  loadAppConfig({ setState }: StateContext<CoreModel>) {
    return this.envService.loadConfig().pipe(
      tap(envConfig => {
        setState({
          envConfig,
        })
        this.cognitoService.runLoginSequence(envConfig)
        return envConfig
      })
    )
  }

  @Action(Core.SignInUser)
  signInUser(_: StateContext<CoreModel>, action: Core.SignInUser) {
    return this.cognitoService.signIn(action.user)
  }

  @Action(Core.Register)
  async registerUser(_: StateContext<CoreModel>, action: Core.Register) {
    await this.cognitoService.signUp(action.user)
  }

  @Action(Core.SendCode)
  sendCode(_: StateContext<CoreModel>, action: Core.SendCode) {
    return this.cognitoService.confirmSignUp(action.payload)
  }

  @Action(Core.NeedsConfirmation)
  needCodeConfirm({ setState }: StateContext<CoreModel>, action: Core.NeedsConfirmation) {
    setState(
      patch({
        needCodeConfirm: action.user,
      })
    )
  }

  @Action(Core.SetUserProfile)
  async setUserProfile({ setState, getState }: StateContext<CoreModel>) {
    const currentProfile = getState()?.profile
    if (currentProfile) {
      return
    }
    const userProfile = await this.cognitoService.getUser()
    return setState(
      patch({
        profile: {
          email: userProfile?.attributes?.email,
        },
      })
    )
  }

  @Action(Core.DeleteUserProfile)
  deleteUserProfile({ setState }: StateContext<CoreModel>) {
    setState(
      patch({
        profile: undefined,
      })
    )
  }
}
