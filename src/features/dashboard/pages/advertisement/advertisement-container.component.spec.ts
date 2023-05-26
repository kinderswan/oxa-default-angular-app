import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AdvertisementContainerComponent } from './advertisement-container.component'

describe('AdvertisementContainerComponent', () => {
  let component: AdvertisementContainerComponent
  let fixture: ComponentFixture<AdvertisementContainerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvertisementContainerComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AdvertisementContainerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
