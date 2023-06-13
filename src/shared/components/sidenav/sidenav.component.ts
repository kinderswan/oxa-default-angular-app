import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core'

import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { RouterModule } from '@angular/router'
import { SidenavItem } from './sidenav-item'
import { Observable } from 'rxjs'
import { MatButtonModule } from '@angular/material/button'
import { RxFor } from '@rx-angular/template/for'
import { NgTemplateOutlet } from '@angular/common'
import { OxaLazy } from '../lazy/lazy.directive'

@Component({
  selector: 'oxa-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [MatSidenavModule, MatListModule, RouterModule, MatButtonModule, RxFor, NgTemplateOutlet, OxaLazy],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  @Input() sidenavItemTemplate: TemplateRef<SidenavItem>

  @Input('items') items$: Observable<SidenavItem[]>

  opened = true
}
