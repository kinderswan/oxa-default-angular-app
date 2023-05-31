import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Select } from '@ngxs/store'
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
}
