import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from "./admin.component";
import { AdminHeaderComponent } from "./layout/header/admin-header.component";
import { AdminLayoutComponent } from "./layout/admin/admin-layout.component";
import { NavigationMenuComponent } from "./layout/navigation-menu/navigation-menu.component";
import { CdkMenuModule } from "@angular/cdk/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatBadgeModule } from "@angular/material/badge";
import { MatDialogModule } from "@angular/material/dialog";
import { RolePipesModule } from "../core/pipes/role-pipes.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SearchbarModule } from "../shared/components/searchbar/searchbar.component";
import { SharedModule } from "../shared/shared.module";
import { AssetsProviderService } from "../core/services/assets-provider.service";
import { LoaderOrchestratorService } from "../core/services/loader-orchestrator.service";
import { CredentialsGuard } from "../core/guards/credentials.guard";
import { LineChartModule, PieChartModule } from "@swimlane/ngx-charts";
import { StatisticCardV2Module } from "../shared/components/cards/statistic-card-v2/statistic-card-v2.component";
import { CardModule } from "../shared/components/cards/card.module";
import {MatMenuModule} from "@angular/material/menu";
import {HttpClientModule} from "@angular/common/http";
import {TranslateModule} from "@ngx-translate/core";
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HomeComponent } from './home/home.component';
import { MaterialPanelTableModule } from '../shared/components/tables/material-panel-table/material-panel-table.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';
import { QueueComponent } from './queue/queue.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ReportsComponent } from './reports/reports.component';
import { RouterModule } from '@angular/router';





@NgModule({
    declarations: [
        AdminComponent,
        AdminHeaderComponent,
        NavigationMenuComponent,
        AdminLayoutComponent,
        HomeComponent,
        QueueComponent,
        ReportsComponent,
    ],
    providers: [
        AssetsProviderService,
        LoaderOrchestratorService,
        CredentialsGuard,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        CdkMenuModule,
        MatSnackBarModule,
        FormsModule,
        MatBadgeModule,
        MatDialogModule,
        RolePipesModule,
        StatisticCardV2Module,
        CardModule,
        FontAwesomeModule,
        SearchbarModule,
        SharedModule,
        LineChartModule,
        PieChartModule,
        HttpClientModule,
        TranslateModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatTableModule,
        CdkTableModule,
        MatCheckboxModule,
        MaterialPanelTableModule,
        NgScrollbarModule,
        NgScrollbarReachedModule,
        MatSliderModule,
        MatProgressBarModule,
        RouterModule
    ]
})
export class AdminModule { }
