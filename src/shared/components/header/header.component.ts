import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MatDividerModule } from '@angular/material/divider'
import { OxaLazy } from '../lazy/lazy.directive'

@Component({
  selector: 'oxa-header',
  standalone: true,
  imports: [MatDividerModule, OxaLazy],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() title: string
  @Input() icon: string
}
