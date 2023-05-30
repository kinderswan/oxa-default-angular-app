import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, filter } from 'rxjs'
import { Auth, Amplify } from 'aws-amplify'
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router'
import { Store } from '@ngxs/store'
import { Core } from '@core/store/core.actions'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

export interface AwsUser {
  email: string
  password: string
  showPassword: boolean
  code: string
  name: string
}

export const canActivateAuth: CanActivateFn = (_, route: RouterStateSnapshot) => {
  return inject(CognitoService).canActivate(route)
}

const makeGuard = (route: RouterStateSnapshot, router: Router) => {
  return (isAuthenticated: boolean) => {
    if (!isAuthenticated && route.url.startsWith('/login')) {
      return true
    }
    if (!isAuthenticated && !route.url.startsWith('/login')) {
      return router.navigate(['./login'])
    }
    if (isAuthenticated && route.url.startsWith('/login')) {
      return router.navigate(['./dashboard'])
    }
    return isAuthenticated
  }
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  private authenticationSubject: BehaviorSubject<boolean>

  constructor(private router: Router, private store: Store) {
    this.authenticationSubject = new BehaviorSubject<boolean>(false)
  }

  runLoginSequence(config: { cognito: unknown }) {
    Amplify.configure({
      Auth: config.cognito,
    })
    this.store.dispatch(new Core.SetUserProfile())
  }

  async signUp(user: AwsUser) {
    try {
      return await Auth.signUp({
        username: user.email,
        password: user.password,
      })
    } catch (message) {
      return this.doNeedConfirmation(message as any, user)
    }
  }

  confirmSignUp(user: AwsUser) {
    return Auth.confirmSignUp(user.email, `${user.code}`)
  }

  async signIn(user: AwsUser) {
    try {
      await Auth.signIn(user.email, user.password)
      this.authenticationSubject.next(true)
      return this.router.navigate(['/'])
    } catch (message) {
      return this.doNeedConfirmation(message as any, user)
    }
  }

  async signOut() {
    await Auth.signOut()
    this.authenticationSubject.next(false)
    this.store.dispatch(new Core.DeleteUserProfile())
    this.router.navigateByUrl('/', { skipLocationChange: true, state: {} })
  }

  isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true)
    } else {
      return this.getUser()
        .then((user: AwsUser) => {
          if (user) {
            return true
          } else {
            return false
          }
        })
        .catch(() => {
          return false
        })
    }
  }

  getUser(): Promise<any> {
    return Auth.currentUserInfo()
  }

  async updateUser(user: AwsUser): Promise<string> {
    const cognitoUser = await Auth.currentUserPoolUser()
    return await Auth.updateUserAttributes(cognitoUser, user)
  }

  async canActivate(route: RouterStateSnapshot) {
    return this.isAuthenticated().then(makeGuard(route, this.router))
  }

  private doNeedConfirmation(message: any, user: AwsUser) {
    if (message.code === 'UserNotConfirmedException') {
      this.store.dispatch(new Core.NeedsConfirmation(user))
    }
  }
}
