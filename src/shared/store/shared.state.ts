import { Injectable } from '@angular/core'
import { Selector, State } from '@ngxs/store'
import { SidenavItem } from '@shared/components/sidenav/sidenav-item'
import { Features, featureFlags } from '@shared/models/features'
import { dashboardNavItems, settingsNavItems } from '@shared/models/navigation'

export interface SharedModel {
  navigation: {
    dashboard: SidenavItem[]
    settings: SidenavItem[]
  }
  features: Features
}

@State<SharedModel>({
  name: 'shared',
  defaults: {
    navigation: {
      dashboard: dashboardNavItems,
      settings: settingsNavItems,
    },
    features: featureFlags,
  },
})
@Injectable()
export class SharedState {
  @Selector([SharedState])
  static getDashboardNavigationItems(state: SharedModel) {
    return state.navigation.dashboard
  }

  @Selector([SharedState])
  static getSettingsNavigationItems(state: SharedModel) {
    return state.navigation.settings
  }
}
