import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'oxa-coach-container',
  templateUrl: './coach-container.component.html',
  styleUrls: ['./coach-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoachContainerComponent {}
