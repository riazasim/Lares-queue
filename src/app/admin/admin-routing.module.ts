import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from "./admin.component";
import { HomeComponent } from './home/home.component';
import { ParametersComponent } from './parameters/parameters.component';
import { QueueComponent } from './queue/queue.component';
import { ReportsComponent } from './reports/reports.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'queue',
        component: QueueComponent
      },
      {
        path: 'reports',
        component: ReportsComponent
      },
      {
        path: 'parameters',
        loadChildren: () => import('./parameters/parameters.module').then(m => m.ParametersModule),
      },
      {
        path: 'simulation',
        loadChildren: () => import('./simulation/simulation.module').then(m => m.SimulationModule),
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
