import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { FilterComponent } from './filter/filter.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { SimulationRoutingModule } from './simulation-routing.module';
import { ShowcaseTabsComponent } from './showcase/showcase-tab/showcase-tab.component';
import { SimulationComponent } from './simulation.component';


@NgModule({
  declarations: [
    SimulationComponent,
    FilterComponent,
    ShowcaseComponent,
    ShowcaseTabsComponent,
  ],
  imports: [
    CommonModule,
    SimulationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgScrollbarModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialPanelTableModule,
    SearchbarModule,
    SharedModule,
    FontAwesomeModule,
    MatSnackBarModule,
     MatInputModule,
      MatTableModule,
      MatProgressSpinnerModule
  ],
})
export class SimulationModule { }
