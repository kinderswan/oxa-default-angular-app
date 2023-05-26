import { Injectable } from '@angular/core'
import { Selector, State } from '@ngxs/store'

export interface ReportingModel {
  reporting: ReportingModel | null
}

@State<ReportingModel>({
  name: 'reporting',
  defaults: {
    reporting: null,
  },
})
@Injectable()
export class ReportingState {
  @Selector()
  static getReporting(state: ReportingModel) {
    return state.reporting
  }
}
