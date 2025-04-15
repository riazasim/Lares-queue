import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametersComponent } from './parameters.component';
import { AccessPointsComponent } from './access-points/access-points.component';
import { TenantsComponent } from './tenants/tenants.component';
import { BookingComponent } from './booking/booking.component';
import { ParametersQueueComponent } from './parameters-queue/parameters-queue.component';


const routes: Routes = [
  {
    path: '',
    component: ParametersComponent,
    //  children: [
    //       {
    //         path: '',
    //         redirectTo: 'access-points',
    //         pathMatch: 'full'
    //       },
    //       {
    //         path: 'access-points',
    //         component: AccessPointsComponent
    //       },
    //       {
    //         path: 'tenants',
    //         component: TenantsComponent
    //       },
    //       {
    //         path: 'booking',
    //         component: BookingComponent
    //       },
    //       {
    //         path: 'parameters-queue',
    //         component: ParametersQueueComponent
    //       },
    //     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametersRoutingModule { }
