import { Mockify, MockProvider } from '@core/core.mock'
import { ProfileService } from './profile.service'

export const profileServiceMock: Mockify<ProfileService> = {}
export const profileServiceMockProvider: MockProvider<ProfileService> = {
  provide: ProfileService,
  useValue: profileServiceMock,
}
