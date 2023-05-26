import { importProvidersFrom, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RouterModule } from '@angular/router'
import { CoachContainerComponent } from './coach-container/coach-container.component'
import { NgxsModule } from '@ngxs/store'
import { CoachState } from '@dashboard/coach/store/coach.state'

@NgModule({
  declarations: [CoachContainerComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: CoachContainerComponent }])],
  providers: [importProvidersFrom(NgxsModule.forFeature([CoachState]))],
  exports: [RouterModule],
})
export class CoachModule {}
