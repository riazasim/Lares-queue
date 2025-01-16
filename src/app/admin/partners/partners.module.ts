import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnersRoutingModule } from './partners-routing.module';
import { PartnersComponent } from './partners.component';
import { PartnersListComponent } from './partners-list/partners-list.component';
import { PartnersAddEditComponent } from './partners-add-edit/partners-add-edit.component';
import { PartnersDeleteModalComponent } from './partners-delete-modal/partners-delete-modal.component';
import { NoPartnersComponent } from './no-partners/no-partners.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PartnersSuccessComponent } from './partners-success/partners-success.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HasPartnerDockAccessPipe } from 'src/app/core/pipes/has-partner-dock-access.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    PartnersComponent,
    PartnersListComponent,
    PartnersAddEditComponent,
    PartnersDeleteModalComponent,
    NoPartnersComponent,
    PartnersSuccessComponent,
    HasPartnerDockAccessPipe
  ],
  imports: [
    CommonModule,
    PartnersRoutingModule,
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
export class PartnersModule { }
