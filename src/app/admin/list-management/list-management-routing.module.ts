import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListManagementComponent } from './list-management.component';
import { ListManagementSuccessComponent } from './list-management-success/list-management-success.component';
import { ListManagementAddEditComponent } from './list-management-add-edit/list-management-add-edit.component';
import { ListManagementListComponent } from './list-management-list/list-management-list.component';
import { ListStatusComponent } from './list-status/list-status.component';
import { StatusAddEditComponent } from './status-add-edit/status-add-edit.component';
import { StatusSuccessComponent } from './status-success/status-success.component';

const routes: Routes = [
  {
    path: '',
    component: ListManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'sid-status',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ListManagementListComponent
      },
      {
        path: 'success',
        component: ListManagementSuccessComponent
      },
      {
        path: 'sid-status',
        component: ListStatusComponent
      },
      {
        path: 'goods-status',
        component: ListStatusComponent
      },
      {
        path: 'timeslot-status',
        component: ListStatusComponent
      },
      {
        path: 'add',
        component: StatusAddEditComponent
      },
      {
        path: 'edit/:id',
        component: StatusAddEditComponent
      },
      {
        path: 'success',
        component: StatusSuccessComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListManagementRoutingModule { }
