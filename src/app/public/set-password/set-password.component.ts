import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlProp, IFormGroup } from '@rxweb/types';
import { AuthService } from 'src/app/core/services/auth.service';
import { createRequiredControl } from 'src/app/shared/utils/generic-controls';
import { appendValidators, createCompareValidator, createMinLengthValidator } from 'src/app/shared/validators/generic-validators';
import {BehaviorSubject} from "rxjs";
import {SignupModel} from "../../core/models/signup.model";
import {handleError} from "../../shared/utils/error-handling.function";
import {LoaderOrchestratorService} from "../../core/services/loader-orchestrator.service";
import {handleSuccess} from "../../shared/utils/success-handling.function";

@Component({
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetPasswordComponent implements OnInit {
    public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.setPassword();
    }
  token: string | null;

    setPasswordForm: UntypedFormGroup = new UntypedFormGroup({
        password: appendValidators(createRequiredControl(), createMinLengthValidator(8)),
        confirmPassword: appendValidators(createRequiredControl(), createCompareValidator('password'))
    })


  constructor(private readonly authService: AuthService,
              private readonly router: Router,
              private readonly route: ActivatedRoute,
              private loaderService: LoaderOrchestratorService,
              private readonly snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
      this.route.paramMap.subscribe((params) => {
        this.token = params.get('token');
        // console.log(this.token);
          return this.token;

      });
  }

  setPassword(): void {
     if (this.setPasswordForm.valid) {
        this.setPasswordForm.disable();
        this.isLoading$.next(true);
        this.authService.setPassword({...this.setPasswordForm.value, token: this.token }).subscribe({
            next: (response) => {
                this.router.navigate(
                    ['../../sign-in'], { relativeTo: this.route }
                )
                    .then(() => {
                        // this.snackBar.open("Password has been successfully setup.", "Close", {
                        //     duration: 3000,
                        //     horizontalPosition: 'end',
                        //     panelClass: ['success-snackbar'],
                        //     verticalPosition: 'bottom',
                        // });
                        handleSuccess(this.snackBar, response.attributes, this.isLoading$)
                        this.loaderService.hideLoader()
                    })
            }, error: (body) => {
                //  console.log(body.data.attributes.message);
                this.setPasswordForm.enable();
                handleError(this.snackBar, body, this.isLoading$)
            }});
     }else {
         //alert('Error');
     }
  }


  // submit(): void {
  //   if (!this.token) {
  //     return;
  //   }
  //   this.authService.setPassword({...this.formGroup.value, token: this.token }).subscribe(() => {
  //     this.snackBar.open('Password has been successfully setup.', 'Close', {
  //       duration: 3000
  //     })
  //     this.router.navigate(['../sign-in'], { relativeTo: this.route });
  //   }, (body) => {
  //     this.snackBar.open(body?.error?.error?.detail, 'Close', {
  //       duration: 3000
  //     })
  //   });
  // }
}
