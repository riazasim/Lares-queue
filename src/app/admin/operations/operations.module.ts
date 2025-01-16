import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationsRoutingModule } from './operations-routing.module';
import { OperationsComponent } from './operations.component';
import { OperationsListComponent } from './operations-list/operations-list.component';
import { OperationsAddEditComponent } from './operations-add-edit/operations-add-edit.component';
import { OperationsSuccessComponent } from './operations-success/operations-success.component';
import { OperationsDeleteModalComponent } from './operations-delete-modal/operations-delete-modal.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NoOperationsComponent } from './no-operations/no-operations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OperationsComponent,
    OperationsListComponent,
    OperationsAddEditComponent,
    OperationsSuccessComponent,
    OperationsDeleteModalComponent,
    NoOperationsComponent
  ],
  imports: [
    CommonModule,
    OperationsRoutingModule,
    NgScrollbarModule,
    ReactiveFormsModule,
    FormsModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialPanelTableModule,
    SearchbarModule,
    SharedModule,
    FontAwesomeModule
  ]
})
export class OperationsModule { }
