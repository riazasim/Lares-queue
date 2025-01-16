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
import { ShipsRoutingModule } from './ships-routing.module';
import { ShipsComponent } from './ships.component';
import { NoShipsComponent } from './no-ships/no-ships.component';
import { ShipsAddEditComponent } from './ships-add-edit/ships-add-edit.component';
import { ShipsDeleteModalComponent } from './ships-delete-modal/ships-delete-modal.component';
import { ShipsListComponent } from './ships-list/ships-list.component';
import { ShipsSuccessComponent } from './ships-success/ships-success.component';


@NgModule({
  declarations: [
    ShipsComponent,
    ShipsAddEditComponent,
    ShipsListComponent,
    ShipsDeleteModalComponent,
    ShipsSuccessComponent,
    NoShipsComponent,
  ],
  imports: [
    CommonModule,
    ShipsRoutingModule,
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
      MatProgressSpinnerModule
  ]
})
export class ShipsModule { }
