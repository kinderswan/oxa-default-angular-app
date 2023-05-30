import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule, JsonPipe } from '@angular/common'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { AwsUser } from '@core/auth/cognito.service'
import { RxCommonModule } from '@shared/rx-common.module'
import { Store } from '@ngxs/store'
import { Core } from '@core/store/core.actions'

type AwsSigninUser = Pick<AwsUser, 'email' | 'password'>

type AsFormGroup<T> = {
  [K in keyof T]: FormControl<T[K] | null>
}

@Component({
  selector: 'oxa-sign-in',
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
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  hide = true

  signinForm: FormGroup<AsFormGroup<AwsSigninUser>>

  constructor(private fb: FormBuilder, private store: Store) {
    this.signinForm = this.fb.group<AsFormGroup<AwsSigninUser>>({
      email: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
    })
  }

  submit() {
    if (this.signinForm.valid) {
      this.store.dispatch(new Core.SignInUser(this.signinForm.getRawValue() as any))
    }
  }
}
