import { NgModule } from "@angular/core";
import { FleetComponent } from "./fleet.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgScrollbarModule } from "ngx-scrollbar";
import { CdkTableModule } from "@angular/cdk/table";
import { SharedModule } from "src/app/shared/shared.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FleetRoutingModule } from "./fleet-routing.module";
import { OperatorRoutingModule } from "src/app/operator/operator-routing.module";
import { MatBadgeModule } from "@angular/material/badge";
import { MatDialogModule } from "@angular/material/dialog";
import { RolePipesModule } from "src/app/core/pipes/role-pipes.module";
import { StatisticCardV2Module } from "src/app/shared/components/cards/statistic-card-v2/statistic-card-v2.component";
import { TranslateModule } from "@ngx-translate/core";
import { CardModule } from "src/app/shared/components/cards/card.module";
import { SearchbarModule } from "src/app/shared/components/searchbar/searchbar.component";
import { LineChartModule, PieChartModule } from "@swimlane/ngx-charts";
import { MatMenuModule } from "@angular/material/menu";
import { CdkMenuModule } from "@angular/cdk/menu";
import { AddFleetComponent } from "./add-fleet/add-fleet.component";

@NgModule({
    declarations: [
      FleetComponent,
      AddFleetComponent,
    ],
    imports: [
      CommonModule,
      FleetRoutingModule,
      FormsModule,
      NgScrollbarModule,
      CdkTableModule,
      SharedModule,
      FontAwesomeModule,
      MatSnackBarModule,
      MatInputModule,
      MatTableModule,
      MatProgressSpinnerModule,
    OperatorRoutingModule,
    MatBadgeModule,
    MatDialogModule,
    RolePipesModule,
    StatisticCardV2Module,
    TranslateModule,
    CardModule,
    SearchbarModule,
    LineChartModule,
    PieChartModule,
    MatMenuModule,
    CdkMenuModule,
    ]
  })
  export class FleetModule { }