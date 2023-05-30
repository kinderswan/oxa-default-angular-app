import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule, JsonPipe } from '@angular/common'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { Router, RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { AwsUser, CognitoService } from '@core/auth/cognito.service'
import { RxCommonModule } from '@shared/rx-common.module'
import { Actions, Store, ofActionSuccessful } from '@ngxs/store'
import { Core } from '@core/store/core.actions'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

type AwsRegisterUser = Pick<AwsUser, 'name' | 'email' | 'password'>

type AsFormGroup<T> = {
  [K in keyof T]: FormControl<T[K] | null>
}

@Component({
  selector: 'oxa-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RxCommonModule,
    JsonPipe,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  hide = true

  registerForm: FormGroup<AsFormGroup<AwsRegisterUser>>

  constructor(private fb: FormBuilder, private store: Store, private actions: Actions, private router: Router) {
    this.registerForm = this.fb.group<AsFormGroup<AwsRegisterUser>>({
      name: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.email, Validators.required]),
      password: this.fb.control('', [Validators.required]),
    })

    this.actions
      .pipe(ofActionSuccessful(Core.Register), takeUntilDestroyed())
      .subscribe(() => this.router.navigate(['../']))
  }

  submit() {
    if (this.registerForm.valid) {
      this.store.dispatch(new Core.Register(this.registerForm.getRawValue() as any))
    }
  }
}
