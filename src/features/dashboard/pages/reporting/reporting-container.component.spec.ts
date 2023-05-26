import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ReportingContainerComponent } from './reporting-container.component'

describe('ReportingContainerComponent', () => {
  let component: ReportingContainerComponent
  let fixture: ComponentFixture<ReportingContainerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportingContainerComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ReportingContainerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
