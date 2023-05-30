export namespace Profile {
  export class Logout {
    static readonly type = '[Profile] Logout'
  }

  export class SetUserProfile {
    static readonly type = '[Profile] Set User Profile'
    constructor(public data: any) {}
  }

  export class DeleteUserProfile {
    static readonly type = '[Profile] Delete User Profile'
  }
}
