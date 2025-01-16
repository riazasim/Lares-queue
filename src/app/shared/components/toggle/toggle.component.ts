import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleComponent {
  @Input() formGroup: FormGroup;
  @Input() disabled: boolean = false;
  @Input() field: string;

  @Input() model: boolean;

  @Output() onModelChange: EventEmitter<boolean> = new EventEmitter();
}
