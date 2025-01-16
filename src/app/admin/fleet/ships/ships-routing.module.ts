import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShipsComponent } from './ships.component';
import { ShipsListComponent } from './ships-list/ships-list.component';
import { ShipsSuccessComponent } from './ships-success/ships-success.component';
import { ShipsAddEditComponent } from './ships-add-edit/ships-add-edit.component';


const routes: Routes = [
  {
    path: '',
    component: ShipsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ShipsListComponent
      },
      {
        path: 'success',
        component: ShipsSuccessComponent
      },
      {
        path: 'add',
        component: ShipsAddEditComponent
      },
      {
        path: 'edit/:id',
        component: ShipsAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipsRoutingModule { }
