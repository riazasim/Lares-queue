import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoVehiclesComponent } from './no-vehicles/no-vehicles.component';
import { VehiclesRoutingModule } from "./vehicles-routing.module";
import { VehiclesAddEditComponent } from "./vehicles-add-edit/vehicles-add-edit.component";
import { VehiclesListComponent } from "./vehicles-list/vehicles-list.component";
import { VehiclesDeleteModalComponent } from "./vehicles-delete-modal/vehicles-delete-modal.component";
import { VehiclesSuccessComponent } from "./vehicles-success/vehicles-success.component";
import { VehiclesComponent } from "./vehicles.component";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [
    VehiclesComponent,
    VehiclesAddEditComponent,
    VehiclesListComponent,
    VehiclesDeleteModalComponent,
    VehiclesSuccessComponent,
    NoVehiclesComponent,
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgScrollbarModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialPanelTableModule,
    SearchbarModule,
    SharedModule,
    FontAwesomeModule,
    MatSnackBarModule,
    MatChipsModule,

      MatInputModule,
      MatTableModule,
      MatProgressSpinnerModule
  ]
})
export class VehiclesModule { }
