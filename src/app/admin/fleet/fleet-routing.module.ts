import { NgModule } from "@angular/core";
import { FleetComponent } from "./fleet.component";
import { RouterModule, Routes } from "@angular/router";
import { AddFleetComponent } from "./add-fleet/add-fleet.component";

const routes: Routes = [
    {
      path: '',
      component: FleetComponent,
      children: [
        {
          path: '',
          redirectTo: 'add-fleet',
          pathMatch: 'full'
        },
        {
          path: 'add-fleet',
          component: AddFleetComponent,
        },
        {
            path: 'vehicles',
            loadChildren: () => import('./vehicles/vehicles.module').then(m => m.VehiclesModule),
          },
        {
            path: 'ships',
            loadChildren: () => import('./ships/ships.module').then(m => m.ShipsModule),
          },
        {
            path: 'railways',
            loadChildren: () => import('./trains/trains.module').then(m => m.TrainsModule),
          },
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class FleetRoutingModule { }