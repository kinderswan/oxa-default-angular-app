import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { LetDirective } from '@rx-angular/template/let'
import { PushPipe } from '@rx-angular/template/push'
import { Observable } from 'rxjs'

@Component({
  selector: 'oxa-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
  standalone: true,
  imports: [LetDirective, PushPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInfoComponent {
  @Input('profile') profile$: Observable<string>
}
