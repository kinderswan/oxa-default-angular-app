import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SupportContainerComponent } from './support-container.component'

describe('SupportContainerComponent', () => {
  let component: SupportContainerComponent
  let fixture: ComponentFixture<SupportContainerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportContainerComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SupportContainerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
