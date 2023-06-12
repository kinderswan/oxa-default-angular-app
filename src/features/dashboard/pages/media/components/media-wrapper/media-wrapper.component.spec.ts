import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MediaWrapperComponent } from './media-wrapper.component'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { RxIf } from '@rx-angular/template/if'
import { LetDirective } from '@rx-angular/template/let'
import { SearchFieldComponent } from '@shared/components/search-field/search-field.component'
import { importProvidersFrom } from '@angular/core'
import { MediaState } from '@dashboard/media/store/media.state'
import { NgxsModule } from '@ngxs/store'

describe('MediaWrapperComponent', () => {
  let component: MediaWrapperComponent
  let fixture: ComponentFixture<MediaWrapperComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        RxIf,
        LetDirective,
        SearchFieldComponent,
        importProvidersFrom(NgxsModule.forFeature([MediaState])),
      ],
    }).compileComponents()
    fixture = TestBed.createComponent(MediaWrapperComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
