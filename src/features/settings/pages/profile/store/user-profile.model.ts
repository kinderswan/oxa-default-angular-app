import { AwsUser } from '@core/auth/cognito.service'

export type UserProfileModel = Pick<AwsUser, 'name' | 'email'>
