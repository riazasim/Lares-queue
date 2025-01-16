import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortListComponent } from './port-list/port-list.component';
import { PortComponent } from './port.component';

const routes: Routes = [
  {
    path: '',
    component: PortComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: PortListComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortRoutingModule { }
