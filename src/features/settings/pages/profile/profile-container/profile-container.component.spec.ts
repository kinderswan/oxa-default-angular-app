import { ComponentFixture, TestBed } from '@angular/core/testing'
import { authServiceMockProvider, oauthServiceMockProvider } from '@core/auth/auth.service.mock'
import { NgxsModule } from '@ngxs/store'
import { RxCommonModule } from '@shared/rx-common.module'
import { ProfileActionsComponent } from '../profile-actions/profile-actions.component'
import { ProfileInfoComponent } from '../profile-info/profile-info.component'
import { ProfileState } from '../store/profile.state'

import { ProfileContainerComponent } from './profile-container.component'

describe('ProfileContainerComponent', () => {
  let component: ProfileContainerComponent
  let fixture: ComponentFixture<ProfileContainerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileContainerComponent, ProfileInfoComponent, ProfileActionsComponent],
      imports: [NgxsModule.forRoot([ProfileState]), RxCommonModule],
      providers: [authServiceMockProvider, oauthServiceMockProvider],
    }).compileComponents()

    fixture = TestBed.createComponent(ProfileContainerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
