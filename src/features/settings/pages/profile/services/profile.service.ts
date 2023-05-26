import { Injectable } from '@angular/core'
import { AuthService } from '@core/auth/auth.service'

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private authService: AuthService) {}

  loadAdminProfile() {
    return this.authService.loadUserProfile()
  }
}
