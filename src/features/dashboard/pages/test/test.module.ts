import { NgModule } from '@angular/core'

import { RouterModule } from '@angular/router'
import { TestContainerComponent } from './test-container/test-container.component'

@NgModule({
  imports: [TestContainerComponent, RouterModule.forChild([{ path: '', component: TestContainerComponent }])],
  exports: [RouterModule],
})
export class TestModule {}
