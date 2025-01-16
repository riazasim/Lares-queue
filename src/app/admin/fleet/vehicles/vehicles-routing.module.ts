import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesSuccessComponent } from "./vehicles-success/vehicles-success.component";
import { VehiclesListComponent } from "./vehicles-list/vehicles-list.component";
import { VehiclesComponent } from "./vehicles.component";
import {VehiclesAddEditComponent} from "./vehicles-add-edit/vehicles-add-edit.component";


const routes: Routes = [
  {
    path: '',
    component: VehiclesComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: VehiclesListComponent
      },
      {
        path: 'success',
        component: VehiclesSuccessComponent
      },
      {
        path: 'add',
        component: VehiclesAddEditComponent
      },
      {
        path: 'edit/:id',
        component: VehiclesAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclesRoutingModule { }
