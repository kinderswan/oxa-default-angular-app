import { AwsUser } from '@core/auth/cognito.service'

export namespace Core {
  export class LoadAppConfig {
    static readonly type = '[Core] Load App Config'
  }

  export class SignInUser {
    static readonly type = '[Core] Sign In User'
    constructor(public user: AwsUser) {}
  }

  export class Register {
    static readonly type = '[Core] Register User'
    constructor(public user: AwsUser) {}
  }

  export class NeedsConfirmation {
    static readonly type = '[Core] User Needs Confirmation'
    constructor(public user: AwsUser) {}
  }

  export class Authenticate {
    static readonly type = '[Core] Set Is Authenticated'
    constructor(public isAuthenticated: boolean) {}
  }

  export class SendCode {
    static readonly type = '[Core] Send Code'
    constructor(public payload: AwsUser) {}
  }

  export class SetUserProfile {
    static readonly type = '[Core] Set User Profile'
  }

  export class DeleteUserProfile {
    static readonly type = '[Core] Delete User Profile'
  }
}
