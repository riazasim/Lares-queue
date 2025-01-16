import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { CustomFieldModel } from 'src/app/core/models/custom-field.model';
import { OperationModel } from 'src/app/core/models/operation.model';
import { PartnerModel } from 'src/app/core/models/partner.model';
import { ProductModel } from 'src/app/core/models/product.model';
import { SchedulingCustomField } from 'src/app/core/models/scheduling.model';
import { PlanningService } from 'src/app/core/services/planning.service';
import { MatStepper } from '@angular/material/stepper';
import { DockModel } from 'src/app/core/models/dock.model';
import { BuildingModel } from 'src/app/core/models/building.model';
import { StatusListService } from 'src/app/core/services/status-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { getFormatHourSlot } from '../../scheduling-box.helper';
import {
    PlanningModel,
    PointModal,
    convoyModel,
} from 'src/app/core/models/planning.model';
import { ShipsService } from 'src/app/core/services/ships.service';
import { MicroService } from 'src/app/core/services/micro.service';
import { ProductService } from 'src/app/core/services/product.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
    createMinLengthValidator,
    createOptionalRequiredValidators,
    createRequiredValidators,
} from 'src/app/shared/validators/generic-validators';
import { PartnerService } from 'src/app/core/services/partner.service';
import { TrainsService } from 'src/app/core/services/trains.service';
import { StationService } from 'src/app/core/services/stations.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningModalComponent } from 'src/app/shared/components/modals/warning-modal/warning-modal.component';

@Component({
    selector: 'train-app-add-scheduling',
    templateUrl: './train-add-scheduling.component.html',
    styleUrls: ['./train-add-scheduling.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainAddSchedulingComponent implements OnInit {
    file1Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file2Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file3Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    @ViewChild('stepper', { static: false }) matStepper: MatStepper;
    firstFormGroup = this.fb.group({
        firstCtrl: ['', []],
    });

    schedulingForm: FormGroup;
    convoyForm: FormGroup;
    routingDetailsForm: FormGroup;
    stepOneForm: FormGroup;
    stepTwoForm: FormGroup;
    stepThreeForm: FormGroup;
    wagonForm: FormGroup;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    hideEmail$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    showFileThree$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    isContentLoading$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    isStationTypeChangeLoading$: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    selectedSlot$: BehaviorSubject<number | null> = new BehaviorSubject<
        number | null
    >(null);
    selectedCustomer$: BehaviorSubject<string | null> = new BehaviorSubject<
        string | null
    >(null);
    isStationLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        true
    );
    isEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    isLinear = true;
    customers: PartnerModel[] = [];
    areRouteDetailsDone: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    addNewWagon$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    companiesList: PartnerModel[] = [];
    locomotives: any;
    operations: any;
    convoys: convoyModel[] = [];
    images: any[] = [];
    imageLen: number = 0;
    tempImg: File[] = [];
    operationType: OperationModel[] = [];
    customInputsFetched: boolean = false;
    etpDateVal: string;
    etpTimeVal: string = '00:00:00';
    etpDateTimeVal: string;
    etdDateVal: string;
    etdTimeVal: string = '00:00:00';
    etdDateTimeVal: string;
    search: string;
    getFormatHourSlot: Function;
    pickupPoints: any[] = [];
    deliveryPoints: any[] = [];
    id: number;
    shipsList: any;
    etpDate: Date = new Date();
    etpTime = '00:00:00';
    etdDate: Date = new Date();
    etdTime = '00:00:00';
    etdTimeDateModal: Date = new Date();
    etpTimeDateModal: Date = new Date();
    etdDateModal: Date = new Date();
    etpDateModal: Date = new Date();
    rowIndex: number = 1;
    rows: any[] = [this.rowIndex];
    selectedIndex: any = 0;
    noIndex: number = 1;
    no: any[] = [this.noIndex];
    wagonsList: any[] = [];
    locomotiveType: any = '';
    operationName: any = '';
    stationTypes: any = [];
    station: any;
    type: string = '';
    selectedCategoryId: number = 0;
    selectedCategoryIds: any;
    categoryStart: number = 0;
    categoryQuery: string = '';
    category: any = new BehaviorSubject<any>([]);
    subCategory: any;
    subCategoryLists: any[] = [];

    private formatDateObject(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day
            }`;
        return formattedDate;
    }
    companies: any[];
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
    // subCategoryList = [
    //     { id: 1, name: '40 DC' },
    //     { id: 2, name: 'Crude oil' },
    //     { id: 3, name: 'Wheat' },
    //     { id: 4, name: 'Urea' },
    //     { id: 5, name: 'B200' },
    //     { id: 6, name: 'Mangan' },
    //     { id: 7, name: 'Lignit' },
    //     { id: 8, name: 'Spercial ' },
    // ];
    stations: any = [];

    constructor(
        private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly statusListStatus: StatusListService,
        private readonly snackBar: MatSnackBar,
        private readonly trainsService: TrainsService,
        private readonly stationService: StationService,
        private readonly partnerService: PartnerService,
        private readonly cd: ChangeDetectorRef,
        private readonly dialogService: MatDialog,
        private readonly productService: ProductService,
        private readonly microService: MicroService,
    ) {
        this.getFormatHourSlot = getFormatHourSlot.bind(this);
        this.subscribeForQueryParams();
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.initForm();
        // this.initConvoyForm();
        this.retriveOperations();
        this.retrieveCompanies();
        this.retrieveLocomotives();
        this.addWagons();
        this.addPoints();
        this.retrieveStations();
        this.cd.detectChanges();
        this.isLoading$.next(false);
    }

    subscribeForQueryParams(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            this.isEdit$.next(true);
            this.planningService
                .getConvoy(this.id)
                .subscribe((shipment: any) => {
                    console.log(shipment);
                    // debugger
                    const etdTimeDateModal = shipment?.estimatedTimeDeliver.split(" ");
                    this.etdDateModal = new Date(etdTimeDateModal[0]);
                    this.etdDateVal = etdTimeDateModal[0];
                    this.etdTimeVal = etdTimeDateModal[1];

                    const etpTimeDateModal = shipment?.estimatedTimePickUp.split(" ");
                    this.etpDateModal = new Date(etpTimeDateModal[0]);
                    this.etpDateVal = etpTimeDateModal[0];
                    this.etpTimeVal = etpTimeDateModal[1];
                    this.locomotiveType =
                        shipment?.planningRailway?.locomotive?.locomotiveType;
                    if (
                        shipment?.planningRailway?.conductorType ===
                        'Without Laras Conductor App'
                    ) {
                        this.hideEmail(false);
                    }

                    const categoryIds = shipment?.planningRailwayShipmentWagons.map(
                        (wagon: any) => wagon.category?.id
                    );

                    this.retrieveCategories('', 0, '', categoryIds);
                    this.retrieveSubCategoriesList(categoryIds);

                    // this.retrieveCategories();
                    this.initForm(0, shipment);
                    this.isLoading$.next(false);
                });
        } else {
            this.retrieveCategories();
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    hideEmail(ev: boolean) {
        localStorage.setItem('userEmail', String(this.stepOneForm.get('userEmail')));
        if (ev) {
            this.stepOneForm
                .get('userEmail')
                ?.setValidators([...createRequiredValidators()]);
            this.stepOneForm
                .get('userEmail')
                ?.setValue(String(localStorage.getItem('userEmail')) || '');
        } else {
            this.stepOneForm.get('userEmail')?.clearValidators(); // Use clearValidators() for clarity
            this.stepOneForm.get('userEmail')?.setValue(''); // Reset value
        }
        this.stepOneForm.get('userEmail')?.updateValueAndValidity();
    
        // Ensure form validation consistency
        this.stepOneForm.updateValueAndValidity();
        this.hideEmail$.next(ev);
    }
    

    // hideEmail(ev: boolean) {
    //     debugger
    //     localStorage.setItem(
    //         'userEmail',
    //         String(this.stepOneForm.get('userEmail'))
    //     );
    //     if (ev) {
    //         this.stepOneForm
    //             .get('userEmail')
    //             ?.setValidators([...createRequiredValidators()]);
    //         this.stepOneForm
    //             .get('userEmail')
    //             ?.setValue(String(localStorage.getItem('userEmail')) || '');
    //     } else {
    //         this.stepOneForm.get('userEmail')?.setValidators([]);
    //         this.stepOneForm.get('userEmail')?.setValue('');
    //     }
    //     this.stepOneForm.get('userEmail')?.updateValueAndValidity();
    //     this.hideEmail$.next(ev);
    // }

    moveItemInFormArray(
        formArray: FormArray,
        fromIndex: number,
        toIndex: number
    ): void {
        const dir = toIndex > fromIndex ? 1 : -1;

        const item = formArray.at(fromIndex);
        for (let i = fromIndex; i * dir < toIndex * dir; i = i + dir) {
            const current = formArray.at(i + dir);
            formArray.setControl(i, current);
        }
        formArray.setControl(toIndex, item);
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.stations, event.previousIndex, event.currentIndex);
        moveItemInArray(
            this.stationTypes,
            event.previousIndex,
            event.currentIndex
        );
        this.moveItemInFormArray(
            this.points,
            event.previousIndex,
            event.currentIndex
        );
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

    addPlanning() {
        this.areRouteDetailsDone.next(true);
        if (this.etpDateVal === undefined)
            this.etpDateVal = this.formatDate(this.etpDate);
        if (this.etpTimeVal === undefined)
            this.etpTimeVal = String(this.etpTime);
        if (this.etdDateVal === undefined)
            this.etdDateVal = this.formatDate(this.etdDate);
        if (this.etdTimeVal === undefined)
            this.etdTimeVal = String(this.etdTime);
        // const pickup = this.convoyForm?.get("pickUpPoint")?.value;
        // console.log(this.pickupPoints.indexOf(pickup), pickup.split("(")[1][0], this.pickupPoints)
        // const newArr = this.pickupPoints.filter((item: any) => {
        //     console.log(item.pointType, pickup)
        //     if (item.pointType !== pickup) {
        //         return item
        //     }
        // })
        // this.pickupPoints = newArr;
        // if (this.pickupPoints.length === 1) {
        //     this.addNewWagon$.next(false);
        // }
        this.etpDateTimeVal = `${this.etpDateVal} ${this.etpTimeVal}`;
        this.etdDateTimeVal = `${this.etdDateVal} ${this.etdTimeVal}`;
        this.stepTwoForm.patchValue({
            estimatedTimePickUp: this.etpDateTimeVal,
            estimatedTimeDeliver: this.etdDateTimeVal,
        });

    //     debugger
    //     const selectedPickupPoint = this.stepTwoForm.value.pickUpPoint; // e.g., "0:Start Point"
    // const selectedDeliveryPoint = this.stepTwoForm.value.deliverPoint; // e.g., "1:Touch Point"

    // if (selectedPickupPoint) {
    //     const [pickupIndex, pickupPointType] = selectedPickupPoint.split(':');
    //     this.pickupPoints.splice(Number(pickupIndex), 1); // Remove by index
    //     console.log(`Pickup Point Selected: ${pickupPointType}`);
    // }

    // if (selectedDeliveryPoint) {
    //     const [deliveryIndex, deliveryPointType] = selectedDeliveryPoint.split(':');
    //     this.deliveryPoints.splice(Number(deliveryIndex), 1); // Remove by index
    //     console.log(`Delivery Point Selected: ${deliveryPointType}`);
    // }

        this.convoys.push({
            ...this.stepTwoForm.value,
            ...this.stepThreeForm.value,
        });
        this.initForm(1);
        this.imageLen++;
        this.tempImg = [];
        // this.initConvoyForm();
        this.matStepper.selectedIndex = 1;
    }

    retrieveLocomotives(): void {
        let data = {
            start: '',
            length: '',
            filters: ['', '', '', '', ''],
            order: [{ dir: 'DESC', column: 0 }],
        };
        this.trainsService.pagination(data).subscribe((response) => {
            this.locomotives = response?.items;
            this.isLoading$.next(false);
        });
    }

    onLocomotiveSelected(ev: any): void {
        const selectedLocomotiveId = ev.target.value;
        const selectedLocomotive = this.locomotives.find(
            (locomotive: any) =>
                Number(locomotive.id) === Number(selectedLocomotiveId)
        );
        if (selectedLocomotive) {
            this.locomotiveType = selectedLocomotive?.type;
        }
    }

    retrieveCompanies() {
        this.isLoading$.next(true);
        let data = {
            start: 0,
            length: 0,
            filters: ['', '', '', ''],
            order: [{ dir: 'DESC', column: 0 }],
        };
        this.partnerService.pagination(data).subscribe((response) => {
            this.companiesList = response.items;
            this.isLoading$.next(false);
        });
    }

    retrieveStations() {
        let data = {
            start: 0,
            length: 0,
            filters: ['', '', '', ''],
            order: [{ dir: 'DESC', column: 0 }],
        };
        this.isStationLoading$.next(true);
        this.stationService.pagination(data).subscribe({
            next: (res) => {
                console.log(res?.items);
                this.stations = res?.items;
                this.isStationLoading$.next(false);
                this.cd.detectChanges();
            },
            error: (err) => {
                this.isStationLoading$.next(true);
            },
        });
    }

    OnStationChange(ev: any, index?: any) {
        const newStation = this.stations.find((item: any) => {
            if (Number(item.id) === Number(ev.target?.value)) {
                return item;
            }
        });
        this.stationTypes[index] = newStation?.type;
    }

    onInputChange(ev: any) {
        this.search = ev?.target?.value;
    }

    retriveOperations() {
        this.isLoading$.next(true);
        this.microService.getOperations().subscribe((response) => {
            this.operationType = response;
            this.isLoading$.next(false);
        });
    }

    onOperationSelected(ev: any): void {
        const selectedOperationId = ev.target.value;
        const selectedOperation = this.operationType.find(
            (Operation: any) =>
                Number(Operation.id) === Number(selectedOperationId)
        );
        if (selectedOperation) {
            this.operationName = selectedOperation?.name;
            this.stepTwoForm.patchValue({ operationName: this.operationName });
        }
    }

    next(index: any): void {
        if (index === 3 && this.isEdit$.value) {
            this.saveScheduling();
        } else {
            if (index === 1) {
                if (this.points.length < 2) {
                    this.dialogService.open(WarningModalComponent, {
                        disableClose: true,
                    });
                } else {
                    console.log('ok');
                    const newArr = this.points.value;
                    for (let i = 0; i < newArr.length; i++) {
                        newArr[i].pointType = 'Touch Point';
                        newArr[i].stationType = this.stationTypes[i];
                    }
                    newArr[0].pointType = 'Start Point';
                    newArr[newArr.length - 1].pointType = 'End Point';
                    this.pickupPoints = newArr.slice(0, -1);
                    this.deliveryPoints = newArr.slice(1);
                    console.log(this.pickupPoints)
                    console.log(this.deliveryPoints)
                    this.matStepper.selectedIndex = index;
                }
            } else {
                this.matStepper.selectedIndex = index;
            }
        }
    }

    onRowDelete(index: any) {
        if (this.points.length > 1) {
            this.points.removeAt(Number(index));
            this.stations.splice(Number(index), 1);
            this.stationTypes.splice(Number(index), 1);
        }
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
        this.etpTimeVal = value;
    }
    OnETDTimeChange(value: any) {
        this.etdTimeVal = value;
    }

    retrieveStatuses(): Observable<any> {
        return this.statusListStatus.listSid();
    }

    // retrieveCategories(
    //     query?: any,
    //     len?: any,
    //     type?: any,
    //     categoryId?: any
    // ): void {
    //     this.isContentLoading$.next(true);
    //     this.selectedCategoryId = categoryId !== undefined ? Number(categoryId) : 0;
    //     this.type = type !== undefined ? String(type) : '';
    //     this.categoryQuery = query !== undefined ? String(query) : '';
    //     this.categoryStart += len !== undefined ? Number(len) : 0;

    //     const data = {
    //         selectedId: this.selectedCategoryId,
    //         type: this.type,
    //         start: this.categoryStart > 0 ? this.categoryStart : 0,
    //         length: 20,
    //         filter: this.categoryQuery,
    //     };

    //     this.productService.getCategoryList(data).subscribe({
    //         next: (res) => {
    //             const categories = res.map((item: any) => item.attributes);
    //             this.category.next(categories); // Update category list
    //             this.cd.detectChanges();

    //             const wagonsArray = this.wagons as FormArray;
    //             wagonsArray.controls.forEach((wagonControl, index) => {
    //                 const selectedCategoryId = wagonControl.get('category')?.value;

    //                 // Check and patch for all rows
    //                 if (selectedCategoryId) {
    //                     const matchingCategory = categories.find(
    //                         (cat: any) => cat.id === selectedCategoryId
    //                     );
    //                     if (matchingCategory) {
    //                         wagonControl.patchValue({ category: selectedCategoryId });
    //                         this.retrieveSubCategories(selectedCategoryId, index); // Fetch subcategories
    //                     } else {
    //                         wagonControl.patchValue({ category: null, subCategory: null });
    //                     }
    //                 } else {
    //                     wagonControl.patchValue({ category: null, subCategory: null });
    //                 }
    //             });

    //             this.isContentLoading$.next(false);
    //         },
    //         error: (err) => {
    //             this.isContentLoading$.next(false);
    //             console.error('Error fetching categories:', err);
    //         },
    //     });
    // }
    // logFormArray(): void {
    //     const wagonsArray = this.wagons as FormArray;
    //     console.log('FormArray Values:', wagonsArray.value);
    // }



    // retrieveSubCategories(categoryId: number, rowIndex: number): void {
    //     this.productService.getSubCategory(categoryId).subscribe({
    //         next: (res: any) => {
    //             const subCategories = res.map((item: any) => item.attributes) || [];
    //             this.subCategoryLists[rowIndex] = subCategories;

    //             const wagonsArray = this.wagons as FormArray;
    //             const wagonControl = wagonsArray.at(rowIndex);

    //             if (wagonControl) {
    //                 const selectedSubCategoryId = wagonControl.get('subCategory')?.value;

    //                 if (selectedSubCategoryId) {
    //                     const matchingSubCategory = subCategories.find(
    //                         (sub: any) => sub.id === selectedSubCategoryId
    //                     );

    //                     if (matchingSubCategory) {
    //                         wagonControl.patchValue({ subCategory: selectedSubCategoryId });
    //                     } else {
    //                         wagonControl.patchValue({ subCategory: null });
    //                     }
    //                 } else {
    //                     wagonControl.patchValue({ subCategory: null });
    //                 }
    //             }

    //             this.isContentLoading$.next(false);
    //         },
    //         error: (err: any) => {
    //             console.error('Error fetching subcategories:', err);
    //             this.isContentLoading$.next(false);
    //         },
    //     });
    // }


    // onCategoryChange(ev: any, rowIndex: number): void {
    //     this.isContentLoading$.next(true);
    //     const selectedCategoryId = Number(ev.value);

    //     const category = this.category.value.find(
    //         (item: any) => item.id === selectedCategoryId
    //     );

    //     const wagonsArray = this.wagons as FormArray;
    //     const wagonControl = wagonsArray.at(rowIndex);

    //     if (category && wagonControl) {
    //         wagonControl.patchValue({ category: category.id });

    //         // Fetch and update subcategories for the selected category.
    //         this.retrieveSubCategories(category.id, rowIndex);
    //     } else if (wagonControl) {
    //         wagonControl.patchValue({ category: null, subCategory: null });
    //     }

    //     this.isContentLoading$.next(false);
    // }



    // retrieveCategories(
    //     query?: any,
    //     len?: any,
    //     type?: any,
    //     categoryId?: any
    // ): void {
    //     this.isContentLoading$.next(true);
    //     this.selectedCategoryId = categoryId !== undefined ? Number(categoryId) : 0;
    //     this.type = type !== undefined ? String(type) : '';
    //     this.categoryQuery = query !== undefined ? String(query) : '';
    //     this.categoryStart += len !== undefined ? Number(len) : 0;

    //     let data = {
    //         selectedId: this.selectedCategoryId,
    //         type: this.type,
    //         start: this.categoryStart > 0 ? this.categoryStart : 0,
    //         length: 20,
    //         filter: this.categoryQuery,
    //     };
    //     this.productService.getCategoryList(data).subscribe({
    //         next: (res) => {
    //             if (res.length > 0) {
    //                 let temp: any[] = [];
    //                 res?.forEach((item: any) => {
    //                     temp.push(item?.attributes);
    //                 });
    //                 this.category.next(temp);
    //                 this.cd.detectChanges();
    //             }
    //             this.isContentLoading$.next(false);
    //         },
    //         error: (err) => {
    //             this.isContentLoading$.next(false);
    //             throw err;
    //         },
    //     });
    // }

    retrieveCategories(
        query?: any,
        len?: any,
        type?: any,
        categoryIds?: any[] 
    ): void {
        this.isContentLoading$.next(true);
        this.selectedCategoryIds = Array.isArray(categoryIds) ? categoryIds : [];
        this.type = type !== undefined ? String(type) : '';
        this.categoryQuery = query !== undefined ? String(query) : '';
        this.categoryStart += len !== undefined ? Number(len) : 0;

        let data = {
            selectedIds: this.selectedCategoryIds, 
            type: this.type,
            start: this.categoryStart > 0 ? this.categoryStart : 0,
            length: 20,
            filter: this.categoryQuery,
        };

        this.productService.getCategoryList(data).subscribe({
            next: (res) => {
                if (res.length > 0) {
                    let temp: any[] = [];
                    res?.forEach((item: any) => {
                        temp.push(item?.attributes);
                    });
                    this.category.next(temp);
                    this.cd.detectChanges();
                }
                this.isContentLoading$.next(false);
            },
            error: (err) => {
                this.isContentLoading$.next(false);
                throw err;
            },
        });
    }


    onCategoryChange(ev: any, rowIndex: number): void {
        this.isContentLoading$.next(true);
        const selectedCategoryId = Number(ev.value);
        const category = this.category.value.find(
            (item: any) => Number(item.id) === selectedCategoryId
        );
        if (category) {
            const wagonsArray = this.wagons as FormArray;
            const wagonControl = wagonsArray.at(rowIndex);
            if (wagonControl) {
                wagonControl.patchValue({ category: category.id });
                this.retrieveSubCategories(category.id, rowIndex);
            }
        } else {
            this.isContentLoading$.next(false);
        }
    }

    retrieveSubCategories(categoryId: any, rowIndex: number): void {
        this.productService.getSubCategory(categoryId).subscribe({
            next: (res: any) => {
                this.subCategoryLists[rowIndex] =
                    res.map((item: any) => item.attributes) || [];

                const wagonsArray = this.wagons as FormArray;
                const wagonControl = wagonsArray.at(rowIndex);

                if (wagonControl) {
                    if (this.subCategoryLists[rowIndex].length === 0) {
                        wagonControl.patchValue({ subCategory: null });
                    }
                }
                this.isContentLoading$.next(false);
            },
            error: (err: any) => {
                console.error('Error fetching subcategories:', err);
                this.isContentLoading$.next(false);
            },
        });
        // this.productService.getSubCategory(categoryId).subscribe({
        //     next: res => {
        //         this.subCategory = res.map((item: any) => item.attributes) || [];
        //         if (this.subCategory.length === 0) {
        //             const wagonsArray = this.wagons as FormArray;
        //             wagonsArray.controls.forEach((wagonControl, rowIndex) => {
        //                 if (wagonControl.get('subCategory')?.value === '' || wagonControl.get('subCategory')?.value === null) {
        //                     wagonControl.patchValue({ subCategory: null });
        //                 }
        //             });
        //         }
        //         this.isContentLoading$.next(false);
        //     },
        //     error: err => {
        //         this.isContentLoading$.next(false);
        //     }
        // });
    }

    retrieveSubCategoriesList(categoryIds: any[]): void {
        this.isContentLoading$.next(true); // Start loading indicator
        let data = {
            "categoryIds": categoryIds
          }
        // debugger
        this.productService.getSubCategoryList( data ).subscribe({
            next: (response: any[]) => {
                // Clear the subCategoryLists array
                this.subCategoryLists = [];
                // Process response to map subcategories to the correct index
                categoryIds.forEach((id, index) => {
                    // Find the corresponding subcategories for the current category ID
                    const subCategories = response.find((item) => item[id])?.[id] || [];
    
                    // Map subcategories for this category ID
                    this.subCategoryLists[index] = subCategories.map((sub:any) => sub.name);
    
                    // Access the FormArray and its control
                    const wagonsArray = this.wagons as FormArray;
                    const wagonControl = wagonsArray.at(index);
    
                    if (wagonControl) {
                        // Reset the subCategory field if no subcategories are found
                        if (this.subCategoryLists[index].length === 0) {
                            wagonControl.patchValue({ subCategory: null });
                        }
                    }
                });
    
                this.isContentLoading$.next(false); // Stop loading indicator
            },
            error: (err: any) => {
                console.error('Error fetching subcategories:', err);
                this.isContentLoading$.next(false); // Stop loading indicator
            },
        });
    }
    

    // initConvoyForm(data?: any): void {
    //     this.convoyForm = this.fb.group({
    //         pickUpFromCompany: this.fb.control(data?.pickUpFromCompany || '', [...createRequiredValidators()]),
    //         deliverToCompany: this.fb.control(data?.deliverToCompany || '', [...createRequiredValidators()]),
    //         pickUpPoint: this.fb.control(data?.pickUpPoint || '', [...createRequiredValidators()]),
    //         deliverPoint: this.fb.control(data?.deliverPoint || '', [...createRequiredValidators()]),
    //         estimatedTimePickUp: this.fb.control(data?.estimatedTimePickUp || ''),
    //         estimatedTimeDeliver: this.fb.control(data?.estimatedTimeDeliver || ''),
    //         planningRailwayShipmentWagons: this.fb.array([]),
    //         additionalOperator: this.fb.control(data?.additionalOperator || '', [...createRequiredValidators()]),
    //         clientComments: this.fb.control(data?.clientComments || '', [...createRequiredValidators()]),
    //         operatorComments: this.fb.control(data?.operatorComments || '', [...createRequiredValidators()]),
    //     })
    //     if (data?.planningRailwayShipmentWagons) {
    //         data.planningRailwayShipmentWagons.forEach((wagon: any) => {
    //             this.addWagons(wagon);
    //         });
    //     }
    // }

    // this.schedulingForm = this.fb.group({
    //     routingDetail: this.fb.group({
    //         locomotiveId: this.fb.control(data?.routingDetail?.locomotiveId || '', [...createRequiredValidators()]),
    //         locomotiveType: this.fb.control(data?.routingDetail?.locomotiveType || ''),
    //         conductorType: this.fb.control(data?.routingDetail?.conductorType || 'With Laras Conductor App', [...createRequiredValidators()]),
    //         userEmail: this.fb.control(data?.routingDetail?.userEmail || ''),
    //         planningRailwayRoutingDetails: this.fb.array([]),
    //     }),
    //     convoyDetail: this.fb.control(data?.convoyDetail || []),
    //     documents: this.fb.control(data?.documents || []),
    // });

    initForm(index: any = 0, data?: any): void {
        if (index !== 1) {
            // debugger
            this.stepOneForm = this.fb.group({
                locomotiveId: this.fb.control(
                    {
                        value: data?.planningRailway?.locomotive?.id || '',
                        disabled: data?.planningRailway?.locomotive?.id
                            ? true
                            : false,
                    },
                    [...createRequiredValidators()]
                ),
                conductorType: this.fb.control(
                    {
                        value:
                            data?.planningRailway?.conductorType ||
                            'With Laras Conductor App',
                        disabled: data?.planningRailway?.conductorType
                            ? true
                            : false,
                    },
                    [...createRequiredValidators()]
                ),
                userEmail: this.fb.control(
                    {
                        value: data?.planningRailway?.userEmail || '',
                        disabled: data?.planningRailway?.userEmail
                            ? true
                            : false,
                    },
                    [...createRequiredValidators()]
                ),
                planningRailwayRoutingDetails: this.fb.array([]),
            });
            this.schedulingForm = this.fb.group({
                routingDetail: this.stepOneForm,
                convoyDetail: this.fb.control([]),
                documents: this.fb.control([]),
            });
            if (
                data?.planningRailway?.planningRailwayRoutingDetails.length > 0
            ) {
                data?.planningRailway?.planningRailwayRoutingDetails.map(
                    (item: any) => {
                        // this.stations.push(item?.station)
                        // this.stationTypes.push(item?.stationType)
                        this.addPoints(item);
                        this.cd.detectChanges();
                    }
                );
            }
        }
        this.stepTwoForm = this.fb.group({
            pickUpFromCompany: this.fb.control(
                data?.pickUpFromCompany?.id || '',
                [...createRequiredValidators()]
            ),
            deliverToCompany: this.fb.control(
                data?.deliverToCompany?.id || '',
                [...createRequiredValidators()]
            ),
            operation: this.fb.control(
                data?.operation || '',
                [...createRequiredValidators()]
            ),
            operationName: this.fb.control( 
                data?.operationName || '' 
            ),
            pickUpPoint: this.fb.control(data?.pickUpPoint?.pointType || '', [
                ...createRequiredValidators(),
            ]),
            deliverPoint: this.fb.control(data?.deliverPoint?.pointType || '', [
                ...createRequiredValidators(),
            ]),
            estimatedTimePickUp: this.fb.control(''),
            estimatedTimeDeliver: this.fb.control(''),
            planningRailwayShipmentWagons: this.fb.array([]),
        });

        if (data?.planningRailwayShipmentWagons.length > 0) {
            // Add all rows to the form array first
            data?.planningRailwayShipmentWagons.forEach((wagon: any) => {
                this.addWagons(wagon);
            });

            // Patch selected category IDs one by one
            const categoryIds = data?.planningRailwayShipmentWagons.map((item: any) => item.category?.id);

            this.wagons.controls.forEach((control: any, index: number) => {
                control.patchValue({ category: categoryIds[index] || null });
            });

            this.cd.detectChanges();
        }

        this.stepThreeForm = this.fb.group({
            clientComments: this.fb.control(data?.clientComments || ''),
            operatorComments: this.fb.control(data?.operatorComments || ''),
            additionalOperator: this.fb.control(data?.additionalOperator || ''),
        });
    }

    get points(): FormArray {
        return this.stepOneForm?.get(
            'planningRailwayRoutingDetails'
        ) as FormArray;
    }

    addPoints(data?: any): void {
        console.log(data);
        const newPoint = this.fb.group({
            planningRouteDetailId: [data?.id || null],
            pointType: [data?.pointType || ''],
            stationType: [data?.stationType || ''],
            station: [
                {
                    value: data?.station?.id || '',
                    disabled: data?.station?.id ? true : false,
                },
                [...createRequiredValidators()],
            ],
        });
        this.points.push(newPoint);
    }

    get wagons(): any {
        return this.stepTwoForm.get('planningRailwayShipmentWagons');
    }

    addWagons(data?: any): void {
        const newWagons = this.fb.group({
            planningRailwayShipmentWagonId: [data?.id],
            wagon: [data?.wagon || ''],
            category: [data?.category?.id || ''],
            subCategory: [data?.subCategory?.id || ''],
            grossWeight: [data?.grossWeight || ''],
            taraWeight: [data?.taraWeight || ''],
            netWeight: [data?.netWeight || ''],
            seals: [data?.seals || ''],
        });
        this.wagons.push(newWagons);
    }

    removeWagon(index: any) {
        if (this.wagons.length > 0) {
            this.wagons.removeAt(Number(index));
        }
    }

    // onCategoryChange(ev: any, index?: any) {
    //     console.log(index)
    //     if (index === this.no.length - 1) {
    //         this.category = ev?.target?.value;
    //     }
    //     else {
    //         this.wagonsList[index].category = ev?.target?.value;
    //     }
    // }

    // onSubCategoryChange(ev: any, index?: any) {
    //     if (index === this.no.length - 1) {
    //         this.subCategory = ev?.target?.value;
    //     }
    //     else {
    //         this.wagonsList[index].subCategory = ev?.target?.value;
    //     }
    // }

    saveScheduling(): void {
        this.isLoading$.next(true);
        if (this.etpDateVal === undefined)
            this.etpDateVal = this.formatDate(this.etpDateModal);
        if (this.etpTimeVal === undefined)
            this.etpTimeVal = String(this.etpTimeVal);
        this.etpDateTimeVal = `${this.etpDateVal} ${this.etpTimeVal}`;
        if (this.etdDateVal === undefined)
            this.etdDateVal = this.formatDate(this.etdDateModal);
        if (this.etdTimeVal === undefined)
            this.etdTimeVal = String(this.etdTimeVal);
        this.etdDateTimeVal = `${this.etdDateVal} ${this.etdTimeVal}`;
        this.stepTwoForm.patchValue({
            estimatedTimePickUp: this.etpDateTimeVal,
            estimatedTimeDeliver: this.etdDateTimeVal,
        });
        this.convoys.push({
            ...this.stepTwoForm.value,
            ...this.stepThreeForm.value,
        });
        this.schedulingForm.patchValue({
            convoyDetail: this.convoys,
            documents: this.images,
            routingDetail: this.stepOneForm.value,
        });
        console.log(this.schedulingForm, 'schedulingForm');
        if (this.id) {
            this.planningService
                .editConvoys(this.id, {
                    ...this.stepTwoForm.value,
                    ...this.stepThreeForm.value,
                })
                .subscribe({
                    next: () => {
                        this.isLoading$.next(false);
                        this.router.navigate(['../../success'], {
                            relativeTo: this.route,
                        });
                    },
                    error: (body: any) => {
                        this.isLoading$.next(false);
                        handleError(this.snackBar, body, this.isLoading$);
                    },
                });
        } else {
            this.planningService.create(this.schedulingForm.value).subscribe({
                next: () => {
                    this.router.navigate(['../success'], {
                        relativeTo: this.route,
                    });
                },
                error: (body) => {
                    handleError(this.snackBar, body);
                    this.matStepper.selectedIndex = 0;
                    this.isLoading$.next(false);
                },
            });
        }
    }

    patchFile(file: File, index: number): void {
        this.tempImg[index] = file;
        this.images[this.imageLen] = this.tempImg;
    }
}
