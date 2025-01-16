import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersAddEditComponent } from './users-add-edit/users-add-edit.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersSuccessComponent } from './users-success/users-success.component';
import { UsersComponent } from './users.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: UsersListComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'success',
        component: UsersSuccessComponent
      },
      {
        path: 'add',
        component: UsersAddEditComponent
      },
      {
        path: 'edit/:id',
        component: UsersAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
