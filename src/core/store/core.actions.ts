export namespace Core {
  export class LoadAppConfig {
    static readonly type = '[Core] Load App Config'
  }

  export class SetCurrentUser {
    static readonly type = '[Core] Set Current User'
    constructor(public user: string) {}
  }

  export class Logout {
    static readonly type = '[Core] Logout'
  }
}
