import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageAutomationsRoutingModule } from './message-automations-routing.module';
import { MessageAutomationsComponent } from './message-automations.component';
import { MessageAutomationsListComponent } from './message-automations-list/message-automations-list.component';
import { NoMessageAutomationsComponent } from './no-message-automations/no-message-automations.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    MessageAutomationsComponent,
    MessageAutomationsListComponent,
    NoMessageAutomationsComponent
  ],
  imports: [
    CommonModule,
    MessageAutomationsRoutingModule,
    NgScrollbarModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialPanelTableModule,
    SearchbarModule,
    SharedModule,
    FontAwesomeModule
  ]
})
export class MessageAutomationsModule { }
