import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'

import { AuthService } from '@core/auth/auth.service'
import { EnvConfig } from '@core/env/env-config'
import { EnvironmentLoaderService } from '@core/env/env-loader.service'
import { tap } from 'rxjs'
import { Core } from './core.actions'

export interface CoreModel {
  envConfig: Partial<EnvConfig>
}

@State<CoreModel>({
  name: 'core',
  defaults: {
    envConfig: {},
  },
})
@Injectable()
export class CoreState {
  constructor(private envService: EnvironmentLoaderService, private authService: AuthService) {}

  @Selector([CoreState])
  static getAppConfig(state: CoreModel) {
    return state.envConfig
  }

  @Action(Core.LoadAppConfig)
  loadAppConfig({ setState }: StateContext<CoreModel>) {
    return this.envService.loadConfig().pipe(
      tap(envConfig => {
        setState({
          envConfig,
        })
        return envConfig
      })
    )
  }
}
