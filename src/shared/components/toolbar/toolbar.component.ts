import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { OxaLazy } from '../lazy/lazy.directive'

@Component({
  selector: 'oxa-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [RouterModule, OxaLazy],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {}
