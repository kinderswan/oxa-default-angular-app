import { NgModule } from '@angular/core'
import { PushModule } from '@rx-angular/template/push'
import { IfModule } from '@rx-angular/template/if'
import { ForModule } from '@rx-angular/template/for'
import { LetModule } from '@rx-angular/template/let'

@NgModule({
  imports: [PushModule, IfModule, ForModule, LetModule],
  exports: [PushModule, IfModule, ForModule, LetModule],
})
export class RxCommonModule {}
