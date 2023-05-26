import { Injectable } from '@angular/core'
import { NgxsOnInit, Selector, State } from '@ngxs/store'
import { dashboardNavItems, settingsNavItems } from '@shared/models/navigation'
import { featureFlags, Features } from '@shared/models/features'
import { SidenavItem } from '@shared/components/sidenav/sidenav-item'

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
  @Selector([SharedState, SharedState.getEnabledFeatures])
  static getDashboardNavigationItems(state: SharedModel, features: string[]) {
    return state.navigation.dashboard.filter(nav => !nav.permissions || features.includes(nav.permissions))
  }

  @Selector([SharedState])
  static getSettingsNavigationItems(state: SharedModel) {
    return state.navigation.settings
  }

  @Selector([SharedState])
  static getEnabledFeatures(state: SharedModel) {
    return (
      Object.entries(state.features || {})
        .filter(([_, value]) => Boolean(value))
        .map(([key, _]) => key) ?? []
    )
  }
}
