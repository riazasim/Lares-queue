import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'success-container',
  templateUrl: './success-container.component.html',
  styleUrls: ['./success-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuccessContainerComponent {
  @Input() headerTitle: string = '';
}
