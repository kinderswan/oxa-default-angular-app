import { UserProfileModel } from '@settings/profile/store/user-profile.model'

export enum MediaStatus {
  DRAFT = 'Draft',
  DELIVERING = 'Delivering',
  CANCELED = 'Canceled',
  COMPLETED = 'Completed',
}

export interface MediaItemModel {
  id: string
  name: string
  status: MediaStatus
  createdBy: UserProfileModel
  lastUpdated: Date | number
}
