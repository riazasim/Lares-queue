import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortRoutingModule } from './port-routing.module';
import { PortComponent } from './port.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PortListComponent } from './port-list/port-list.component';
import { PortDeleteModalComponent } from './port-delete-modal/port-delete-modal.component';
import { NoPortComponent } from './no-port/no-port.component';


@NgModule({
  declarations: [
    PortComponent,
    PortListComponent,
    PortDeleteModalComponent,
    NoPortComponent,
  ],
  imports: [
    CommonModule,
    PortRoutingModule,
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
export class PortModule { }
