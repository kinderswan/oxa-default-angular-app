import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CoreState } from '@core/store/core.state'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { Profile } from '../store/profile.actions'
import { UserProfileModel } from '../store/user-profile.model'

@Component({
  selector: 'oxa-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContainerComponent {
  @Select(CoreState.getProfile) profile$: Observable<UserProfileModel>

  constructor(private store: Store) {}

  logout() {
    this.store.dispatch(new Profile.Logout())
  }
}
