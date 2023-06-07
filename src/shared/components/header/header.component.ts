import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'

@Component({
  selector: 'oxa-header',
  standalone: true,
  imports: [MatIconModule, MatDividerModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() title: string
  @Input() icon: string
}
