import { SidenavItem } from '@shared/components/sidenav/sidenav-item'

export const dashboardNavItems: SidenavItem[] = [
  {
    title: 'Users',
    icon: 'perm_identity',
    url: './users',
  },
  {
    title: 'Coaches',
    icon: 'record_voice_over',
    url: './coaches',
  },
  {
    title: 'Financials',
    icon: 'monetization_on',
    url: './financials',
    tabs: ['Monetization', 'Revenue', 'Cash-outs'],
    permissions: 'financials-page',
  },
  {
    title: 'Reporting',
    icon: 'report_problem',
    url: './reporting',
    tabs: ['Unhealthy content', 'Copyright violation'],
    permissions: 'reporting-page',
  },
  {
    title: 'Support',
    icon: 'insert_comment',
    url: './support',
    permissions: 'support-page',
  },
  {
    title: 'Advertisement',
    icon: 'grade',
    url: './advertisement',
    permissions: 'advertisement-page',
  },
  {
    title: 'Content Management',
    icon: 'add_box',
    url: './content-management',
    tabs: ['Content', 'Inspirations'],
    permissions: 'content-management-page',
  },
  {
    title: 'Administrators',
    icon: 'people-outline',
    url: './admins',
    permissions: 'admin-page',
  },
]

export const settingsNavItems: SidenavItem[] = [
  {
    title: 'Profile',
    icon: 'face',
    url: './profile',
  },
]
