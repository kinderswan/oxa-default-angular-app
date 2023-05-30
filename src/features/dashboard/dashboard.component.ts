import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Core } from '@core/store/core.actions'
import { Select, Store } from '@ngxs/store'
import { SidenavItem } from '@shared/components/sidenav/sidenav-item'
import { SharedState } from '@shared/store/shared.state'
import { Observable } from 'rxjs'
@Component({
  selector: 'oxa-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  @Select(SharedState.getDashboardNavigationItems) navItems$: Observable<SidenavItem[]>

  constructor(private store: Store) {
    this.store.dispatch(new Core.SetUserProfile())
  }
}
