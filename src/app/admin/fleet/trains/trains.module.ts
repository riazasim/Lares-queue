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
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { MatChipsModule } from '@angular/material/chips';
import { TrainsComponent } from './trains.component';
import { TrainsAddEditComponent } from './trains-add-edit/trains-add-edit.component';
import { TrainsListComponent } from './trains-list/trains-list.component';
import { TrainsDeleteModalComponent } from './trains-delete-modal/trains-delete-modal.component';
import { TrainsSuccessComponent } from './trains-success/trains-success.component';
import { TrainsRoutingModule } from './trains-routing.module';
import { NoTrainsComponent } from './no-trains/no-trains.component';


@NgModule({
  declarations: [
    TrainsComponent,
    TrainsAddEditComponent,
    TrainsListComponent,
    TrainsDeleteModalComponent,
    TrainsSuccessComponent,
    NoTrainsComponent,
  ],
  imports: [
    CommonModule,
    TrainsRoutingModule,
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
export class TrainsModule { }
