import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlProp, IFormGroup } from '@rxweb/types';
import { AuthService } from 'src/app/core/services/auth.service';
import { createRequiredControl } from 'src/app/shared/utils/generic-controls';
import { appendValidators, createCompareValidator, createMinLengthValidator } from 'src/app/shared/validators/generic-validators';
import {SignupModel} from "../../core/models/signup.model";
import {handleError} from "../../shared/utils/error-handling.function";
import {handleSuccess} from "../../shared/utils/success-handling.function";
import {LoaderOrchestratorService} from "../../core/services/loader-orchestrator.service";
import {BehaviorSubject} from "rxjs";

@Component({
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {
    public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.resetPassword();
    }
  token: string | null;

  formGroup = new UntypedFormGroup(<ControlProp<any>>{
    password: appendValidators(createRequiredControl(), createMinLengthValidator(8)),
    confirmPassword: appendValidators(createRequiredControl(), createCompareValidator('password'))
  }) as IFormGroup<any>;

  constructor(private readonly authService: AuthService,
              private readonly router: Router,
              private readonly route: ActivatedRoute,
              private loaderService: LoaderOrchestratorService,
              private readonly snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
      this.route.paramMap.subscribe((params) => this.token = params.get("token"));
   // this.route.queryParams.subscribe(({ token }) => this.token = token);
  }



    resetPassword(): void {
        if (this.formGroup.valid) {
            this.formGroup.disable();
            this.isLoading$.next(true);
            this.authService.resetPassword({...this.formGroup.value, token: this.token }).subscribe({
                next: (response) => {
                    this.router.navigate(
                        ['../../sign-in'], { relativeTo: this.route }
                    )
                        .then(() => {
                            handleSuccess(this.snackBar, response.data.attributes, this.isLoading$)
                            this.loaderService.hideLoader()
                        })
                }, error: (body) => {
                    //  console.log(body.data.attributes.message);
                    this.formGroup.enable();
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
  //   this.authService.resetPassword({...this.formGroup.value, token: this.token }).subscribe(() => {
  //     this.snackBar.open('Reset link has been sent on email!', 'Close', {
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
