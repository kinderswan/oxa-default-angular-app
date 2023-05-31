import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Core } from '@core/store/core.actions'
import { CoreState } from '@core/store/core.state'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'

@Component({
  selector: 'oxa-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContainerComponent {
  constructor(private store: Store) {}

  @Select(CoreState.getCurrentUser) profile$: Observable<string>

  logout() {
    this.store.dispatch(new Core.Logout())
  }
}
