import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'
import { Core } from '@core/store/core.actions'
import { CoreState } from '@core/store/core.state'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { ProfileActionsComponent } from '../components/profile-actions/profile-actions.component'
import { ProfileInfoComponent } from '../components/profile-info/profile-info.component'
import { OxaLazy } from '@shared/components/lazy/lazy.directive'

@Component({
  selector: 'oxa-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatCardModule, MatDividerModule, ProfileInfoComponent, ProfileActionsComponent, OxaLazy],
})
export class ProfileContainerComponent {
  constructor(private store: Store) {}

  @Select(CoreState.getCurrentUser) profile$: Observable<string>

  logout() {
    this.store.dispatch(new Core.Logout())
  }
}
