import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core'

import { MatSidenavModule } from '@angular/material/sidenav'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { RxCommonModule } from '@shared/rx-common.module'
import { SidenavItem } from './sidenav-item'
import { Observable } from 'rxjs'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'oxa-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    RxCommonModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  @Input() sidenavItemTemplate: TemplateRef<SidenavItem>

  @Input('items') items$: Observable<SidenavItem[]>

  opened = true
}
