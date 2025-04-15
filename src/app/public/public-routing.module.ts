import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import {SetPasswordComponent} from "./set-password/set-password.component";

const routes: Routes = [
  {
    path: '', component: PublicComponent,
    children: [
       { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: 'sign-in', component: LoginComponent },
      { path: 'sign-up', component: RegisterComponent },
      { path: 'setPassword/:token', component: SetPasswordComponent},
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'resetPassword/:token', component: ResetPasswordComponent},

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
