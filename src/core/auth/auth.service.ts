/* eslint-disable brace-style */

import { Injectable } from '@angular/core'
import { of } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AuthService {
  logout() {}

  loadUserProfile() {
    return of({
      name: 'Test User',
      email: 'testuser@gmail.com',
    })
  }
}
