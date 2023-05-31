import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core'
import { Core } from '@core/store/core.actions'
import { Actions, ofActionSuccessful } from '@ngxs/store'
import { Observable } from 'rxjs'

@Component({
  selector: 'oxa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent {
  envLoaded$: Observable<unknown>

  constructor(private actions: Actions, private cdr: ChangeDetectorRef) {
    this.envLoaded$ = this.actions.pipe(ofActionSuccessful(Core.LoadAppConfig))
  }
}
