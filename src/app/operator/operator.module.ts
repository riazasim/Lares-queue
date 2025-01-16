import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperatorRoutingModule } from './operator-routing.module';
import { OperatorComponent } from './operator.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { LineChartModule, PieChartModule } from '@swimlane/ngx-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchbarModule } from '../shared/components/searchbar/searchbar.component';
import { StatisticCardV2Module } from '../shared/components/cards/statistic-card-v2/statistic-card-v2.component';
import { OperatorHeaderComponent } from './layout/header/operator-header.component';
import { NavigationMenuComponent } from './layout/navigation-menu/navigation-menu.component';
import { OperatorLayoutComponent } from './layout/operator/opeartor-layout.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {TranslateModule} from "@ngx-translate/core";
import { GoogleMapsModule } from '@angular/google-maps';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MapComponent } from './map/map.component';
import { SearchComponent } from './map/search/search.component';
import { ActivityLogComponent } from '../shared/components/activity-log/activity-log.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TrainSearchComponent } from './map/search/train/train-search.component';



@NgModule({
  declarations: [
    OperatorComponent,
    DashboardComponent,
    OperatorHeaderComponent,
    NavigationMenuComponent,
    OperatorLayoutComponent,
    MapComponent,
    SearchComponent,
    TrainSearchComponent
  ],
    imports: [
        CommonModule,
        OperatorRoutingModule,
        SharedModule,
        LineChartModule,
        PieChartModule,
        FontAwesomeModule,
        SearchbarModule,
        StatisticCardV2Module,
        MatBadgeModule,
        MatDialogModule,
        MatSnackBarModule,
        TranslateModule,
        GoogleMapsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        SharedModule,
        MatButtonToggleModule
        
        
    ],
    exports: [MapComponent],
    providers: [],
})
export class OperatorModule { }
