import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() type: string = 'button';
  @Input() buttonType: 'primary'|'secondary'|'warn'|'disabled'|'link' = 'primary';
  @Input() loading: boolean = false;
  @Input() loadingPosition: 'left'|'right' = 'right';
  @Input() class: string;
  @Input() style: any;
  @Input() buttonSize: '' | 'small'|'medium'|'large' = 'medium';
  @Input() disabled: boolean;
}
