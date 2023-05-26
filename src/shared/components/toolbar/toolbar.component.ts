import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'oxa-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {}
