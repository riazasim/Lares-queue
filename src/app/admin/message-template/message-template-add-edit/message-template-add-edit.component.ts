import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutomationTypeEnum, MessageModel, RepeatOptionEnum } from 'src/app/core/models/message.model';
import { MessageService } from 'src/app/core/services/message.service';
import { TemplateQuery, TemplateQueryWithTime } from '../../../core/models/template-query.model';
import { BehaviorSubject } from 'rxjs';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MessageTemplateConditionsComponent } from '../message-template-conditions/message-template-conditions.component';
import { MessageTemplateAddEditStepperComponent } from '../message-template-add-edit-stepper/message-template-add-edit-stepper.component';
import { NativeResponseWrapper } from 'src/app/core/models/response-wrappers.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
  selector: 'app-message-template-add-edit',
  templateUrl: './message-template-add-edit.component.html'
})
export class MessageTemplateAddEditComponent implements OnInit, OnDestroy {
  messageForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  automationType$: BehaviorSubject<AutomationTypeEnum|null> =
              new BehaviorSubject<AutomationTypeEnum|null>(null);
  automationTypeEnum = AutomationTypeEnum;
  whereQuery: TemplateQuery[] | string = '';
  step: number = 0;
  id: number;
  repeatOptionEnum = RepeatOptionEnum;

  @ViewChild(MessageTemplateConditionsComponent) messageConditionsComponent: MessageTemplateConditionsComponent;
  @ViewChild(MessageTemplateAddEditStepperComponent) stepper: MessageTemplateAddEditStepperComponent;

  constructor(private readonly messageService: MessageService,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly fb: FormBuilder,
              private readonly snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.messageService.get(this.id).subscribe((response: MessageModel) => {
        this.initForm(response);
        this.automationType$.next(response.automationBit);
        this.subscribeForAutomationBitChanges();
        response.whereQuery ? this.whereQuery = response.whereQuery : null;
        this.isLoading$.next(false);
      });
    } else {
      this.initForm();
      this.subscribeForAutomationBitChanges();
      this.isLoading$.next(false);
    }
  }

  subscribeForSaveConditions(): void {
    this.messageService.saveTrigger.subscribe((response: TemplateQueryWithTime) => {
      this.saveMessage(response);
    });
  }

  subscribeForAutomationBitChanges(): void {
    this.automationType$.subscribe((response: AutomationTypeEnum | null) => {
      if (response) {
        this.messageForm.get('automationBit')?.patchValue(response);
      }
    });
  }

  initForm(data?: MessageModel): void {
    this.messageForm = this.fb.group({
      name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
      message: this.fb.control(data?.message || '', [...createRequiredValidators()]),
      tags: this.fb.control(data?.tags || [], [...createRequiredValidators()]),
      requiresResponseBit: this.fb.control(data?.requiresResponseBit || true, [...createRequiredValidators()]),
      automationBit: this.fb.control(data?.automationBit || 0, [...createRequiredValidators()]),
      messageAutomationEvent: this.fb.control(data?.messageAutomationEvent || '', [...createRequiredValidators()]),
      whereQuery: this.fb.control(data?.whereQuery  || []),
      automationDate: this.fb.control(data?.automationDate || '2023-11-22 11:07:34',[...createRequiredValidators()]),
      repeatOption: this.fb.control(data?.repeatOption ?? RepeatOptionEnum.doesNotRepeat),
      id: this.fb.control(data?.id),
    });
  }

  saveMessage(data: MessageModel | TemplateQueryWithTime): void {
    this.isLoading$.next(true);

    const item: MessageModel = {
      ...this.messageForm.value,
      messageAutomationEvent: data?.messageAutomationEvent || this.messageForm.value.messageAutomationEvent || '',
      waitingPeriod: data?.waitingPeriod || this.messageForm.value.waitingPeriod || 0,
      repeatOption: data?.repeatOption || this.messageForm.value.repeatOption || 0,
      automationDate: data?.automationDate || this.messageForm.value.automationDate || '',
      whereQuery: data?.whereQuery || this.messageForm.value.whereQuery || []
    }

    if (this.id) {
      this.messageService.edit(this.id, this.parseData(item)).subscribe({
        next: () => {
        this.isLoading$.next(false);
        this.router.navigate(['../../success'], { relativeTo: this.route });
      },
        error: (e) => this.handleError(e)
    });
    } else {
      this.messageService.create(this.parseData(item)).subscribe({
        next: () => {
        this.isLoading$.next(false);
        this.router.navigate(['../success'], { relativeTo: this.route });
      },
        error: (e) => this.handleError(e)
    });
    }
  }

  handleError(body: NativeResponseWrapper<MessageModel>): void {
    if (body.code === 400) {
      for(let prop in body.error.form) {
        this.snackBar.open('Error!', (<any>body.error.form)[prop], {
          duration: 3000,
          horizontalPosition: 'end',
          panelClass: ['error-snackbar'],
          verticalPosition: 'bottom',
        })
      }
    } else {
      this.snackBar.open('Error!', '', {
        duration: 3000,
        horizontalPosition: 'end',
        panelClass: ['error-snackbar'],
        verticalPosition: 'bottom',
      })
    }

    this.stepper.previous();
    this.isLoading$.next(false);
  }

  setAutomationType(type: AutomationTypeEnum) {
    this.automationType$.next(type);
  }

  submit(event: StepperSelectionEvent): void {
    this.step = event.selectedIndex;
    if (this.automationType$.value === AutomationTypeEnum.noAutomation && event.selectedIndex === 2) {
      this.saveMessage(this.parseData(this.messageForm.value));
    }

    if (this.automationType$.value === AutomationTypeEnum.actionBased && event.selectedIndex === 3) {
      if (!this.messageConditionsComponent.messageAutomationEvent || isNaN(+this.messageConditionsComponent.waitingPeriod)) {
        this.snackBar.open('Warning!', 'Complete all data!', {
          duration: 3000,
          horizontalPosition: 'end',
          panelClass: ['error-snackbar'],
          verticalPosition: 'bottom',
        })
        this.stepper.previous();
       // return;
      }

      this.saveMessage({
        messageAutomationEvent: this.messageConditionsComponent.messageAutomationEvent,
        waitingPeriod: +this.messageConditionsComponent.waitingPeriod,
        automationDate: this.messageConditionsComponent.automationDate,
        repeatOption: +this.messageConditionsComponent.repeatOption,
        whereQuery: this.messageConditionsComponent.getParsedQuery()
      });

    }

    if (this.automationType$.value === AutomationTypeEnum.timeBased && event.selectedIndex === 3) {
      if (!this.messageConditionsComponent.repeatOption || !this.messageConditionsComponent.automationDate ||
        isNaN(+this.messageConditionsComponent.waitingPeriod) || !Date.parse(<string>this.messageConditionsComponent.automationDate)) {
        this.snackBar.open('Warning!', 'Complete all data!', {
          duration: 3000,
          horizontalPosition: 'end',
          panelClass: ['error-snackbar'],
          verticalPosition: 'bottom',
        })
        this.stepper.previous();
       // return;
      }

      this.saveMessage({
        messageAutomationEvent: this.messageConditionsComponent.messageAutomationEvent,
        waitingPeriod: +this.messageConditionsComponent.waitingPeriod,
        automationDate: this.messageConditionsComponent.automationDate,
        repeatOption: +this.messageConditionsComponent.repeatOption,
        whereQuery: this.messageConditionsComponent.getParsedQuery()
      });
    }
  }

  private parseData(data: MessageModel): MessageModel {
    const message: MessageModel = {
      ...data,
      waitingPeriod: data.waitingPeriod ? +data.waitingPeriod : 0,
      automationBit: data.automationBit ? +data.automationBit : 0,
      repeatOption: data.repeatOption ? +data.repeatOption : 0,
      requiresResponseBit: !!data.requiresResponseBit
    }

    delete message.id;

    return message;
  }

  ngOnDestroy(): void {
    if (this.messageService.saveTrigger.observed) {
      this.messageService.saveTrigger.unsubscribe();
    }
  }

}
