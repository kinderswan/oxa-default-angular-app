type FeatureKey =
  | 'financials-page'
  | 'reporting-page'
  | 'support-page'
  | 'advertisement-page'
  | 'content-management-page'
  | 'admin-page'

export type Features = { [P in FeatureKey]: boolean }

export const featureFlags: Features = {
  'financials-page': false,
  'reporting-page': false,
  'support-page': false,
  'advertisement-page': false,
  'content-management-page': false,
  'admin-page': false,
}
