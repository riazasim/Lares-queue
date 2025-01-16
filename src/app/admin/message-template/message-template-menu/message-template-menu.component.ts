import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AutomationTypeEnum } from 'src/app/core/models/message.model';

@Component({
  selector: 'app-message-template-menu',
  templateUrl: './message-template-menu.component.html',
  styleUrls: ['./message-template-menu.component.scss']
})
export class MessageTemplateMenuComponent {
  automationTypeEnum = AutomationTypeEnum;
  @Input() automationType: BehaviorSubject<AutomationTypeEnum|null>;
  @Output() typeEventEmitter = new EventEmitter<AutomationTypeEnum>();
  selected: string = '' ;

  // ngOnInit(): void {
  //   if (this.selectionId === 0)
  //     this.selected = 'success';
  //   if (this.selectionId === 1)
  //     this.selected = 'conditions1'
  //   if (this.selectionId === 2)
  //     this.selected = 'conditions2';
  //   console.log('heere')
  // }

  // redirectToSuccess() {
  //   this.typeEventEmitter.emit('success');
  //   this.selected = 'success';
  // }

  // redirectToConditions() {
  //   this.typeEventEmitter.emit('conditions1');
  //   this.selected = 'conditions1';
  // }

  // redirectToConditions2() {
  //   this.typeEventEmitter.emit('conditions2');
  //   this.selected = 'conditions2';
  // }
}
