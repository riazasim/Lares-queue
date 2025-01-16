import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageTemplateRoutingModule } from './message-template-routing.module';
import { MessageTemplateListComponent } from './message-template-list/message-template-list.component';
import { MessageTemplateAddEditComponent } from './message-template-add-edit/message-template-add-edit.component';
import { MessageTemplateDeleteModalComponent } from './message-template-delete-modal/message-template-delete-modal.component';
import { MessageTemplateSuccessComponent } from './message-template-success/message-template-success.component';
import { MessageTemplateComponent } from './message-template.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NoMessageTemplateComponent } from './no-message-template/no-message-template.component';
import { MessageTemplateMenuComponent } from './message-template-menu/message-template-menu.component';
import { MessageTemplateConditionsComponent } from './message-template-conditions/message-template-conditions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageTemplateAddEditStepperComponent } from './message-template-add-edit-stepper/message-template-add-edit-stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    MessageTemplateListComponent,
    MessageTemplateAddEditComponent,
    MessageTemplateDeleteModalComponent,
    MessageTemplateSuccessComponent,
    MessageTemplateComponent,
    NoMessageTemplateComponent,
    MessageTemplateMenuComponent,
    MessageTemplateConditionsComponent,
    MessageTemplateAddEditStepperComponent
  ],
  imports: [
    CommonModule,
    MessageTemplateRoutingModule,
    NgScrollbarModule,
    ReactiveFormsModule,
    FormsModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialPanelTableModule,
    MatSnackBarModule,
    SearchbarModule,
    SharedModule,
    FontAwesomeModule,
    CdkStepperModule,
  ],
})
export class MessageTemplateModule { }
