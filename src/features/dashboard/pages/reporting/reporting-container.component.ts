import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'oxa-reporting-container',
  templateUrl: './reporting-container.component.html',
  styleUrls: ['./reporting-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingContainerComponent {}
