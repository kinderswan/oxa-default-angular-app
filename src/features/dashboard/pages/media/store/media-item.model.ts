export enum MediaStatus {
  DRAFT = 'Draft',
  DELIVERING = 'Delivering',
  CANCELED = 'Canceled',
  COMPLETED = 'Completed',
}

export interface MediaItemModel {
  id: string | 'null'
  name: string
  status: MediaStatus
  createdBy: string
  lastUpdated: Date | number
}

export interface Paginated<T> {
  items: T[]
  total: number
}
