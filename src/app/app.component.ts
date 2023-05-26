import { HttpClientModule } from '@angular/common/http'
import { APP_INITIALIZER, ChangeDetectionStrategy, Component, ErrorHandler } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { CoreState } from '@core/store/core.state'
import { environment } from '@oxa/environments/environment'
import { SharedState } from '@shared/store/shared.state'
import { AppRoutingModule } from './app-routing.module'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxsModule, NoopNgxsExecutionStrategy, Store } from '@ngxs/store'
import { AuthService } from '@core/auth/auth.service'
import { EnvironmentLoaderService } from '@core/env/env-loader.service'
import { GlobalErrorHandler } from '@core/error-handler/global-error-handler'
import { Core } from '@core/store/core.actions'

const imports = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule,
  AppRoutingModule,
  NgxsModule.forRoot([CoreState, SharedState], {
    executionStrategy: NoopNgxsExecutionStrategy,
    compatibility: {
      strictContentSecurityPolicy: true,
    },
    developmentMode: !environment.production,
    selectorOptions: {
      injectContainerState: false,
      suppressErrors: environment.production,
    },
  }),
  HttpClientModule,
]

const devImports = [...imports, NgxsStoragePluginModule.forRoot({})]

@Component({
  selector: 'oxa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [environment.production ? imports : devImports],
  providers: [
    EnvironmentLoaderService,
    AuthService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (store: Store) => () => {
        store.dispatch(new Core.LoadAppConfig())
      },
      deps: [Store],
      multi: true,
    },
  ],
})
export class AppComponent {}
