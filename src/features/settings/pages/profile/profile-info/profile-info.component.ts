import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { UserProfileModel } from '../store/user-profile.model'

@Component({
  selector: 'oxa-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInfoComponent {
  @Input('profile') profile$: Observable<UserProfileModel>
}
