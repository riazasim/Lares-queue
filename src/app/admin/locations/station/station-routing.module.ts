import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StationAddEditComponent } from './station-add-edit/station-add-edit.component';
import { StationListComponent } from './station-list/station-list.component';
import { StationSuccessComponent } from './station-success/station-success.component';
import { StationComponent } from './station.component';

const routes: Routes = [
  {
    path: '',
    component: StationComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: StationListComponent
      },
      {
        path: 'success',
        component: StationSuccessComponent
      },
      {
        path: 'add',
        component: StationAddEditComponent
      },
      {
        path: 'edit/:id',
        component: StationAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StationRoutingModule { }
