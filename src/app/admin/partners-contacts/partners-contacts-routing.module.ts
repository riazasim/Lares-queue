import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnersContactsAddEditComponent } from './partners-contacts-add-edit/partners-contacts-add-edit.component';
import { PartnersContactsListComponent } from './partners-contacts-list/partners-contacts-list.component';
import { PartnersContactsSuccessComponent } from './partners-contacts-success/partners-contacts-success.component';
import { PartnersContactsComponent } from './partners-contacts.component';

const routes: Routes = [
  {
    path: '',
    component: PartnersContactsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: PartnersContactsListComponent
      },
      {
        path: 'success',
        component: PartnersContactsSuccessComponent
      },
      {
        path: 'add',
        component: PartnersContactsAddEditComponent
      },
      {
        path: 'edit/:id',
        component: PartnersContactsAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnersContactsRoutingModule { }
