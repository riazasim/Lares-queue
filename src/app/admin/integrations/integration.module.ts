import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrationComponent } from './integration.components';
import { IntegrationListComponent } from './integration-list/integration-list.component';
import { IntegrationSuccessComponent } from './integration-success/integration-success.component';
import { NoIntegrationComponent } from './no-integration/no-integration.component';
import { IntegrationDeleteModalComponent } from './integration-delete-modal/integration-delete-modal.component';
import { IntegrationAddEditComponent } from './integration-add-edit/integration-add-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { IntegrationRoutingModule } from './integration-routing.module';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { MatSortModule } from '@angular/material/sort';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FeatureModulesModule } from 'src/app/shared/feature-modules/feature-modules.module';



@NgModule({
  declarations: [
    IntegrationComponent,
    IntegrationListComponent,
    NoIntegrationComponent,
    IntegrationSuccessComponent,
    IntegrationDeleteModalComponent,
    IntegrationAddEditComponent

  ],
  imports: [
    CommonModule,
    IntegrationRoutingModule,
    SharedModule,
    FontAwesomeModule,
    TranslateModule,
    MaterialPanelTableModule,
    MatSortModule,
    NgScrollbarModule,
    SearchbarModule,
    MatTooltipModule,
    MatTableModule,
    CdkTableModule,
    MatStepperModule,
    ReactiveFormsModule,
    FeatureModulesModule,
    ClipboardModule
]
})
export class IntegrationModule { }
