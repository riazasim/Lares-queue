import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderOrchestratorService } from '../../core/services/loader-orchestrator.service';
import { BehaviorSubject, merge } from 'rxjs';
import { environment } from 'src/environments/environment';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { handleSuccess } from "../../shared/utils/success-handling.function";
import { createEmailValidator, createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { OrganizationService } from 'src/app/core/services/organization.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
    public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.sigIn();
    }
    username = new FormControl('', [...createRequiredValidators(), Validators.email]);

    loginForm: UntypedFormGroup = new UntypedFormGroup({
        username: new UntypedFormControl(null, [...createRequiredValidators(), Validators.email]),
        password: new UntypedFormControl(null, [...createRequiredValidators(), Validators.pattern('')]),
    })
    constructor(private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly snackBar: MatSnackBar,
        private readonly auth: AuthService,
        private loaderService: LoaderOrchestratorService,
        private readonly rolesService: RolesService,
        private ref: ChangeDetectorRef,
        private organizationService: OrganizationService,
    ) {
        this.preCompleteSignIn();
    }
    preCompleteSignIn(): void {
        const user = this.auth.getAuth();

        if (user) {
            // console.log(user)
            this.router.navigate(['../operator/dashboard'], { relativeTo: this.route });
            return;
        }

        if (!environment.production) {
            this.loginForm = new UntypedFormGroup({
                username: new UntypedFormControl('transport@lowis.ro', [...createRequiredValidators(), ...createEmailValidator()]),
                password: new UntypedFormControl('12345678', [...createRequiredValidators(), Validators.pattern('')]),
            })
        }
    }

    sigIn(): void {
        this.loginForm.disable();
        this.isLoading$.next(true);
        const isTutorialTrue = localStorage.getItem('tutorial') === 'true';
        this.auth.signin(this.loginForm.getRawValue()).subscribe({
            next: (response) => {
                this.auth.saveAuth(response);
                localStorage.setItem("userName" , response.user)
                this.rolesService.setAuthRoles([response.roles]);
                this.rolesService.setUserRoles([response.roles]);
                this.organizationService.setAppMode(response?.transportModeSetting?.transportMode || "");
                // this.router.navigate(
                //                                          ////operator/dashboard
                //     [isTutorialTrue ? '/admin' : '../admin/dashboard'], { relativeTo: this.route }
                // )
                //   .then(() => {
                this.router.navigate(['../operator/dashboard'], { relativeTo: this.route }).then(() => {
                    this.loginForm.enable();
                    // this.snackBar.open("Login success!", "", {
                    //   duration: 3000,
                    //   horizontalPosition: 'end',
                    //   panelClass: ['success-snackbar'],
                    //   verticalPosition: 'bottom',
                    // });
                    handleSuccess(this.snackBar, response, this.isLoading$);
                    this.loaderService.hideLoader();
                })
            }, error: (body) => {
                //  console.log(body.data.attributes.message);
                this.loginForm.enable()
                handleError(this.snackBar, body, this.isLoading$);
            }
        });
    }

}
