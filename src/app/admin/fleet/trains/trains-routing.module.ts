import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainsComponent } from './trains.component';
import { TrainsListComponent } from './trains-list/trains-list.component';
import { TrainsSuccessComponent } from './trains-success/trains-success.component';
import { TrainsAddEditComponent } from './trains-add-edit/trains-add-edit.component';


const routes: Routes = [
  {
    path: '',
    component: TrainsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: TrainsListComponent
      },
      {
        path: 'success',
        component: TrainsSuccessComponent
      },
      {
        path: 'add',
        component: TrainsAddEditComponent
      },
      {
        path: 'edit/:id',
        component: TrainsAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainsRoutingModule { }
