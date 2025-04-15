import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'edit-container',
  templateUrl: './edit-container.component.html',
  styleUrls: ['./edit-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditContainerComponent{
  @Input() headerTitle: string = '';
  @Input() buttonLabel: string = '';
  @Input() secondButtonLabel: string = '';

  @Output()
  public readonly buttonClicked = new EventEmitter<void>();

  @Output()
  public readonly secondButtonClicked = new EventEmitter<void>();
}
