import { Component, ChangeDetectionStrategy, Input } from '@angular/core'
import { Core } from '@core/store/core.actions'
import { Store } from '@ngxs/store'

@Component({
  selector: 'oxa-user-init',
  template: '',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInitComponent {
  constructor(private store: Store) {}

  @Input() set user(value: { attributes: { email: string } }) {
    this.store.dispatch(new Core.SetCurrentUser(value.attributes.email))
  }
}
