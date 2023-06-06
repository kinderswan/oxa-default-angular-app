import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormTableComponent } from './form-table.component'

describe('MediaListComponent', () => {
  let component: FormTableComponent<any>
  let fixture: ComponentFixture<FormTableComponent<any>>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormTableComponent],
    })
    fixture = TestBed.createComponent(FormTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
