import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { RxIf } from '@rx-angular/template/if'
import { debounceTime } from 'rxjs'
import { OxaLazy } from '../lazy/lazy.directive'
import { NgClass } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'oxa-search-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, RxIf, OxaLazy],
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NgClass],
})
export class SearchFieldComponent {
  searchControl = new FormControl()

  closeIconOutputs = {
    click: () => this.searchControl.setValue(''),
  }

  get value() {
    return this.searchControl.value
  }

  @Input() debounce = 700

  @Output() valueChanges = this.searchControl.valueChanges.pipe(debounceTime(this.debounce), takeUntilDestroyed())

  reset() {
    this.searchControl.setValue('', { emitEvent: false })
  }
}
