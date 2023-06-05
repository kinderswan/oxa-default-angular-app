import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Auth } from 'aws-amplify'
import { catchError, from, switchMap, throwError } from 'rxjs'
import { CognitoService } from './cognito.service'

type CognitoUserSession = ReturnType<typeof Auth.currentSession> extends Promise<infer T> ? T : never

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private cognito: CognitoService, private router: Router) {}
  intercept<T>(request: HttpRequest<T>, next: HttpHandler): any {
    if (request.url.endsWith('app-config.json')) {
      return next.handle(request)
    }
    return from(Auth.currentSession()).pipe(
      switchMap((auth: CognitoUserSession) => {
        const jwt: string = auth.getIdToken().getJwtToken()
        const authRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        return next.handle(authRequest)
      }),
      // eslint-disable-next-line rxjs/no-implicit-any-catch, @typescript-eslint/no-explicit-any
      catchError((err: any) => {
        if (err.status === 401) {
          return this.cognito.signOut()
        }
        const error = err?.error?.errorMessage || err?.statusText
        return throwError(() => new Error(error))
      })
    )
  }
}
