import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Select } from '@ngxs/store'
import { SidenavItem } from '@shared/components/sidenav/sidenav-item'
import { SharedState } from '@shared/store/shared.state'
import { Observable } from 'rxjs'

@Component({
  selector: 'oxa-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  @Select(SharedState.getSettingsNavigationItems) navItems$: Observable<SidenavItem[]>
}
