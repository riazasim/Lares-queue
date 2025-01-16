import { Component, Input } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { BehaviorSubject } from 'rxjs';
import { AutomationTypeEnum } from 'src/app/core/models/message.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-message-template-add-edit-stepper',
  templateUrl: './message-template-add-edit-stepper.component.html',
  providers: [{ provide: CdkStepper, useExisting: MessageTemplateAddEditStepperComponent }],
})
export class MessageTemplateAddEditStepperComponent extends CdkStepper {
  automationTypeEnum = AutomationTypeEnum;
  @Input() id: number;
  @Input() messageForm: FormGroup;
  @Input() automationType: BehaviorSubject<AutomationTypeEnum|null>;
}
