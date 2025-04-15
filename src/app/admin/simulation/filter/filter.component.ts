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
                this.tenants = response.map((item: any) => item.attributes);
                console.log('Tenants:', this.tenants);
            },
            error: (error) => console.error('Tenants:', error),
        });
    }

    selectTenant(value: string) {
        this.isSelectedTenant$.next(value === 'Select Tenant');
    }

    initForm() {
        this.queueForm = this.fb.group({
            parameterTenantId: [null, [...createRequiredValidators()]],
        });
    }

    startSimulation(tenantId: number | null) {
        let data = {
            "queue": {
                "parameterTenantId": tenantId
            }
        };
        return this.simulationService.simulation(data);
    }

    checkSimulationProgress() {
        const payload = {
            queue: {
                queueSimulationStatus: 'PROBABLE_CASE',
            },
          };
        return this.simulationService.checkSimulationProgress(payload);
    }

    next() {
        this.isLoading$.next(true);
        let tenantId = this.queueForm.get('parameterTenantId')?.value;
        if (tenantId !== null && tenantId !== undefined) {
            tenantId = tenantId.toString();
        } else {
            tenantId = '';
        }

        this.startSimulation(tenantId).subscribe({
            next: (res) => {
                console.log('Simulation started successfully:', res);
                this.isLoading$.next(false);
                this.isCheckingProgress$.next(true);
                this.pollSimulationProgress(); // Start polling
            },
            error: (err) => {
                console.error('Simulation error:', err);
                this.isLoading$.next(false);
            },
        });
    }

    pollSimulationProgress() {
        this.progressSubscription = interval(30000) // Poll every 5 seconds
            .pipe(
                takeUntil(this.stopPolling$), // Stop polling when completed or destroyed
                switchMap(() => this.checkSimulationProgress())
            )
            .subscribe({
                next: (response) => {
                    this.simulationProgress = response;
                    console.log('Simulation Progress:', response);

                    if (response?.data?.attributes?.simulationStatus === "completed") {
                        this.isCheckingProgress$.next(false);
                        this.stopPolling$.next(); // Stop polling
                        this.router.navigate(['../showcase'], {
                            relativeTo: this.route,
                            queryParams: { 
                                tenantId: this.queueForm.get('parameterTenantId')?.value 
                            },
                        });
                    }
                },
                error: (error) => {
                    console.error('Error checking simulation progress:', error);
                    this.isCheckingProgress$.next(false);
                    this.stopPolling$.next(); // Stop polling on error
                }
            });
    }
}
