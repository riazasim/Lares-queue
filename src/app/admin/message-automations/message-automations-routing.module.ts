import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageAutomationsListComponent } from './message-automations-list/message-automations-list.component';
import { MessageAutomationsComponent } from './message-automations.component';

const routes: Routes = [
  {
    path: '',
    component: MessageAutomationsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: MessageAutomationsListComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageAutomationsRoutingModule { }
