import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component'
import { Router, RouterModule } from '@angular/router'
import { Actions, Select, ofActionSuccessful } from '@ngxs/store'
import { CoreState } from '@core/store/core.state'
import { RxCommonModule } from '@shared/rx-common.module'
import { Observable } from 'rxjs'
import { AwsUser } from '@core/auth/cognito.service'
import { SendCodeComponent } from '../send-code/send-code.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Core } from '@core/store/core.actions'

@Component({
  selector: 'oxa-login',
  standalone: true,
  imports: [CommonModule, ToolbarComponent, RouterModule, RxCommonModule, SendCodeComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  @Select(CoreState.needCodeConfirmation) needCodeConfirm$: Observable<AwsUser>

  constructor(private actions: Actions, private router: Router) {
    this.actions
      .pipe(ofActionSuccessful(Core.Register), takeUntilDestroyed())
      .subscribe(() => this.router.navigate(['../']))

    this.actions
      .pipe(ofActionSuccessful(Core.SendCode), takeUntilDestroyed())
      .subscribe(() => this.router.navigate(['../../']))
  }
}
