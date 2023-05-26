import { Injectable } from '@angular/core'
import { Selector, State } from '@ngxs/store'

export interface FinancialsModel {
  financials: FinancialsModel | null
}

@State<FinancialsModel>({
  name: 'financials',
  defaults: {
    financials: null,
  },
})
@Injectable()
export class FinancialsState {
  @Selector()
  static getFinancials(state: FinancialsModel) {
    return state.financials
  }
}
