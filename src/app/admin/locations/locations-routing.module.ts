import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationsComponent } from './locations.component';
import { AddLocationComponent } from './add-location/add-location.component';

const routes: Routes = [
  {
    path: '',
    component: LocationsComponent,
    children: [
      {
        path: '',
        redirectTo: 'add-location',
        pathMatch: 'full'
      },
      {
        path: 'add-location',
        component: AddLocationComponent
      },
      {
        path: 'roads',
        loadChildren: () => import('./road/road.module').then(m => m.RoadModule),
      },
      {
        path: 'stations',
        loadChildren: () => import('./station/station.module').then(m => m.StationModule),
      },
      {
        path: 'ports',
        loadChildren: () => import('./port/port.module').then(m => m.PortModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule { }
