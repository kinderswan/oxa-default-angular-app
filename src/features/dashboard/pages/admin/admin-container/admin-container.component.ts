import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'oxa-admin-container',
  templateUrl: './admin-container.component.html',
  styleUrls: ['./admin-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminContainerComponent {}
