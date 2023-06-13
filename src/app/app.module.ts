import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { APP_INITIALIZER, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { NgxsModule, NoopNgxsExecutionStrategy, Store } from '@ngxs/store'

import { AppRoutingModule } from './app-routing.module'

import { provideAnimations } from '@angular/platform-browser/animations'
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular'
import { CognitoService } from '@core/auth/cognito.service'
import { JwtInterceptor } from '@core/auth/jwt.interceptor'
import { UserInitComponent } from '@core/auth/user-init.component'
import { EnvironmentLoaderService } from '@core/env/env-loader.service'
import { Core } from '@core/store/core.actions'
import { CoreState } from '@core/store/core.state'
import { environment } from '@oxa/environments/environment'
import { RxIf } from '@rx-angular/template/if'
import { lazyServiceFactoryProvider } from '@shared/components/lazy/lazy.service'
import { SharedState } from '@shared/store/shared.state'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    provideAnimations(),
    lazyServiceFactoryProvider({
      'oxa-form-table': () =>
        import('@shared/components/form-table/form-table.component').then(c => c.FormTableComponent),
      'oxa-search-field': () =>
        import('@shared/components/search-field/search-field.component').then(c => c.SearchFieldComponent),
      'oxa-toolbar': () => import('@shared/components/toolbar/toolbar.component').then(c => c.ToolbarComponent),
      'oxa-sidenav': () => import('@shared/components/sidenav/sidenav.component').then(c => c.SidenavComponent),
      'oxa-header': () => import('@shared/components/header/header.component').then(c => c.HeaderComponent),

      'mat-icon': () => import('@angular/material/icon').then(c => c.MatIcon),
      'mat-checkbox': () => import('@angular/material/checkbox').then(c => c.MatCheckbox),
      'mat-toolbar': () => import('@angular/material/toolbar').then(c => c.MatToolbar),
      'mat-progress-bar': () => import('@angular/material/progress-bar').then(c => c.MatProgressBar),
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
