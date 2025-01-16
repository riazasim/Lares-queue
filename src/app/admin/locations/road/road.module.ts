import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import { RoadComponent } from './road.component';
import { RoadListComponent } from './road-list/road-list.component';
import { RoadAddEditComponent } from './road-add-edit/road-add-edit.component';
import { RoadDeleteModalComponent } from './road-delete-modal/road-delete-modal.component';
import { RoadSuccessComponent } from './road-success/road-success.component';
import { NoRoadComponent } from './no-road/no-road.component';
import { RoadImportModalComponent } from './road-import-modal/road-import-modal.component';
import { RoadRoutingModule } from './road-routing.module';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';

@NgModule({
  declarations: [
    RoadComponent,
    RoadListComponent,
    RoadAddEditComponent,
    RoadDeleteModalComponent,
    RoadSuccessComponent,
    NoRoadComponent,
    RoadImportModalComponent
  ],
    imports: [
        CommonModule,
        RoadRoutingModule,
        NgScrollbarModule,
        ReactiveFormsModule,
        FormsModule,
        CdkTableModule,
        MatPaginatorModule,
        MatSortModule,
        MaterialPanelTableModule,
        SearchbarModule,
        SharedModule,
        FontAwesomeModule,
        MatButtonToggleModule,
        MatMenuModule,
        MatTooltipModule
    ]
})
export class RoadModule { }
