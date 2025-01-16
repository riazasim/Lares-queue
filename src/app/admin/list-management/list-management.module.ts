import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListManagementRoutingModule } from './list-management-routing.module';
import { ListManagementComponent } from './list-management.component';
import { NoListManagementComponent } from './no-list-management/no-list-management.component';
import { ListManagementAddEditComponent } from './list-management-add-edit/list-management-add-edit.component';
import { ListManagementDeleteModalComponent } from './list-management-delete-modal/list-management-delete-modal.component';
import { ListManagementListComponent } from './list-management-list/list-management-list.component';
import { ListManagementSuccessComponent } from './list-management-success/list-management-success.component';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  MaterialPanelTableModule
} from '../../shared/components/tables/material-panel-table/material-panel-table.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SearchbarModule } from '../../shared/components/searchbar/searchbar.component';
import { CdkTableModule } from '@angular/cdk/table';
import { ListStatusComponent } from './list-status/list-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StatusAddEditComponent } from './status-add-edit/status-add-edit.component';
import { StatusDeleteModalComponent } from './status-delete-modal/status-delete-modal.component';
import { StatusSuccessComponent } from './status-success/status-success.component';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [
    ListManagementComponent,
    NoListManagementComponent,
    ListManagementAddEditComponent,
    ListManagementDeleteModalComponent,
    ListManagementListComponent,
    ListManagementSuccessComponent,
    ListStatusComponent,
    StatusAddEditComponent,
    StatusDeleteModalComponent,
    StatusSuccessComponent
  ],
  imports: [
    CommonModule,
    ListManagementRoutingModule,
    SharedModule,
    FontAwesomeModule,
    MaterialPanelTableModule,
    MatSortModule,
    NgScrollbarModule,
    SearchbarModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    DragDropModule,
    MatPaginatorModule,
    MatChipsModule
  ],
})
export class ListManagementModule { }
