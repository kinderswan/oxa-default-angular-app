import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FinancialsContainerComponent } from './financials-container.component'

describe('FinancialsContainerComponent', () => {
  let component: FinancialsContainerComponent
  let fixture: ComponentFixture<FinancialsContainerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialsContainerComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(FinancialsContainerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
