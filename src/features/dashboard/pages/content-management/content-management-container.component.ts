import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'oxa-content-management-container',
  templateUrl: './content-management-container.component.html',
  styleUrls: ['./content-management-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentManagementContainerComponent {}
