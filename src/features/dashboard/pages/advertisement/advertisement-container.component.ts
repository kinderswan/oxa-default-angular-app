import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'oxa-advertisement-container',
  templateUrl: './advertisement-container.component.html',
  styleUrls: ['./advertisement-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvertisementContainerComponent {}
