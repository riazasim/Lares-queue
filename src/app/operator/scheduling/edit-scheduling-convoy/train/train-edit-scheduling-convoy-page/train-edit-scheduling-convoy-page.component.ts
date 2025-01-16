import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { PartnerModel } from 'src/app/core/models/partner.model';
import { PartnerService } from 'src/app/core/services/partner.service';
import { convoyModel } from 'src/app/core/models/planning.model';


@Component({
    selector: 'app-train-edit-scheduling-convoy-page',
    templateUrl: './train-edit-scheduling-convoy-page.component.html',
    styleUrl: './train-edit-scheduling-convoy-page.component.scss'
})
export class TrainEditSchedulingConvoyPageComponent {
    file1Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file2Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file3Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    @ViewChild('stepper', { static: false }) matStepper: MatStepper;
    firstFormGroup = this.fb.group({
        firstCtrl: ['', []],
    });

    convoyForm: FormGroup;
    convoyDetailsForm: FormGroup;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    showFileThree$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    stepOne$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    routeId: BehaviorSubject<any> = new BehaviorSubject(null);
    isLinear = true;
    etdDateVal: string;
    etpDateVal: string;
    etpDateTimeVal: string;
    etdDateTimeVal: string;
    etpTimeVal: string;
    etdTimeVal: string;
    etpDate: Date = new Date();
    etpTime = '00:00:00';
    etdDate: Date = new Date();
    etdTime = '00:00:00';
    oldId: any[] = [];
    oldImagesId: any[] = [];
    images: any[] = [];
    imageLen: number = 0;
    tempImg: File[] = [];
    convoys: convoyModel[] = [];

    id: any;
    planningId: any;
    search: string;
    companies: any[];
    companiesList: PartnerModel[] = [];
    points: any[] = [];
    categoryList = [
        { id: 1, name: 'Containers' },
        { id: 2, name: 'Liquids' },
        { id: 3, name: 'Grains' },
        { id: 4, name: 'Fertilizers' },
        { id: 5, name: 'Cement' },
        { id: 6, name: 'Ore' },
        { id: 7, name: 'Coal' },
        { id: 8, name: 'Other' },
    ];
    subCategoryList = [
        { id: 1, name: '40 DC' },
        { id: 2, name: 'Crude oil' },
        { id: 3, name: 'Wheat' },
        { id: 4, name: 'Urea' },
        { id: 5, name: 'B200' },
        { id: 6, name: 'Mangan' },
        { id: 7, name: 'Lignit' },
        { id: 8, name: 'Spercial ' },
    ];
    options: any;
    pickupPoints: any[] = [];
    deliveryPoints: any[] = [];

    private formatDateObject(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        return formattedDate;
    }

    constructor(private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly partnerService: PartnerService,
        private readonly snackBar: MatSnackBar,) { }

    ngOnInit(): void {
        this.getRoute();
        this.initConvoyForm();
        this.addWagons();
        this.initConvoyDetailsForm();
        this.isLoading$.next(false);

    }

    getRoute() {
        this.id = this.route.snapshot.params['id'];
        const urlSegments = this.route.snapshot.url;
        if (urlSegments.length > 1) {
            this.routeId.next(urlSegments[1].path);
            this.planningId = this.routeId.getValue();
            this.getPlanningRouteDetailList(this.planningId);
        }
        if (this.id !== "add") {
            this.planningService.getConvoy(this.id).subscribe(response => {
                response.planningRailwayShipmentDocuments.map((item: any) => {
                    this.oldImagesId.push(item.id)
                })
                this.retrieveCompanies();
                this.initConvoyForm(response);
                this.isLoading$.next(false);
            });
        }
        else {
            this.initConvoyForm();
            this.retrieveCompanies();
            this.isLoading$.next(false);
        }
    }
    getPlanningRouteDetailList(id: number) {
        this.planningService.getPlanningRouteDetailList(id).subscribe({
            next: (res) => {
                res?.forEach((item: any) => {
                    if (item?.attributes?.station !== null && item?.attributes !== null) {
                        this.points.push(item.attributes)
                    }
                });
                this.pickupPoints = this.points.slice(0, -1);
                this.deliveryPoints = this.points.slice(1);
            },
            error: (err) => {
                handleError(this.snackBar, err);
            }
        });
    }

    next(index: any): void {
        this.matStepper.selectedIndex = index;
    }

    onInputChange(ev: any) {
        this.search = ev?.target?.value
    }


    initConvoyForm(data?: any): void {
        this.convoyForm = this.fb.group({
            pickUpFromCompany: this.fb.control(data?.pickUpFromCompany?.id || ''),
            deliverToCompany: this.fb.control(data?.deliverToCompany?.id || ''),
            pickUpPoint: this.fb.control(data?.pickUpPoint || ''),
            deliverPoint: this.fb.control(data?.deliverPoint || ''),
            estimatedTimePickUp: this.fb.control(data?.estimatedTimePickUp || ''),
            estimatedTimeDeliver: this.fb.control(data?.estimatedTimeDeliver || ''),
            planningRailwayShipmentWagons: this.fb.array([]),
            additionalOperator: this.fb.control(data?.additionalOperator || ''),
            clientComments: this.fb.control(data?.clientComments || ''),
            operatorComments: this.fb.control(data?.operatorComments),
        })
        if (data?.planningRailwayShipmentWagons) {
            data.planningRailwayShipmentWagons.forEach((wagon: any) => {
                this.addWagons(wagon);
            });
        }
    }

    initConvoyDetailsForm(data?: any): void {
        this.convoyDetailsForm = this.fb.group({
            convoyDetail: this.fb.control(data?.convoyDetail || [])
        })
    }

    get wagons(): any {
        return this.convoyForm.get('planningRailwayShipmentWagons');
    }

    addWagons(data?: any): void {
        const newWagons = this.fb.group({
            planningRailwayShipmentWagonId: [data?.id],
            wagon: [data?.wagon],
            category: [data?.category.id],
            subCategory: [data?.subCategory.id],
            grossWeight: [data?.grossWeight],
            taraWeight: [data?.taraWeight],
            netWeight: [data?.netWeight],
            seals: [data?.seals || ''],
        });
        this.wagons.push(newWagons);
    }

    retrieveCompanies() {
        this.isLoading$.next(true);
        let data = {
            "start": 0,
            "length": 0,
            "filters": ["", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.partnerService.pagination(data).subscribe(response => {
            this.companiesList = response.items;
            this.isLoading$.next(false);
        })
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

    OnETPDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.etpDateVal = this.formatDate(filterDate);
    }

    OnETDDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.etdDateVal = this.formatDate(filterDate);
    }
    OnETPTimeChange(value: any) {
        this.etpTimeVal = value
    }
    OnETDTimeChange(value: any) {
        this.etpTimeVal = value
    }

    updateConvoys(): void {
        this.isLoading$.next(true);
        if (this.etpDateVal === undefined) this.etpDateVal = this.formatDate(this.etpDate);
        if (this.etpTimeVal === undefined) this.etpTimeVal = String(this.etpTime);
        if (this.etdDateVal === undefined) this.etdDateVal = this.formatDate(this.etdDate);
        if (this.etdTimeVal === undefined) this.etdTimeVal = String(this.etdTime);
        this.etpDateTimeVal = `${this.etpDateVal} ${this.etpTimeVal}`;
        this.etdDateTimeVal = `${this.etdDateVal} ${this.etdTimeVal}`;
        this.convoyForm.patchValue({ documents: this.images, oldDocuments: `[${String(this.oldId)}]`, estimatedTimePickUp: this.etpDateTimeVal, estimatedTimeDeliver: this.etdDateTimeVal })
        if (this.id !== "add") {
            this.planningService.editConvoys(this.id, this.convoyForm.value)
                .subscribe({
                    next: () => {
                        this.router.navigate(['../../../../success'], { relativeTo: this.route });
                    },
                    error: (body) => {
                        handleError(this.snackBar, body);
                        this.matStepper.selectedIndex = 0;
                        this.isLoading$.next(false);
                    }
                })
        }
        else {
            this.convoys.push(this.convoyForm.value)
            this.convoyDetailsForm.patchValue({ convoyDetail: this.convoys })
            this.planningService.addConvoys(this.planningId, this.convoyDetailsForm.value)
                .subscribe({
                    next: () => {
                        this.router.navigate(['../../../../success'], { relativeTo: this.route });
                    },
                    error: (body) => {
                        handleError(this.snackBar, body);
                        this.matStepper.selectedIndex = 0;
                        this.isLoading$.next(false);
                    }
                })
        }

    }

    patchFile(file: File, index: number): void {
        this.images[index] = file
        this.oldId[index] = this.oldImagesId[index]
    }

}
