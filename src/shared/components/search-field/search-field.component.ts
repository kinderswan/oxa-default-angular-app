import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { RxIf } from '@rx-angular/template/if'
import { debounceTime } from 'rxjs'

@Component({
  selector: 'oxa-search-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, RxIf, MatIconModule],
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent {
  searchControl = new FormControl()

  get value() {
    return this.searchControl.value
  }

  @Input() debounce = 700

  @Output() valueChanges = this.searchControl.valueChanges.pipe(debounceTime(this.debounce), takeUntilDestroyed())

  reset() {
    this.searchControl.setValue('', { emitEvent: false })
  }
}
