import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription, interval, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SimulationService } from 'src/app/core/services/simulation.service';
import { TenantsService } from 'src/app/core/services/tenants.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit, OnDestroy {
    isSelectedTenant$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isCheckingProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    queueForm: FormGroup;
    simulationProgress: any;
    tenants: any[] = [];
    private progressSubscription: Subscription | null = null;
    private stopPolling$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private readonly tenantsService: TenantsService,
        private readonly simulationService: SimulationService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.getTenantsList();
    }

    ngOnDestroy(): void {
        // Stop polling when the component is destroyed
        this.stopPolling$.next();
        this.stopPolling$.complete();
        if (this.progressSubscription) {
            this.progressSubscription.unsubscribe();
        }
    }

    getTenantsList() {
        this.tenantsService.getTenantsList().subscribe({
            next: (response) => {
                this.tenants = response;
            },
            error: (error) => console.error('Tenants:', error),
        });
    }

    selectTenant(value: string) {
        this.isSelectedTenant$.next(value === 'Select Tenant');
    }

    initForm() {
        this.queueForm = this.fb.group({
            tenants: [null, [...createRequiredValidators()]],
        });
    }

    startSimulation(tenantNames: string[]) {
        let data = {
            tenantNames
        };
        return this.simulationService.simulation(data);
    }


    next() {
        this.isLoading$.next(true);
        let tenantNames: string[] = []
        if (this.isSelectedTenant$.value) {
            tenantNames.push(this.queueForm.get('tenants')?.value);
        }
        else {
            this.tenants.forEach(tenant => {
                tenantNames.push(tenant.name)
            })
        }
        this.startSimulation(tenantNames).subscribe({
            next: (res) => {
                console.log('Simulation started successfully:', res);
                this.isLoading$.next(false);
                this.router.navigate(['../showcase'], {
                    relativeTo: this.route,
                });
            },
            error: (err) => {
                console.error('Simulation error:', err);
                this.isLoading$.next(false);
            },
        });
    }
}
