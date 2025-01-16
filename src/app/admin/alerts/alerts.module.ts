import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertsRoutingModule } from './alerts-routing.module';
import { NoAlertsComponent } from "./no-alerts/no-alerts.component";
import {SharedModule} from "../../shared/shared.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {AlertAddEditComponent} from "./alert-add-edit/alert-add-edit.component";
import {MatStepperModule} from "@angular/material/stepper";


@NgModule({
  declarations: [
    NoAlertsComponent,
    AlertAddEditComponent,
  ],
  imports: [
    CommonModule,
    AlertsRoutingModule,
    SharedModule,
    FontAwesomeModule,
    MatStepperModule
  ]
})
export class AlertsModule { }
