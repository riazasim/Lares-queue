import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { handleError } from "../../../../shared/utils/error-handling.function";
import { MatSnackBar } from "@angular/material/snack-bar";
import { createMaxLengthValidator, createMinLengthValidator, createPatternValidators, createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { StationService } from 'src/app/core/services/stations.service';
import { StationModel } from 'src/app/core/models/station.model';

@Component({
    selector: 'app-station-add-edit',
    templateUrl: './station-add-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationAddEditComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    station$: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
    stationForm: UntypedFormGroup;
    id: number;
    stationType = [
        { id: 1, name: 'Public', value: 'PUBLIC' },
        { id: 2, name: 'Private', value: 'PRIVATE' }
    ]
    constructor(private stationService: StationService,
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
            this.stationService.get(this.id).subscribe(response => {
                this.initForm(response);
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    initForm(data: StationModel = <StationModel>{}): void {
        this.stationForm = this.fb.group({
            name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
            type: this.fb.control(data?.type || '', [...createRequiredValidators()]),
            addrCity: this.fb.control(data?.addrCity || '', [...createRequiredValidators()]),
            addrCountry: this.fb.control(data?.addrCountry || '', [...createRequiredValidators()]),
            addrCounty: this.fb.control(data?.addrCounty || '', [...createRequiredValidators()]),
            addrZipCode: this.fb.control(data?.addrZipCode || '', [...createRequiredValidators()]),
            addrCoordinates: this.fb.control(data?.addrCoordinates || '', [...createRequiredValidators()]),
            contactFirstName: this.fb.control(data?.contactFirstName || '', [...createRequiredValidators()]),
            contactLastName: this.fb.control(data?.contactLastName || '', [...createRequiredValidators()]),
            contactPhone: this.fb.control(data?.contactPhone || '', [...createRequiredValidators(), ...createPatternValidators(RegExp("[-+()0-9 ]")), ...createMinLengthValidator(7), ...createMaxLengthValidator(17)]),
            contactPhoneRegionCode: this.fb.control(data?.contactPhoneRegionCode || '', [...createRequiredValidators(), ...createMaxLengthValidator(4), ...createPatternValidators(RegExp("[-+0-9 ]"))]),
            contactEmail: this.fb.control(data?.contactEmail || '', [...createRequiredValidators(), Validators.email]),
            comments: this.fb.control(data?.comments || '', []),
            imgPreview: this.fb.control(data?.imgPreview || '', []),
        });
    }


    saveStation(): void {
        this.isLoading$.next(true);
        if (this.id) {
            this.stationService.edit(this.id, this.stationForm.getRawValue()).subscribe({
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
            this.stationService.create(this.stationForm.getRawValue()).subscribe({
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

    setImgPreview(target: any, input: any): void {
        // console.log(target , input)
        if (target.files.item(0)) {
            input.value = target.files.item(0).name
            this.stationForm.get('imgPreview')?.patchValue(target.files.item(0));
        }
    }

    clearImgPreview(): void {
        const station = this.station$.value;
        if (station) {
            station.imgPreview = null as any;
        }
        this.stationForm.get('imgPreview')?.patchValue(null);
    }

    parseData(station: any): any {
        const data = { ...station };
        if (!data.imgPreview) {
            delete data.imgPreview;
        }
        return station;
    }
}
