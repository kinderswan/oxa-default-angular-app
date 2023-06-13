import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TestComponent } from '../components/test.component'

@Component({
  selector: 'oxa-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['./test-container.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TestComponent],
})
export class TestContainerComponent {}
