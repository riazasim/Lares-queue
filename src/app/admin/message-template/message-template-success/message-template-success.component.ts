import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-message-template-success',
  templateUrl: './message-template-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageTemplateSuccessComponent {}
