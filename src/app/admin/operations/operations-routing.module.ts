import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationsAddEditComponent } from './operations-add-edit/operations-add-edit.component';
import { OperationsListComponent } from './operations-list/operations-list.component';
import { OperationsSuccessComponent } from './operations-success/operations-success.component';
import { OperationsComponent } from './operations.component';

const routes: Routes = [
  {
    path: '',
    component: OperationsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: OperationsListComponent
      },
      {
        path: 'success',
        component: OperationsSuccessComponent
      },
      {
        path: 'add',
        component: OperationsAddEditComponent
      },
      {
        path: 'edit/:id',
        component: OperationsAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
