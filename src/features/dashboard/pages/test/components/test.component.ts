import { ChangeDetectionStrategy, Component, DoCheck } from '@angular/core'
import { PushPipe } from '@rx-angular/template/push'
import { OxaLazy } from '@shared/components/lazy/lazy.directive'
import { lazyServiceFactoryProvider } from '@shared/components/lazy/lazy.service'
import { Observable, interval, map } from 'rxjs'

@Component({
  selector: 'oxa-test',
  standalone: true,
  imports: [OxaLazy, PushPipe],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    lazyServiceFactoryProvider({
      matProgressBar: () => import('@angular/material/progress-bar').then(c => c.MatProgressBar),
    }),
  ],
})
export class TestComponent {
  value$ = interval(233).pipe(map(() => Date.now() % 100))

  constructor() {}

  init(event: Observable<any>) {}
}
