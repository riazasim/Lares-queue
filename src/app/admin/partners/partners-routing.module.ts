import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnersAddEditComponent } from './partners-add-edit/partners-add-edit.component';
import { PartnersListComponent } from './partners-list/partners-list.component';
import { PartnersSuccessComponent } from './partners-success/partners-success.component';
import { PartnersComponent } from './partners.component';

const routes: Routes = [
  {
    path: '',
    component: PartnersComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: PartnersListComponent
      },
      {
        path: 'success',
        component: PartnersSuccessComponent
      },
      {
        path: 'add',
        component: PartnersAddEditComponent
      },
      {
        path: 'edit/:id',
        component: PartnersAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnersRoutingModule { }
