import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'oxa-profile-actions',
  templateUrl: './profile-actions.component.html',
  styleUrls: ['./profile-actions.component.scss'],
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileActionsComponent {
  @Output() logout = new EventEmitter<void>()

  @Output() userInfoRequested = new EventEmitter<void>()

  endSession() {
    this.logout.emit()
  }
}
