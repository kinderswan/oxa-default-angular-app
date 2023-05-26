import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'oxa-user-container',
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserContainerComponent {}
