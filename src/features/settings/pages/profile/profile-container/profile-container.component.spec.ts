import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NgxsModule } from '@ngxs/store'
import { ProfileActionsComponent } from '../components/profile-actions/profile-actions.component'
import { ProfileInfoComponent } from '../components/profile-info/profile-info.component'
import { ProfileState } from '../store/profile.state'

import { ProfileContainerComponent } from './profile-container.component'

describe('ProfileContainerComponent', () => {
  let component: ProfileContainerComponent
  let fixture: ComponentFixture<ProfileContainerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileContainerComponent, ProfileInfoComponent, ProfileActionsComponent],
      imports: [NgxsModule.forRoot([ProfileState])],
    }).compileComponents()

    fixture = TestBed.createComponent(ProfileContainerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
