import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import {BehaviorSubject} from "rxjs";
import {handleSuccess} from "../../shared/utils/success-handling.function";
import {handleError} from "../../shared/utils/error-handling.function";
import {LoaderOrchestratorService} from "../../core/services/loader-orchestrator.service";
import { createEmailValidator, createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  formGroup: UntypedFormGroup;
  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


    @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.forgotPassword();
    }

  constructor(
              readonly fb: UntypedFormBuilder,
              private readonly authService: AuthService,
              private readonly router: Router,
              private loaderService: LoaderOrchestratorService,
              private readonly route: ActivatedRoute,
              private readonly snackBar: MatSnackBar
  ) {
    this.formGroup = fb.group({
      email: ['', [...createRequiredValidators(), ...createEmailValidator()]]
    });
  }

    forgotPassword(): void {
        this.formGroup.disable();
        this.isLoading$.next(true)
        this.authService.forgotPassword(this.formGroup.value.email).subscribe({
            next: (response) => {
                this.router.navigate(['../sign-in'], { relativeTo: this.route })
                    .then(() => {
                        // this.snackBar.open("Login success!", "", {
                        //   duration: 3000,
                        //   horizontalPosition: 'end',
                        //   panelClass: ['success-snackbar'],
                        //   verticalPosition: 'bottom',
                        // });
                        handleSuccess(this.snackBar, response.attributes, this.isLoading$)
                        this.loaderService.hideLoader()
                    })
            }, error: (body) => {
                //  console.log(body.data.attributes.message);
                this.formGroup.enable();
                handleError(this.snackBar, body, this.isLoading$)
            }});
    }


  // forgotPassword() {
  //   this.isLoading = true;
  //   this.authService.forgotPassword(this.formGroup.value.email).subscribe(() => {
  //     this.snackBar.open('Email sent!', 'Close', {
  //       duration: 3000
  //     })
  //     this.router.navigate(['../sign-in'], { relativeTo: this.route });
  //   })
  // }
}
