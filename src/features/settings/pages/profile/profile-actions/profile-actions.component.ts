import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'oxa-profile-actions',
  templateUrl: './profile-actions.component.html',
  styleUrls: ['./profile-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileActionsComponent {
  @Output() logout = new EventEmitter<void>()

  @Output() userInfoRequested = new EventEmitter<void>()

  endSession() {
    this.logout.next()
  }
}
