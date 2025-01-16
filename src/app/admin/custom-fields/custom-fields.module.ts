import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomFieldsRoutingModule } from './custom-fields-routing.module';
import { CustomFieldsComponent } from './custom-fields.component';
import { NoCustomFieldsComponent } from './no-custom-fields/no-custom-fields.component';
import { CustomFieldsAddEditModalComponent } from './custom-fields-add-edit-modal/custom-fields-add-edit-modal.component';
import { CustomFieldsListComponent } from './custom-fields-list/custom-fields-list.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    CustomFieldsComponent,
    NoCustomFieldsComponent,
    CustomFieldsAddEditModalComponent,
    CustomFieldsListComponent,
  ],
  imports: [
    CommonModule,
    CustomFieldsRoutingModule,
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
    MatMenuModule,
    MatDialogModule
  ]
})
export class CustomFieldsModule { }
