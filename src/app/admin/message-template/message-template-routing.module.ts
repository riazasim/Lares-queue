import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageTemplateAddEditComponent } from './message-template-add-edit/message-template-add-edit.component';
import { MessageTemplateConditionsComponent } from './message-template-conditions/message-template-conditions.component';
import { MessageTemplateListComponent } from './message-template-list/message-template-list.component';
import { MessageTemplateMenuComponent } from './message-template-menu/message-template-menu.component';
import { MessageTemplateSuccessComponent } from './message-template-success/message-template-success.component';
import { MessageTemplateComponent } from './message-template.component';
import { MessageTemplateAddEditStepperComponent } from './message-template-add-edit-stepper/message-template-add-edit-stepper.component';

const routes: Routes = [
  {
    path: '',
    component: MessageTemplateComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: MessageTemplateListComponent
      },
      {
        path: 'success',
        component: MessageTemplateSuccessComponent
      },
      {
        path: 'add',
        component: MessageTemplateAddEditComponent
      },
      {
        path: 'menu',
        component: MessageTemplateMenuComponent
      },
      {
        path: 'conditions',
        component: MessageTemplateConditionsComponent
      },
      {
        path: 'edit/:id',
        component: MessageTemplateAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageTemplateRoutingModule { }
