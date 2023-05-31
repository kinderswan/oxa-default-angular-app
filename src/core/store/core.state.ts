import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'

import { CognitoService } from '@core/auth/cognito.service'
import { EnvConfig } from '@core/env/env-config'
import { EnvironmentLoaderService } from '@core/env/env-loader.service'
import { tap } from 'rxjs'
import { Core } from './core.actions'
import { patch } from '@ngxs/store/operators'

export interface CoreModel {
  envConfig: Partial<EnvConfig>
  user?: string
}

@State<CoreModel>({
  name: 'core',
  defaults: {
    envConfig: {},
    user: undefined,
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
  static getCurrentUser(state: CoreModel) {
    return state.user
  }

  @Action(Core.LoadAppConfig)
  loadAppConfig({ setState }: StateContext<CoreModel>) {
    return this.envService.loadConfig().pipe(
      tap(envConfig => {
        setState(
          patch({
            envConfig,
          })
        )
        this.cognitoService.runLoginSequence(envConfig)
        return envConfig
      })
    )
  }

  @Action(Core.SetCurrentUser)
  setCurrentUser({ setState }: StateContext<CoreModel>, action: Core.SetCurrentUser) {
    return setState(
      patch({
        user: action.user,
      })
    )
  }

  @Action(Core.Logout)
  logout() {
    return this.cognitoService.signOut()
  }
}
