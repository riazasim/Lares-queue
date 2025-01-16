import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateQuery } from 'src/app/core/models/template-query.model';
import { MessagesArr, MessageQuery } from '../../../core/models/messagesArr';
import { MessageService } from 'src/app/core/services/message.service';
import { AutomationTypeEnum, RepeatOptionEnum } from 'src/app/core/models/message.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-message-template-conditions',
  templateUrl: './message-template-conditions.component.html',
  styleUrls: ['./message-template-conditions.component.scss'],
})

export class MessageTemplateConditionsComponent {
  messageAutomationEvent: string = '';
  waitingPeriod: number;
  isWaiting: boolean = false;
  whereQuery: MessagesArr[] = [] ;
  automationTypeEnum = AutomationTypeEnum;
  repeatOptionEnum = RepeatOptionEnum;
  @Input() automationType: BehaviorSubject<AutomationTypeEnum|null>;
  @Input() repeatOption: number;
  @Input() automationDate: string | Date;
  @Input() query: TemplateQuery[] | string = '';

  constructor(private readonly snackBar: MatSnackBar,
              private readonly messageService: MessageService) {
    typeof(this.query) != 'string' ? this.whereQuery = this.convertToArr(this.query) : null;
  }

  convertToArr(iArr: TemplateQuery[]): MessagesArr[] {
    let obj: MessagesArr[] = [{
      key: iArr[0].key,
      query: []
    }]

    iArr.forEach(el => {
      const temp: MessageQuery = {
        condition: el.condition,
      }

      if (el.start_value) {
        temp['startValue'] = el.start_value;
      }

      if (el.end_value) {
        temp['endValue'] = el.end_value;
      }

      if (el.value) {
        temp['value'] = el.value;
      }

      obj[0].query.push(temp)
    })

    return obj;
  }

  add(key: string = '', condition: string = '', value: string = '', startValue: string = '', endValue: string = ''): void {
    if (!this.messageAutomationEvent && this.automationType.value !== AutomationTypeEnum.timeBased) {
      this.snackBar.open('Warning! Please select the trigger module!', 'Close', {
        duration: 3000,
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
      })
      return;
    }

    const queryItem = {
      key: key,
      query: [{ condition, value, startValue, endValue }]
    }

    this.isWaiting ? this.whereQuery[this.whereQuery.length - 1] = queryItem : this.whereQuery.push(queryItem)
  }

  addSubQuery(index: number): void {
      this.whereQuery[index].query?.push({
        condition: '',
        value: '',
        startValue: '',
        endValue: '',
      });
  }

  removeQuery(i: number): void {
    this.whereQuery.splice(i, 1);
  }

  removeSubQuery(i: number, j: number): void {
    this.whereQuery[i].query.splice(j, 1);
  }

  getQueries(key: string) {
    for( let i = 0; i < this.whereQuery.length; i++) {
      if(this.whereQuery[i].key === key)
        return this.whereQuery[i].query;
    }
    return
  }

  handleChangeDateTime(event: KeyboardEvent, type: 'date' | 'time'): void {
    const value = (<any>event.target).value;
    if (type === 'time') {
      this.automationDate = Date.parse(<string>this.automationDate) ? new Date(this.automationDate) : new Date();
      this.automationDate.setHours(+value.substring(0, 2));
      this.automationDate.setMinutes(+value.substring(3, 5));
      return;
    }

    if (type === 'date' && Date.parse(value)) {
      const originalDate = new Date(this.automationDate);
      originalDate.getMinutes()
      this.automationDate = new Date(value);
      this.automationDate.setHours(originalDate.getHours());
      this.automationDate.setMinutes(originalDate.getMinutes());
    }
  }

  getParsedQuery(): TemplateQuery[] {
    const data: TemplateQuery[] = []

    this.whereQuery.forEach(parentQuery => {
      parentQuery.query.forEach(query => {
        let item: TemplateQuery | null = null;

        if (query.condition === 'IS BETWEEN') {
          item = {
            key: parentQuery.key,
            condition: query.condition,
            start_value: query.startValue,
            end_value: query.endValue
          }
        } else {
          item = {
            key: parentQuery.key,
            condition: query.condition,
            value: query.value
          }
        }
        data.push({ ...item });
      })
    })

    return data;
  }

}
