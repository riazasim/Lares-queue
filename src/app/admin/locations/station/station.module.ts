import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StationRoutingModule } from './station-routing.module';
import { StationComponent } from './station.component';
import { StationListComponent } from './station-list/station-list.component';
import { StationAddEditComponent } from './station-add-edit/station-add-edit.component';
import { StationDeleteModalComponent } from './station-delete-modal/station-delete-modal.component';
import { NoStationComponent } from './no-station/no-station.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StationSuccessComponent } from './station-success/station-success.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    StationComponent,
    StationListComponent,
    StationAddEditComponent,
    StationDeleteModalComponent,
    NoStationComponent,
    StationSuccessComponent,
  ],
  imports: [
    CommonModule,
    StationRoutingModule,
    NgScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialPanelTableModule,
    SearchbarModule,
    SharedModule,
    FontAwesomeModule,
    MatSlideToggleModule
  ]
})
export class StationModule { }
