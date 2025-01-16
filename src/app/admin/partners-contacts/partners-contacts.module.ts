import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnersContactsRoutingModule } from './partners-contacts-routing.module';
import { PartnersContactsListComponent } from './partners-contacts-list/partners-contacts-list.component';
import { PartnersContactsAddEditComponent } from './partners-contacts-add-edit/partners-contacts-add-edit.component';
import { PartnersContactsDeleteModalComponent } from './partners-contacts-delete-modal/partners-contacts-delete-modal.component';
import { PartnersContactsSuccessComponent } from './partners-contacts-success/partners-contacts-success.component';
import { NoPartnersContactsComponent } from './no-partners-contacts/no-partners-contacts.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PartnersContactsComponent } from './partners-contacts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    PartnersContactsComponent,
    PartnersContactsListComponent,
    PartnersContactsAddEditComponent,
    PartnersContactsDeleteModalComponent,
    PartnersContactsSuccessComponent,
    NoPartnersContactsComponent
  ],
  imports: [
    CommonModule,
    PartnersContactsRoutingModule,
    NgScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialPanelTableModule,
    SearchbarModule,
    SharedModule,
    MatAutocompleteModule,
    FontAwesomeModule
  ]
})
export class PartnersContactsModule { }
