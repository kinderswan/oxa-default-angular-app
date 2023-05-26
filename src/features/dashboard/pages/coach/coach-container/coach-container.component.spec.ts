import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CoachContainerComponent } from './coach-container.component'

describe('CoachContainerComponent', () => {
  let component: CoachContainerComponent
  let fixture: ComponentFixture<CoachContainerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoachContainerComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CoachContainerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
