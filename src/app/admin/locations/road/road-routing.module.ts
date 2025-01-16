import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoadListComponent } from './road-list/road-list.component';
import { RoadSuccessComponent } from './road-success/road-success.component';
import { RoadAddEditComponent } from './road-add-edit/road-add-edit.component';
import { RoadComponent } from './road.component';

const routes: Routes = [
  {
    path: '',
    component: RoadComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: RoadListComponent
      },
      {
        path: 'success',
        component: RoadSuccessComponent
      },
      {
        path: 'add',
        component: RoadAddEditComponent
      },
      {
        path: 'edit/:id',
        component: RoadAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoadRoutingModule { }
