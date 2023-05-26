import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'oxa-financials-container',
  templateUrl: './financials-container.component.html',
  styleUrls: ['./financials-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialsContainerComponent {}
