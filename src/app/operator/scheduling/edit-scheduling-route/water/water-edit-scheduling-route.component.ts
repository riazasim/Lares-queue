import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { StatusListService } from 'src/app/core/services/status-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { PlanningDetailModel } from 'src/app/core/models/planning.model';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { MicroService } from 'src/app/core/services/micro.service';

@Component({
    selector: 'app-water-edit-scheduling-route',
    templateUrl: './water-edit-scheduling-route.component.html',
})
export class WaterEditSchedulingRouteComponent implements OnInit {

    planningForm: FormGroup;
    isPortsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isPortChangeLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isCompaniesLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isRoutesLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    id: number;
    search: string;
    ports: any[] = [];
    port: PlanningDetailModel;
    dateModal: Date;
    dateVal: string;
    timeVal: string;
    dateTimeVal: string;
    filterDate: Date = new Date();
    filterTime = '00:00:00'

    companies: any[] = [];
    departureZone: any[] = [];
    arrivalZone: any[] = [];

    constructor(private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly statusListStatus: StatusListService,
        private readonly snackBar: MatSnackBar,
        private readonly microService: MicroService,
    ) {
        this.retrivePorts();
    }

    ngOnInit(): void {
        this.initForm();
        this.getRoute();
    }

    formatDate(date: Date | string): string {
        let formattedDate = '';

        if (typeof date === 'string') {
            const tempDate = new Date(date);
            formattedDate = this.formatDateObject(tempDate);
        } else {
            formattedDate = this.formatDateObject(date);
        }

        return formattedDate;
    }

    private formatDateObject(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        return formattedDate;
    }

    getRoute() {
        this.id = this.route.snapshot.params['id'];
        this.planningService.get(this.id).subscribe({
            next: res => {
                const dateTimeVal = res.estimatedTimeArrival.split(" ");
                this.dateModal = new Date(dateTimeVal[0]);
                this.dateVal = dateTimeVal[0];
                this.timeVal = dateTimeVal[1];
                this.retriveCompanines(res?.departurePort || 0);
                // this.retriveZones(res?.departurePort || 0 );
                // this.retriveArrivalZones(res?.arrivalPort || 0 );
                this.initForm(res);
                this.isRoutesLoading$.next(false);
            },
            error: err => {
                this.isRoutesLoading$.next(false);
                throw err;
            }
        });
    }

    retrivePorts() {
        let data = {
            "start": 0,
            "length": 20,
            "filter": ""
        }
        this.microService.getPorts(data).subscribe({
            next: res => {
                if (res.length > 0) {
                    res?.forEach((item: any) => {
                        this.ports.push(item?.attributes);
                    });
                }
                this.isPortsLoading$.next(false)
            },
            error: err => {
                this.isPortsLoading$.next(false)
                throw err;
            }
        })
    }

    onDeparturePortChange(ev: any) {
        this.isPortChangeLoading$.next(true);
        let port: any;
        this.ports.filter((item: any) => {
            if (Number(item.id) === Number(ev.target.value)) port = item;
        })
        if (port) {
            this.planningForm.patchValue({ routingDetail: { ridCoordinates: port?.addrCoordinates } })
            // this.retriveZones(port.id);
            this.retriveCompanines(port.id);
        }
    }

    onArrivalPortChange(ev: any) {
        // this.isPortChangeLoading$.next(true);
        let port: any;
        this.ports.filter((item: any) => {
            if (Number(item.id) === Number(ev.target.value)) port = item;
        })
        // if (port) {
        //     this.retriveArrivalZones(port.id);
        // }
    }

    retriveCompanines(portId: any) {
        this.microService.getCompanies(portId).subscribe({
            next: res => {
                this.companies = [];
                if (res?.status !== 'error') {
                    res?.forEach((item: any) => {
                        this.companies.push(item?.attributes);
                    });
                }
                if (this.companies.length === 0) {
                    this.planningForm.patchValue({ company: null })
                }
                this.isCompaniesLoading$.next(false);
                this.isPortChangeLoading$.next(false);

            },
            error: err => {
                this.isCompaniesLoading$.next(false);
                this.isPortChangeLoading$.next(false);
                throw err
            }
        })
    }

    onCompaniesChange(ev: any) {
        this.planningForm.patchValue({ company: Number(ev?.target?.value) })
    }

    OnDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.dateVal = this.formatDate(filterDate);
        this.planningForm.patchValue({ estimatedTimeArrival: this.dateVal })
    }

    OnTimeChange(value: any) {
        this.timeVal = value
    }

    retrieveStatuses(): Observable<any> {
        return this.statusListStatus.listSid();
    }

    initForm(data?: PlanningDetailModel): void {
        this.planningForm = this.fb.group({
            convoyType: this.fb.control(data?.convoyType || '', [...createRequiredValidators()]),
            estimatedTimeArrival: this.fb.control(data?.estimatedTimeArrival || '', [...createRequiredValidators()]),
            // arrivalZone: this.fb.control(data?.arrivalZone || ''),
            // departureZone: this.fb.control(data?.departureZone || ''),
            departurePort: this.fb.control(data?.departurePort || '', [...createRequiredValidators()]),
            arrivalPort: this.fb.control(data?.arrivalPort || '', [...createRequiredValidators()]),
            company: this.fb.control(data?.company || null, [...createRequiredValidators()]),
            pilotCompany: this.fb.control(data?.pilotCompany || '', [...createRequiredValidators()]),
        })
    }

    updateRoutingDetails(): void {
        this.isLoading$.next(true);
        this.dateTimeVal = `${this.dateVal} ${this.timeVal}`
        this.planningForm.patchValue({ estimatedTimeArrival: this.dateTimeVal })
        this.planningService.editRouteingDetails(this.id, this.planningForm.value).subscribe({
            next: () => {
                this.router.navigate(['../../success'], { relativeTo: this.route });
            },
            error: (body) => {
                handleError(this.snackBar, body);
                this.isLoading$.next(false);
            }
        })
    }
}
