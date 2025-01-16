import { ChangeDetectorRef, Component, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';
import { MicroService } from 'src/app/core/services/micro.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
    selector: 'app-train-search',
    templateUrl: './train-search.component.html',
    styleUrl: './train-search.component.scss'
})
export class TrainSearchComponent {

    @Output() results: EventEmitter<any> = new EventEmitter()
    @Output() mapLoading$: EventEmitter<boolean> = new EventEmitter(true)
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true)
    isPortsLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true)
    isCompaniesLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true)
    companies: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    departurePorts: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    arrivalPorts: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    isContentLoading$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

    timeOptions: any[] = [
        { value: 'ridTime', name: 'RID Time' },
        { value: 'operationsTime', name: 'Operations Time' },
        { value: 'berthTime', name: 'Berth Time' },
        { value: 'WaitingTime', name: 'Waiting Time' },
        { value: 'exitTime', name: 'Exit Time' }
    ];

    timeFilterForm: FormGroup;
    companiesFilterForm: FormGroup;
    sidFilterForm: FormGroup;
    displayedColumns = ['name'];
    isActive: number = 1;
    dateModal: Date = new Date("");
    dateVal: string;
    resultsArray: any[] = [];
    statusFilters: number[] = [];
    pageIndex: number;
    pageSize: number;
    length: number = 0;
    timeFilter: any = {};
    ports: any[] = [];
    portId: any;
    companyId: number = 0;
    arrivalPortId: number = 0;
    departurePortId: number = 0;

    companyStart: number = 0;
    companyQuery: string = "";
    portStart: number = 0;
    portQuery: string = "";

    private formatDateObject(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        return formattedDate;
    }


    constructor(
        private readonly microService: MicroService,
        private readonly cd: ChangeDetectorRef,
        private fb: FormBuilder,
    ) {
        this.getResults();
        this.retrivePorts()
        this.retrivePorts("", 0, "arr")
        this.retriveCompanines();
        this.initForms();
        this.OnDateChange(this.dateModal);
    }

    initForms() {
        this.initTimeFilterForm();
        this.initCompanyFiterForm();
        this.initSIDFilterForm();
    }

    retrivePorts(query?: any, len?: any, type: any = "dep") {
        this.isContentLoading$.next(true);
        this.portQuery = query !== undefined ? String(query) : ""
        this.portStart += len !== undefined ? Number(len) : 0


        let data = {
            "start": this.portStart > 0 ? this.portStart : 0,
            "length": 20,
            "filter": this.portQuery
        }
        this.microService.getPorts(data).subscribe({

            next: res => {
                if (res.length > 0) {
                    let temp: any[] = [];
                    res?.forEach((item: any) => {
                        temp.push(item?.attributes);
                    });
                    if (type === "arr") {
                        this.arrivalPorts.next(temp)
                    }
                    else {
                        this.departurePorts.next(temp);
                    }
                    this.cd.detectChanges();
                }
                this.isContentLoading$.next(false);
                this.isPortsLoading$.next(false);
            },
            error: err => {
                this.isContentLoading$.next(false);
                throw err;
            }
        })
    }

    retriveCompanines(query?: any, len?: any): void {
        this.isContentLoading$.next(true);
        this.companyQuery = query !== undefined ? String(query) : ""
        this.companyStart += len !== undefined ? Number(len) : 0

        let data = {
            "portId": "",
            "start": this.companyStart > 0 ? this.companyStart : 0,
            "length": 20,
            "filter": this.companyQuery,
        }
        this.microService.getCompanies(data).subscribe({
            next: res => {
                if (res.length > 0) {
                    let temp: any[] = [];
                    res?.forEach((item: any) => {
                        temp.push(item?.attributes);
                    });
                    this.companies.next(temp);
                    this.cd.detectChanges();
                }
                this.isContentLoading$.next(false);
            },
            error: err => {
                this.isContentLoading$.next(false);
                throw err
            }
        })
    }

    onCompaniesChange(ev: any, action: string = "search") {
        if (action === "search") {
            this.companyId = ev?.value;
        }
        if (action === "delete") {
            this.companyId = 0;
            this.portId = 0;
            this.initCompanyFiterForm();
            // this.isCompaniesLoading$.next(true);
            this.retriveCompanines();
        }
        this.getResults();
    }

    onSIDChange(ev: any, type: string, action: string = "search") {
        if (action === "search" && type === 'ap') {
            this.arrivalPortId = ev?.value;
        }
        if (action === "search" && type === 'dp') {
            this.departurePortId = ev?.value;
        }
        if (this.departurePortId !== 0 && this.arrivalPortId !== 0) {
            this.getResults(this.dateVal);
        }
        if (action === "delete") {
            this.arrivalPortId = 0;
            this.departurePortId = 0;
            this.getResults();
            this.initSIDFilterForm();
            this.dateModal = new Date();
        }
    }

    onImgClick(number: number) {
        this.isActive = number;
    }

    OnDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.dateVal = this.formatDate(filterDate);
        this.sidFilterForm.patchValue({ estimatedTimeArrival: this.dateVal })
        if (this.sidFilterForm.valid) {
            this.getResults(this.dateVal);
        }
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


    OnStatusChange(value: any, action: string = 'search') {
        if (action === 'search') {
            if (this.statusFilters.includes(value)) {
                const index = this.statusFilters.indexOf(value);
                this.statusFilters.splice(index, 1);
                this.getResults();
            }
            else {
                this.statusFilters.push(value);
                this.getResults();
            }
        }
        if (action === 'delete') {
            this.statusFilters = [];
            this.getResults();
        }
    }

    OnTimeChange(action: string = 'search') {
        if (this.timeFilterForm.controls['clauseBy'].value === 'greaterThan') {
            this.timeFilterForm.patchValue({ lessThanVal: 0 });
        }
        if (this.timeFilterForm.controls['clauseBy'].value === 'lessThan') {
            this.timeFilterForm.patchValue({ greaterThanVal: 0 });
        }
        if (this.timeFilterForm.valid && action === 'search') {
            this.timeFilter = this.timeFilterForm.value;
            this.getResults()
        }
        if (action === 'delete') {
            this.timeFilter = {};
            this.initTimeFilterForm();
            this.getResults();
        }
    }

    getResults(date: any = ""): void {
        this.mapLoading$.emit(true);
        this.isLoading$.next(true);
        // console.log(this.timeFilter)
        let data = {
            "start": 0,
            "length": 5,
            "filters": [this.portId, "", this.companyId, this.statusFilters, date, this.departurePortId, this.arrivalPortId, this.timeFilter],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.microService.getMicroPlanningConvoyes(data).subscribe({
            next: response => {
                this.resultsArray = response.items;
                this.length = response.noFiltered;
                this.mapLoading$.emit(false);
                this.results.emit(response.items);
                this.isLoading$.next(false);
                this.cd.detectChanges();
            },
            error: () => {
                this.results.emit([]);
                this.mapLoading$.emit(false);
                this.resultsArray = [];
                this.length = 0;
                this.isLoading$.next(false);
            }
        })
    }



    onPaginateChange(event: PageEvent) {
        this.mapLoading$.emit(true);
        this.isLoading$.next(true);
        let data = {
            "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,
            "length": event.pageSize,
            "filters": ["", "", "", this.statusFilters, "", "", "", this.timeFilter],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.microService.getMicroPlanningConvoyes(data).subscribe({
            next: response => {
                this.resultsArray = response.items;
                this.length = response.noFiltered;
                this.results.emit(response.items);
                this.mapLoading$.emit(false);
                this.isLoading$.next(false);
                this.cd.detectChanges();
            },
            error: () => {
                this.results.emit([]);
                this.mapLoading$.emit(false);
                this.resultsArray = [];
                this.length = 0;
                this.isLoading$.next(false);
            }
        })
    }

    initTimeFilterForm() {
        this.timeFilterForm = this.fb.group({
            filterByTime: this.fb.control('', [...createRequiredValidators()]),
            searchBy: this.fb.control('', [...createRequiredValidators()]),
            clauseBy: this.fb.control('between', [...createRequiredValidators()]),
            greaterThanVal: this.fb.control('', [...createRequiredValidators()]),
            lessThanVal: this.fb.control('', [...createRequiredValidators()]),
        });
    }
    initSIDFilterForm() {
        this.sidFilterForm = this.fb.group({
            estimatedTimeArrival: this.fb.control('', [...createRequiredValidators()]),
            departurePort: this.fb.control('', [...createRequiredValidators()]),
            arrivalPort: this.fb.control('', [...createRequiredValidators()]),
        });
    }
    initCompanyFiterForm() {
        this.companiesFilterForm = this.fb.group({
            // portId: this.fb.control('', [...createRequiredValidators()]),
            companyId: this.fb.control('', [...createRequiredValidators()]),
        });
    }

}
