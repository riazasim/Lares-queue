import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { PublicComponent } from './public.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoaderOrchestratorService } from '../core/services/loader-orchestrator.service';
import { AssetsProviderService } from '../core/services/assets-provider.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatRippleModule} from "@angular/material/core";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';


@NgModule({
  declarations: [
    OnboardingComponent,
    RegisterComponent,
    LoginComponent,
    PublicComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    SetPasswordComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        PublicRoutingModule,
        SharedModule,
        FontAwesomeModule,
        MatRippleModule,
        NgxMaskDirective, 
        NgxMaskPipe,
    ],
  providers: [ provideNgxMask(), NgxMaskPipe,LoaderOrchestratorService, AssetsProviderService],
})
export class PublicModule { }
