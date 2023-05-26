import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { UserProfileModel } from '../store/user-profile.model'
import { Profile } from '../store/profile.actions'
import { ProfileState } from '../store/profile.state'

@Component({
  selector: 'oxa-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContainerComponent {
  @Select(ProfileState.getProfile) profile$: Observable<UserProfileModel>

  constructor(private store: Store) {
    this.loadUserProfile()
  }

  logout() {
    this.store.dispatch(new Profile.Logout())
  }

  loadUserProfile() {
    this.store.dispatch(new Profile.LoadUserProfile())
  }
}
