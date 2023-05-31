import { HttpClientModule } from '@angular/common/http'
import { APP_INITIALIZER, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxsModule, NoopNgxsExecutionStrategy, Store } from '@ngxs/store'

import { AppRoutingModule } from './app-routing.module'

import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular'
import { CognitoService } from '@core/auth/cognito.service'
import { EnvironmentLoaderService } from '@core/env/env-loader.service'
import { Core } from '@core/store/core.actions'
import { CoreState } from '@core/store/core.state'
import { environment } from '@oxa/environments/environment'
import { SharedState } from '@shared/store/shared.state'
import { AppComponent } from './app.component'
import { UserInitComponent } from '@core/auth/user-init.component'
import { RxIf } from '@rx-angular/template/if'

@NgModule({
  declarations: [AppComponent],
  imports: [
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
    AmplifyAuthenticatorModule,
    UserInitComponent,
    RxIf,
  ],
  providers: [
    EnvironmentLoaderService,
    CognitoService,
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
