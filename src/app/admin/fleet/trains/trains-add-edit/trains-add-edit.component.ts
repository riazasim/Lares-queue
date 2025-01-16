import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { FormGroup, UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { TrainsService } from 'src/app/core/services/trains.service';
import { TrainModel } from 'src/app/core/models/trains.model';

@Component({
    selector: "app-trains-add-edit",
    templateUrl: './trains-add-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    // styleUrls: ['./trains-add.component.scss']
})
export class TrainsAddEditComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    trainForm: FormGroup;
    type: any
    trainsType = [
        { id: 1, name: 'Locomotive', value: 'LOCOMOTIVE' },
        { id: 2, name: 'Wagon', value: 'WAGON' },
    ]
    locomotiveTypes = [
        { id: 1, name: 'Locomotive', value: 'LOCOMOTIVE' },
        { id: 2, name: 'Locomotive2', value: 'LOCOMOTIVE2' },
    ]
    id: number;
    appliedFilters: any = {};
    constructor(private readonly fb: UntypedFormBuilder,
        private readonly trainsService: TrainsService,
        private readonly cd: ChangeDetectorRef,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private snackBar : MatSnackBar) {
        this.subscribeForQueryParams();
    }

    subscribeForQueryParams(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            this.trainsService.get(this.id).subscribe(response => {
                // console.log(response)
                this.initForm(response);
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    typeChanged(ev:any){
        this.type = ev.target.value;
        this.cd.detectChanges();
    }

    applyFilter(target: any, column: string): void {
        if (typeof target.value !== 'object' && (target.value || typeof target.value === 'boolean')) {
            this.appliedFilters[column] = target.value;
        } else {
            delete this.appliedFilters[column];
        }
    }

    initForm(data: TrainModel = <TrainModel>{}): void {
        this.trainForm = this.fb.group({
            //locomotiveId: this.fb.control(data?.id),
            name: this.fb.control(data?.name || ''),
            registrationNumber: this.fb.control(data?.registrationNumber || '', [...createRequiredValidators()]),
            type: this.fb.control(data?.type || '', [...createRequiredValidators()]),
            locomotiveType: this.fb.control(data?.locomotiveType || ''),
            status: this.fb.control(data?.status || '', [...createRequiredValidators()]),
        });
    }

    saveVehicle(): void {
        this.isLoading$.next(true);
        if (this.id) {
            this.trainsService.edit(this.id, this.parseData(this.trainForm.value)).subscribe({
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
            this.trainsService.create(this.parseData(this.trainForm.value)).subscribe({
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

    private parseData(data: TrainModel): TrainModel {
        if (!data.locomotiveId) delete data.locomotiveId;
        return data;
    }
}
