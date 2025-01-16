import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomFieldsComponent } from './custom-fields.component';
import { CustomFieldsListComponent } from './custom-fields-list/custom-fields-list.component';
import { NoCustomFieldsComponent } from './no-custom-fields/no-custom-fields.component';

const routes: Routes = [
  {
    path: '',
    component: CustomFieldsComponent,
    children: [
      {
        path: '',
        redirectTo: 'no-custom-fields',
        pathMatch: 'full'
      },
      {
        path: 'list/cargo-data',
        component: CustomFieldsListComponent
      },
      {
        path: 'list/cargo-data/:id',
        component: CustomFieldsListComponent
      },
      {
        path: 'list/transport-data',
        component: CustomFieldsListComponent
      },
      {
        path: 'list/transport-data/:id',
        component: CustomFieldsListComponent
      },
      {
        path: 'list/additional-data',
        component: CustomFieldsListComponent
      },
      {
        path: 'list/additional-data/:id',
        component: CustomFieldsListComponent
      },
      {
        path: 'no-custom-fields',
        component: NoCustomFieldsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomFieldsRoutingModule { }
