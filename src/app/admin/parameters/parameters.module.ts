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
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ParametersRoutingModule } from './parameters-routing.module';
import { TenantsComponent } from './tenants/tenants.component';
import { BookingComponent } from './booking/booking.component';
import { ParametersComponent } from './parameters.component';
import { ParametersQueueComponent } from './parameters-queue/parameters-queue.component';
import { AccessPointsComponent } from './access-points/access-points.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TenantsImportModalComponent } from './tenants/tenants-import-modal/tenants-import-modal.component';
import { BookingImportModalComponent } from './booking/booking-import-modal/booking-import-modal.component';


@NgModule({
  declarations: [
    ParametersComponent,
    AccessPointsComponent,
    TenantsComponent,
    TenantsImportModalComponent,
    BookingComponent,
    BookingImportModalComponent,
    ParametersQueueComponent,
  ],
  imports: [
    CommonModule,
    ParametersRoutingModule,
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
    MatInputModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class ParametersModule { }
