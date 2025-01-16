import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from "rxjs";
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { VehicleModel } from 'src/app/core/models/vehicle.model';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
    selector: "app-vehicles-add-edit",
    templateUrl: './vehicles-add-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    // styleUrls: ['./vehicles-add.component.scss']
})
export class VehiclesAddEditComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    vehicleForm: FormGroup;
    VehicleTypeEnum: string[] = ['Truck', 'Trailer'];
    id: number;
    displayedColumns: string[] = ['licensePlate', 'type', 'status', 'loadingCapacity'];
    appliedFilters: any = {};
    constructor(private readonly fb: UntypedFormBuilder,
        private readonly vehicleService: VehicleService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private snackBar : MatSnackBar) {
        this.subscribeForQueryParams();
    }

    subscribeForQueryParams(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            combineLatest([
                this.vehicleService.get(this.id)
            ]).subscribe(([vehicle]: [VehicleModel]) => {
                this.initForm(vehicle);
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
            /*this.dockService.list({}).subscribe((response: DockModel[]) => {
              this.originalSource = response;
              this.docks$.next(response);
              this.initForm();
              this.isLoading$.next(false);
            });*/
        }
    }

    applyFilter(target: any, column: string): void {
        if (typeof target.value !== 'object' && (target.value || typeof target.value === 'boolean')) {
            this.appliedFilters[column] = target.value;
        } else {
            delete this.appliedFilters[column];
        }
    }

    initForm(data: VehicleModel = <VehicleModel>{}): void {
        this.vehicleForm = this.fb.group({
            //vehicleId: this.fb.control(data?.id),
            licensePlate: this.fb.control(data?.licensePlate || '', [...createRequiredValidators()]),
            type: this.fb.control(data?.type || '', [...createRequiredValidators()]),
            status: this.fb.control(data?.status || '', [...createRequiredValidators()]),
            loadingCapacity: this.fb.control(data?.loadingCapacity || '', [...createRequiredValidators()]),
            // loading_capacities: this.fb.control(data?.loading_capacities|| [], [...createRequiredValidators()]),
        });
    }

    saveVehicle(): void {
        this.isLoading$.next(true);
        if (this.id) {
            this.vehicleService.edit(this.id, this.parseData(this.vehicleForm.value)).subscribe({
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
            this.vehicleService.create(this.parseData(this.vehicleForm.value)).subscribe({
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

    private parseData(data: VehicleModel): VehicleModel {
        if (!data.vehicleId) delete data.vehicleId;
        return data;
    }
}
