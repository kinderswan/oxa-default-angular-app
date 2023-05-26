import { HttpClientModule } from '@angular/common/http'
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxsModule, NoopNgxsExecutionStrategy, Store } from '@ngxs/store'

import { AppRoutingModule } from './app-routing.module'

import { AuthService } from '@core/auth/auth.service'
import { EnvironmentLoaderService } from '@core/env/env-loader.service'
import { GlobalErrorHandler } from '@core/error-handler/global-error-handler'
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin'
import { SharedState } from '@shared/store/shared.state'
import { AppComponent } from './app.component'
import { environment } from '@oxa/environments/environment'
import { CoreState } from '@core/store/core.state'
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

@NgModule({
  declarations: [AppComponent],
  imports: environment.production ? imports : devImports,
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
  bootstrap: [AppComponent],
})
export class AppModule {}
