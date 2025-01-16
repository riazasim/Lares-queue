import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from "rxjs";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ShipsService } from 'src/app/core/services/ships.service';
import { ShipModel } from 'src/app/core/models/ship.model';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
    selector: "app-ships-add-edit",
    templateUrl: './ships-add-edit.component.html',
    styles:
        `
    .mat-mdc-select-arrow-wrapper {
    height: 24px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    margin-right: 7px;
}
::ng-deep.mat-mdc-select-arrow svg {
    fill: black !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

::ng-deep div.mat-mdc-select-panel {
    scrollbar-width: none;
    padding: 8px !important;
}
::ng-deep.mat-mdc-select {
    appearance: none;
    background-color: #fff;
    border-color: #a0a0a0;
    border-width: 1px;
    border-radius: 3px;
    padding-top: 1rem;
    padding-right: 1rem;
    padding-bottom: 1rem;
    padding-left: 1rem;
    font-size: var(--form-control-font-size);
    line-height: 1.5rem;
    --tw-shadow: 0 0 #0000;
}
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipsAddEditComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    shipForm: FormGroup;
    id: number;
    search: any
    appliedFilters: any = {};

    shipTypes = [
        { id: 1, name: 'Cargo Ship' },
        { id: 2, name: 'Container Ship' },
    ]
    propulsionType = [
        { id: 1, name: 'SELF PROPELLED' },
        { id: 2, name: 'WITHOUT PROPULSION' },
    ]
    typeOfLock = [
        { id: 1, name: 'Type Of Lock1' },
        { id: 2, name: 'Type Of Lock2' },
        { id: 3, name: 'Type Of Lock3' },
    ]

    constructor(private readonly fb: UntypedFormBuilder,
        private readonly shipService: ShipsService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private snackBar: MatSnackBar) {
        this.subscribeForQueryParams();
    }

    subscribeForQueryParams(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            combineLatest([
                this.shipService.get(this.id)
            ]).subscribe(([ship]: [ShipModel]) => {
                this.initForm(ship);
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    applyFilter(target: any, column: string): void {
        if (typeof target.value !== 'object' && (target.value || typeof target.value === 'boolean')) {
            this.appliedFilters[column] = target.value;
        } else {
            delete this.appliedFilters[column];
        }
    }



    onInputChange(ev: any) {
        this.search = ev?.target?.value
    }

    initForm(data: ShipModel = <ShipModel>{}): void {
        this.shipForm = this.fb.group({
            name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
            registrationNo: this.fb.control(data?.registrationNo || '', [...createRequiredValidators()]),
            ais: this.fb.control(data?.ais || '', [...createRequiredValidators()]),
            propulsionType: this.fb.control(data?.propulsionType || '', [...createRequiredValidators()]),
            lockType: this.fb.control(data?.lockType || '', [...createRequiredValidators()]),
            length: this.fb.control(data?.length || '', [...createRequiredValidators()]),
            width: this.fb.control(data?.width || '', [...createRequiredValidators()]),
            maxDraft: this.fb.control(data?.maxDraft || '', [...createRequiredValidators()]),
            aerialGauge: this.fb.control(data?.aerialGauge || '', [...createRequiredValidators()]),
            maxCapacity: this.fb.control(data?.maxCapacity || '', [...createRequiredValidators()]),
            shipType: this.fb.control(data?.shipType || '', [...createRequiredValidators()]),
            pavilion: this.fb.control(data?.pavilion || '', [...createRequiredValidators()]),
            enginePower: this.fb.control(data?.enginePower || '', [...createRequiredValidators()]),
            shipowner: this.fb.control(data?.shipowner || '', [...createRequiredValidators()]),
        });
    }

    saveShip(): void {
        this.isLoading$.next(true);
        if (this.id) {
            this.shipService.edit(this.id, this.parseData(this.shipForm.value)).subscribe({
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
            this.shipService.create(this.parseData(this.shipForm.value)).subscribe({
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

    private parseData(data: ShipModel): ShipModel {
        if (!data.shipId) delete data.shipId;
        return data;
    }
}
