import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { handleError } from "../../../shared/utils/error-handling.function";
import { MatSnackBar } from "@angular/material/snack-bar";
import { createMaxLengthValidator, createMinLengthValidator, createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { PartnerModel } from 'src/app/core/models/partner.model';
import { PartnerService } from 'src/app/core/services/partner.service';

@Component({
    selector: 'app-partners-add-edit',
    templateUrl: './partners-add-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnersAddEditComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    partnerForm: FormGroup;
    phoneForm: FormGroup;
    id: number;
    selectedPhoneRegionCode: string;
    partnerType = [
        { id: 1, name: 'Public', value: 'PUBLIC' },
        { id: 2, name: 'Private', value: 'PRIVATE' }
    ]
    status = [
        { id: 1, name: 'Active', value: true },
        { id: 2, name: 'Inactive', value: false }
    ]
    constructor(private partnerService: PartnerService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: UntypedFormBuilder,
        private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.subscribeForQueryParams();
        this.initForm();
    }

    subscribeForQueryParams(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            this.partnerService.get(this.id).subscribe(response => {
                // console.log(response)
                this.initForm(response);
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    initForm(data: PartnerModel = <PartnerModel>{}): void {
        this.phoneForm = this.fb.group({
            phone: this.fb.control(''),
            phoneRegionCode: this.fb.control(''),
        })
        this.partnerForm = this.fb.group({
            name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
            status: this.fb.control(data?.status || '', [...createRequiredValidators()]),
            addrStreet: this.fb.control(data?.addrStreet || '', [...createRequiredValidators()]),
            addrStreetNumber: this.fb.control(data?.addrStreetNumber || '', [...createRequiredValidators()]),
            addrCity: this.fb.control(data?.addrCity || '', [...createRequiredValidators()]),
            addrCounty: this.fb.control(data?.addrCounty || '', [...createRequiredValidators()]),
            addrCountry: this.fb.control(data?.addrCountry || '', [...createRequiredValidators()]),
            addrZipCode: this.fb.control(data?.addrZipCode || '', [...createRequiredValidators()]),
            contactPhone: this.fb.control(data?.contactPhone || '', [...createRequiredValidators()]),
            contactEmail: this.fb.control(data?.contactEmail || '', [...createRequiredValidators()]),
        })
    }


    saveUser(): void {
        this.isLoading$.next(true);
        if (this.id) {
            this.partnerService.edit(this.id, this.partnerForm.getRawValue()).subscribe({
                next: () => {
                    this.isLoading$.next(false)
                    this.router.navigate(['../../success'], { relativeTo: this.route });
                },
                error: (body: any) => {
                    this.isLoading$.next(false)
                    handleError(this.snackBar, body, this.isLoading$)
                }
            });
        } else {
            this.partnerService.create(this.partnerForm.getRawValue()).subscribe({
                next: () => {
                    this.isLoading$.next(false)
                    this.router.navigate(['../success'], { relativeTo: this.route });
                },
                error: (body: any) => {
                    this.isLoading$.next(false)
                    handleError(this.snackBar, body, this.isLoading$)
                }
            });
        }
    }
}
