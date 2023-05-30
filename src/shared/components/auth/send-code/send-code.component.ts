import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule, JsonPipe } from '@angular/common'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { RxCommonModule } from '@shared/rx-common.module'
import { Store } from '@ngxs/store'
import { Core } from '@core/store/core.actions'
import { AwsUser } from '@core/auth/cognito.service'

type AsFormGroup<T> = {
  [K in keyof T]: FormControl<T[K] | null>
}

@Component({
  selector: 'oxa-send-code',
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
  templateUrl: './send-code.component.html',
  styleUrls: ['./send-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendCodeComponent {
  sendCodeForm: FormGroup<AsFormGroup<{ code: string }>>

  @Input() user: AwsUser

  constructor(private fb: FormBuilder, private store: Store) {
    this.sendCodeForm = this.fb.group<AsFormGroup<{ code: string }>>({
      code: this.fb.control('', [Validators.required]),
    })
  }

  submit() {
    if (this.sendCodeForm.valid) {
      const code = this.sendCodeForm.getRawValue()?.code ?? ''
      this.store.dispatch(new Core.SendCode({ ...this.user, code }))
    }
  }
}
