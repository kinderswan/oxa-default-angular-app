import { ChangeDetectionStrategy, Component } from '@angular/core'
import { PushPipe } from '@rx-angular/template/push'
import { OxaLazy } from '@shared/components/lazy/lazy.directive'
import { interval, map } from 'rxjs'

@Component({
  selector: 'oxa-test',
  standalone: true,
  imports: [OxaLazy, PushPipe],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent {
  value$ = interval(233).pipe(map(() => Date.now() % 100))
}
