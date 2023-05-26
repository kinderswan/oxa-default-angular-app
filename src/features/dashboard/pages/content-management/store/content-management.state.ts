import { Injectable } from '@angular/core'
import { Selector, State } from '@ngxs/store'

export interface ContentManagementModel {
  contentManagement: ContentManagementModel | null
}

@State<ContentManagementModel>({
  name: 'contentManagement',
  defaults: {
    contentManagement: null,
  },
})
@Injectable()
export class ContentManagementState {

  @Selector()
  static getContentManagement(state: ContentManagementModel) {
    return state.contentManagement
  }
}
