import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-messages',
  templateUrl: './no-message-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class NoMessageTemplateComponent {}
