import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject} from 'rxjs';
import { animate, transition, trigger, style } from '@angular/animations';
import { ProfileModel } from 'src/app/core/models/profile.model';
import { UserService } from 'src/app/core/services/user.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  animations: [
    trigger('slideOut', [
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ])
    ])
  ]
})
export class ProfileComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    profileForm: FormGroup;
     id: number;
     displayedColumns: string[] = ['imgLogo', 'imgCover'];
     appliedFilters: any = {};
     constructor(private readonly fb: UntypedFormBuilder,
                 private readonly route: ActivatedRoute,
                 private readonly router: Router,
                 private userService : UserService) {
                    this.initForm();
                    this.isLoading$.next(false);
     }
      initForm(data: ProfileModel = <ProfileModel>{}): void {
        this.profileForm = this.fb.group({
          imgLogo: this.fb.control(data?.imgLogo || '', [...createRequiredValidators()]),
          imgCover: this.fb.control(data?.imgCover || '', [...createRequiredValidators()]),
        });
      }

      saveProfile(): void {
        this.isLoading$.next(true);
        this.userService.setOrganization(this.profileForm.getRawValue()).subscribe(() => {
            this.isLoading$.next(false);
            this.router.navigate(['../success'], { relativeTo: this.route });
          });
      }
}
