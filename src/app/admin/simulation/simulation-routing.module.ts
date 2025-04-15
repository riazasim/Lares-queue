import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilterComponent } from './filter/filter.component';
import { SimulationComponent } from './simulation.component';
import { ShowcaseComponent } from './showcase/showcase.component';


const routes: Routes = [
  {
    path: '',
    component: SimulationComponent,
    children: [
      {
        path: '',
        redirectTo: 'filter',
        pathMatch: 'full'
      },
      {
        path: 'filter',
        component: FilterComponent
      },
      {
        path: 'showcase',
        component: ShowcaseComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulationRoutingModule { }
