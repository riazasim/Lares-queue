import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    BehaviorSubject,
    catchError,
    concatMap,
    finalize,
    Observable,
    shareReplay,
    tap,
    throwError,
} from 'rxjs';
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
import { PlanningModel, convoyModel } from 'src/app/core/models/planning.model';
import { ShipsService } from 'src/app/core/services/ships.service';
import { ShipModel } from 'src/app/core/models/ship.model';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { MicroService } from 'src/app/core/services/micro.service';
import { PageEvent } from '@angular/material/paginator';
import { ProductService } from 'src/app/core/services/product.service';
import { OperationService } from 'src/app/core/services/operation.service';

@Component({
    selector: 'water-app-add-scheduling',
    templateUrl: './water-add-scheduling.component.html',
    styleUrls: ['./water-add-scheduling.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaterAddSchedulingComponent implements OnInit {
    file1Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file2Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file3Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    @ViewChild('stepper', { static: false }) matStepper: MatStepper;
    firstFormGroup = this.fb.group({
        firstCtrl: ['', []],
    });

    schedulingForm: FormGroup;
    convoyForm: FormGroup;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    showFileThree$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    isDeparturePortsLoading$: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(true);
    isArrivalPortsLoading$: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(true);
    isDeparturePortChangeLoading$: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    isArrivalPortChangeLoading$: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    isEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    isContentLoading$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

    isLinear = true;
    customers: PartnerModel[] = [];
    operations: OperationModel[] = [];

    transportData: CustomFieldModel[] | undefined;
    cargoData: CustomFieldModel[] | undefined;
    additionalData: CustomFieldModel[] | undefined;

    customFieldTransportData: SchedulingCustomField[] = [];
    customFieldCargoData: SchedulingCustomField[] = [];
    customFieldAdditionalData: SchedulingCustomField[] = [];

    products: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    operationType: OperationModel[] = [];
    operator: any[] = [];
    // listProducts: ProductModel[] = [];
    docks: DockModel[] = [];
    buildings: BuildingModel[] = [];
    productsList: any[] = [];
    convoys: convoyModel[] = [];
    images: any[] = [];
    imageLen: number = 0;
    tempImg: File[] = [];
    customInputsFetched: boolean = false;
    departureDateVal: string;
    departureDateModal: Date = new Date();
    arrivalDateModal: Date = new Date();
    departureTimeVal: string = '00:00:00';
    departureDateTimeVal: string;
    arrivalDateVal: string;
    arrivalTimeVal: string = '00:00:00';
    arrivalDateTimeVal: string;
    search: string;
    slots: number[] = [];
    ignoreSlots: number[] = [];
    tomorrowSlots: number[] = [];
    today: Date;
    tomorrow: Date;
    selectedSlot$: BehaviorSubject<number | null> = new BehaviorSubject<
        number | null
    >(null);
    selectedCustomer$: BehaviorSubject<string | null> = new BehaviorSubject<
        string | null
    >(null);
    departurePorts: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    arrivalPorts: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    getFormatHourSlot: Function;
    stepOneForm: FormGroup;
    stepTwoForm: FormGroup;
    stepThreeForm: FormGroup;
    id: number;
    shipsList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    selctedProductId: number = 0;
    selctedShipId: number = 0;
    selctedDeparturePortId: number = 0;
    departurePortStart: number = 0;
    departurePortQuery: string = '';
    selctedArrivalPortId: number = 0;
    arrivalPortStart: number = 0;
    arrivalPortQuery: string = '';
    shipStart: number = 0;
    shipQuery: string = '';
    productStart: number = 0;
    productQuery: string = '';

    private formatDateObject(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day
            }`;
        return formattedDate;
    }

    departureZone: any[] = [];
    arrivalZone: any[] = [];
    departureCompanies: any[];
    arrivalCompanies: any[];
    trafficType = [
        { id: 1, name: 'Export' },
        { id: 2, name: 'Import' },
        { id: 3, name: 'Tranzit' },
        { id: 4, name: 'Cabotaj' },
    ];
    purpose = [
        { id: 1, name: 'Towage' },
        { id: 2, name: 'Unloading' },
        { id: 3, name: 'Loading' },
    ];
    convoyType = [
        { id: 1, name: 'Arrival' },
        { id: 2, name: 'Departure' },
    ];

    constructor(
        private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly statusListStatus: StatusListService,
        private readonly snackBar: MatSnackBar,
        private readonly shipsService: ShipsService,
        private readonly productService: ProductService,
        private readonly microService: MicroService,
        private readonly operationService: OperationService,
        private readonly cd: ChangeDetectorRef
    ) {
        this.getFormatHourSlot = getFormatHourSlot.bind(this);
        this.subscribeForQueryParams();
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
    }

    temp() {
        console.log(this.stepTwoForm.value, this.stepTwoForm.valid);
    }

    async subscribeForQueryParams(): Promise<void> {
        this.id = this.route.snapshot.params['id'];

        if (this.id) {
            this.isEdit$.next(true);
            const shipment = await this.planningService
                .getConvoy(this.id)
                .toPromise();
            console.log(shipment);

            await this.retriveDeparturePorts(
                '',
                0,
                shipment?.planningWater?.departurePort || null
            );
            await this.retriveArrivalPorts(
                '',
                0,
                shipment?.planningWater?.arrivalPort || null
            );
            this.retriveDepartureCompanines(
                shipment?.planningWater?.departurePort || 0
            );
            this.retriveArrivalCompanines(
                shipment?.planningWater?.arrivalPort || 0
            );
            this.retriveProducts(
                '',
                0,
                shipment?.planningWaterShipmentProducts?.id || null
            );
            this.retrieveShips('', 0, shipment?.ship?.id || null);
            const departureDateTimeVal = shipment?.planningWater?.departureTime.split(" ");
            this.departureDateModal = new Date(departureDateTimeVal[0]);
            this.departureDateVal = departureDateTimeVal[0];
            this.departureTimeVal = departureDateTimeVal[1];

            const arrivalDateTimeVal = shipment?.planningWater?.arrivalTime.split(" ");
            this.arrivalDateModal = new Date(arrivalDateTimeVal[0]);
            this.arrivalDateVal = arrivalDateTimeVal[0];
            this.arrivalTimeVal = arrivalDateTimeVal[1];

            this.initForm(0, shipment);
            this.isLoading$.next(false);
        } else {
            await this.retriveDeparturePorts();
            await this.retriveArrivalPorts();
            this.retriveProducts('', 0, null);
            this.retrieveShips('', 0, null);
            this.initForm();

            this.initForm();
            this.isLoading$.next(false);
        }
    }

    // subscribeForQueryParams(): void {
    //     this.id = this.route.snapshot.params['id'];
    //     if (this.id) {
    //         this.isEdit$.next(true);
    //         this.planningService.getConvoy(this.id).subscribe((shipment: any) => {
    //             console.log(shipment)
    //             this.retrivePorts(shipment?.planningWater?.departurePort || "", "", 0, "");
    //             this.retrivePorts(shipment?.planningWater?.arrivalPort || "", "", 0, "arr");
    //             this.retriveDepartureCompanines(shipment?.planningWater?.departurePort || 0);
    //             this.retriveArrivalCompanines(shipment?.planningWater?.arrivalPort || 0);
    //             this.retriveProducts()
    //             this.retrieveShips()

    //             this.initForm(0, shipment);
    //             this.isLoading$.next(false);
    //             // this.locomotiveType = shipment?.planningRailway?.locomotive?.locomotiveType;
    //             // if (shipment?.planningRailway?.conductorType === "Without Laras Conductor App") {
    //             //     this.hideEmail(false)
    //             // }
    //         });
    //     } else {
    //         this.retriveProducts();
    //         this.retrieveShips();
    //         this.retrivePorts("", "", 0, "");
    //         this.retrivePorts("", "", 0, "arr");
    //         this.initForm();
    //         this.isLoading$.next(false);
    //     }

    // }

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

    addPlanning(index: number) {
        const selectedShipId = this.stepTwoForm.value.ship; 
    if (selectedShipId) {
        const updatedShipsList = this.shipsList.value.filter(
            (ship: any) => Number(ship.id) !== Number(selectedShipId)
        );

        this.shipsList.next(updatedShipsList);
    }
        this.convoys.push({
            ...this.stepTwoForm.value,
            ...this.stepThreeForm.value,
        });
        this.imageLen++;
        this.tempImg = [];
        this.productsList = [];
        this.initForm(1);
        this.matStepper.selectedIndex = index;
    }

    retriveProducts(query?: any, len?: any, productIds?: any): void {
        this.isContentLoading$.next(true);
        this.selctedProductId =
            productIds !== undefined ? Number(productIds) : 0;
        this.productQuery = query !== undefined ? String(query) : '';
        this.productStart += len !== undefined ? Number(len) : 0;
        let data = {
            selectedId: this.selctedProductId,
            start: this.productStart > 0 ? this.productStart : 0,
            length: 20,
            filter: this.productQuery,
        };
        this.productService.getProductList(data).subscribe({
            next: (res) => {
                if (res.length > 0) {
                    let temp: any[] = [];
                    res?.forEach((item: any) => {
                        temp.push(item?.attributes);
                    });
                    this.products.next(temp);
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

    retriveOperations() {
        this.isLoading$.next(true);
        this.microService.getOperations().subscribe((response) => {
            this.operationType = response;
            this.isLoading$.next(false);
        });
    }

    retriveOperators() {
        this.isLoading$.next(true);
        const data = {
            userRole: 'ROLE_USER_OPERATOR',
        };

        this.planningService
            .getTransferData(data)
            .subscribe((response: any) => {
                this.operator = response?.data?.attributes.map((item: any) => {
                    return {
                        id: item?.attributes?.user?.id,
                        name:
                            item.attributes?.firstName +
                            ' ' +
                            item.attributes?.lastName,
                    };
                });
                this.isLoading$.next(false);
            });
    }

    onInputChange(ev: any) {
        this.search = ev?.target?.value;
    }

    // retrivePorts(query?: any, len?: any, type: any = "dep", portId?: any) {
    //     this.isContentLoading$.next(true);

    //     // Set or reset the state values properly
    //     this.selctedPortId = portId !== undefined ? Number(portId) : 0;
    //     this.portQuery = query !== undefined ? String(query) : "";
    //     this.portStart = len !== undefined ? Number(len) : 0;  // Reset portStart each time
    //     // debugger
    //     const data = {
    //         selectedId: this.selctedPortId,
    //         start: this.portStart > 0 ? this.portStart : 0,
    //         length: 20,
    //         filter: this.portQuery,
    //     };

    //     this.microService.getPorts(data).subscribe({
    //         next: res => {
    //             if (res.length > 0) {
    //                 let temp: any[] = [];
    //                 res?.forEach((item: any) => {
    //                     temp.push(item?.attributes);
    //                 });
    //                 if (type === "arr") {
    //                     this.arrivalPorts.next(temp)
    //                 }
    //                 else {
    //                     this.departurePorts.next(temp);
    //                 }
    //                 this.cd.detectChanges();
    //             }
    //             // this.onDeparturePortChange({ value: 58 })
    //             // this.onArrivalPortChange({ value: 58 })
    //             this.isContentLoading$.next(false);
    //             this.isPortsLoading$.next(false);
    //         },
    //         error: err => {
    //             this.isContentLoading$.next(false);
    //             throw err;
    //         }
    //     })
    // }
    async retriveDeparturePorts(
        query?: any,
        len?: any,
        portId?: any
    ): Promise<void> {
        this.isContentLoading$.next(true);
        this.selctedDeparturePortId = portId !== undefined ? Number(portId) : 0;
        this.departurePortQuery = query !== undefined ? String(query) : '';
        this.departurePortStart = len !== undefined ? Number(len) : 0;

        const data = {
            selectedId: this.selctedDeparturePortId,
            start: this.departurePortStart > 0 ? this.departurePortStart : 0,
            length: 20,
            filter: this.departurePortQuery,
        };

        try {
            const res = await this.microService.getPorts(data).toPromise();
            if (res.length > 0) {
                const temp = res.map((item: any) => item?.attributes);
                this.departurePorts.next(temp);
                this.cd.detectChanges();
            }
        } catch (err) {
            console.error('Error in retriveDeparturePorts:', err);
            throw err;
        } finally {
            this.isContentLoading$.next(false);
            this.isDeparturePortsLoading$.next(false);
        }
    }

    async retriveArrivalPorts(
        query?: any,
        len?: any,
        portId?: any
    ): Promise<void> {
        this.isContentLoading$.next(true);
        this.selctedArrivalPortId = portId !== undefined ? Number(portId) : 0;
        this.arrivalPortQuery = query !== undefined ? String(query) : '';
        this.arrivalPortStart = len !== undefined ? Number(len) : 0;

        const data = {
            selectedId: this.selctedArrivalPortId,
            start: this.arrivalPortStart > 0 ? this.arrivalPortStart : 0,
            length: 20,
            filter: this.arrivalPortQuery,
        };

        try {
            const res = await this.microService.getPorts(data).toPromise();
            if (res.length > 0) {
                const temp = res.map((item: any) => item?.attributes);
                this.arrivalPorts.next(temp);
                this.cd.detectChanges();
            }
        } catch (err) {
            console.error('Error in retriveArrivalPorts:', err);
            throw err;
        } finally {
            this.isContentLoading$.next(false);
            this.isArrivalPortsLoading$.next(false);
        }
    }

    onDeparturePortChange(ev: any) {
        this.isDeparturePortChangeLoading$.next(true);
        let departurePort: any;
        this.departurePorts.value.forEach((item: any) => {
            if (Number(item.id) === Number(ev.value)) departurePort = item;
        });
        if (departurePort) {
            this.stepOneForm.patchValue({
                ridCoordinates:
                    departurePort?.addrCoordinates || '44.179249,28.649940',
            });
            this.retriveDepartureCompanines(departurePort.id);
        }
    }
    onArrivalPortChange(ev: any) {
        this.isArrivalPortChangeLoading$.next(true);
        let arrivalPort: any;
        this.arrivalPorts.value.forEach((item: any) => {
            if (Number(item.id) === Number(ev.value)) arrivalPort = item;
        });
        if (arrivalPort) {
            this.retriveArrivalCompanines(arrivalPort.id);
        }
    }

    retriveDepartureCompanines(portId: any) {
        let data = {
            portId: portId,
            start: '',
            length: '',
            filter: '',
        };
        this.microService.getCompanies(data).subscribe({
            next: (res) => {
                this.departureCompanies = [];
                if (res?.status !== 'error') {
                    res?.forEach((item: any) => {
                        this.departureCompanies.push(item?.attributes);
                    });
                }
                if (this.departureCompanies.length === 0) {
                    this.stepOneForm.patchValue({ departureCompany: null });
                }
                this.isDeparturePortChangeLoading$.next(false);
            },
            error: (err) => {
                this.isDeparturePortChangeLoading$.next(false);
                throw err;
            },
        });
    }
    retriveArrivalCompanines(portId: any) {
        let data = {
            portId: portId,
            start: '',
            length: '',
            filter: '',
        };
        this.microService.getCompanies(data).subscribe({
            next: (res) => {
                this.arrivalCompanies = [];
                if (res?.status !== 'error') {
                    res?.forEach((item: any) => {
                        this.arrivalCompanies.push(item?.attributes);
                    });
                }
                if (this.arrivalCompanies.length === 0) {
                    this.stepOneForm.patchValue({ arrivalCompany: null });
                }
                this.isArrivalPortChangeLoading$.next(false);
            },
            error: (err) => {
                this.isArrivalPortChangeLoading$.next(false);
                throw err;
            },
        });
    }
    onDepartureCompanyChange() {
        this.stepOneForm.patchValue({
            departureCompanyName:
                this.departureCompanies.find(
                    (item: any) =>
                        Number(item.id) ===
                        Number(this.stepOneForm.get('departureCompany')?.value)
                )?.name || '',
        });
    }
    onArrivalCompanyChange() {
        this.stepOneForm.patchValue({
            arrivalCompanyName:
                this.arrivalCompanies.find(
                    (item: any) =>
                        Number(item.id) ===
                        Number(this.stepOneForm.get('arrivalCompany')?.value)
                )?.name || '',
        });
    }

    next(index: any): void {
        if (this.matStepper.selectedIndex === 0) {
            this.retriveOperations();
            this.retriveOperators();
        }
        this.matStepper.selectedIndex = index;
    }

    OnDepartureDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.departureDateVal = this.formatDate(filterDate);
        // this.schedulingForm.patchValue({ routingDetail: { estimatedTimeArrival: this.dateVal } })
    }
    OnArrivalDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.arrivalDateVal = this.formatDate(filterDate);
    }
    OnDepartureTimeChange(value: any) {
        this.departureTimeVal = value;
    }
    OnArrivalTimeChange(value: any) {
        this.arrivalTimeVal = value;
    }

    retrieveShips(query?: any, len?: any, shipId?: any): void {
        this.isContentLoading$.next(true);
        this.selctedShipId = shipId !== undefined ? Number(shipId) : 0;
        this.shipQuery = query !== undefined ? String(query) : '';
        this.shipStart += len !== undefined ? Number(len) : 0;
        let data = {
            selectedId: this.selctedShipId,
            start: this.shipStart > 0 ? this.shipStart : 0,

            length: 20,

            filter: this.shipQuery,
        };
        this.shipsService.getShipList(data).subscribe({
            next: (res) => {
                if (res.length > 0) {
                    let temp: any[] = [];
                    res?.forEach((item: any) => {
                        temp.push(item?.attributes);
                    });
                    this.shipsList.next(temp);
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

    onShipSelected(ev: any): void {
        const selectedShipId = ev.value;
        const selectedShip = this.shipsList.value.find(
            (ship: any) => Number(ship.id) === Number(selectedShipId)
        );
        if (selectedShip) {
            console.log(selectedShip);
            this.stepTwoForm.patchValue({
                width: selectedShip.width || 0,
                maxDraft: selectedShip.maxDraft || 0,
                maxQuantity: selectedShip.maxCapacity || 0,
                aerialGauge: selectedShip.aerialGauge || 0,
                lockType: selectedShip.lockType || '',
                shipType: selectedShip.shipType || '',
                registrationNo: selectedShip?.registrationNo || '',
                ais: selectedShip?.ais || '',
                propulsionType: selectedShip?.propulsionType || '',
                lengthOverall: selectedShip?.['length'] || 0,
                pavilion: selectedShip?.pavilion || '',
                enginePower: selectedShip?.enginePower || '',
                shipowner: selectedShip?.shipowner || '',
            });
        }
    }

    onProductChange(ev: any) {
        this.productsList = ev?.source?.value;
        if (this.id) {
            this.stepTwoForm.patchValue({ products: this.productsList });
        } else {
            this.stepTwoForm.patchValue({ products: `[${this.productsList}]` });
        }
    }

    retrieveStatuses(): Observable<any> {
        return this.statusListStatus.listSid();
    }

    // initConvoyForm(data?: convoyModel): void {
    //     this.convoyForm = this.fb.group({
    //         navigationType: this.fb.control(data?.navigationType || '', [...createRequiredValidators()]),
    //         company: this.fb.control(data?.company || '', [...createRequiredValidators()]),
    //         status: this.fb.control(data?.status || '', [...createRequiredValidators()]),
    //         ship: this.fb.control(data?.ship || '', [...createRequiredValidators()]),
    //         shipType: this.fb.control(data?.shipType || '', [...createRequiredValidators()]),
    //         pavilion: this.fb.control(data?.pavilion || '', [...createRequiredValidators()]),
    //         enginePower: this.fb.control(data?.enginePower || 0, [...createRequiredValidators()]),
    //         lengthOverall: this.fb.control(data?.lengthOverall || 0, [...createRequiredValidators()]),
    //         width: this.fb.control(data?.width || 0, [...createRequiredValidators()]),
    //         maxDraft: this.fb.control(data?.maxDraft || 0, [...createRequiredValidators()]),
    //         maxQuantity: this.fb.control(data?.maxQuantity || 0, [...createRequiredValidators()]),
    //         agent: this.fb.control(data?.agent || '', [...createRequiredValidators()]),
    //         maneuvering: this.fb.control(data?.maneuvering || '', [...createRequiredValidators()]),
    //         shipowner: this.fb.control(data?.shipowner || '', [...createRequiredValidators()]),
    //         purpose: this.fb.control(data?.purpose || '', [...createRequiredValidators()]),
    //         operator: this.fb.control(data?.operator || '', [...createRequiredValidators()]),
    //         trafficType: this.fb.control(data?.trafficType || '', [...createRequiredValidators()]),
    //         operatonType: this.fb.control(data?.operatonType || '', [...createRequiredValidators()]),
    //         cargo: this.fb.control(data?.cargo || '', [...createRequiredValidators()]),
    //         quantity: this.fb.control(data?.quantity || 0, [...createRequiredValidators()]),
    //         unitNo: this.fb.control(data?.unitNo || '', [...createRequiredValidators()]),
    //         observation: this.fb.control(data?.observation || '', [...createRequiredValidators()]),
    //         additionalOperator: this.fb.control(data?.additionalOperator || '', [...createRequiredValidators()]),
    //         clientComments: this.fb.control(data?.clientComments || '', [...createRequiredValidators()]),
    //         operatorComments: this.fb.control(data?.operatorComments, [...createRequiredValidators()]),
    //         products: this.fb.control(data?.products || "", [...createRequiredValidators()]),
    //         lockType: this.fb.control(data?.lockType || '', [...createRequiredValidators()]),
    //         arrivalGauge: this.fb.control(data?.arrivalGauge || 0, [...createRequiredValidators()]),
    //     })
    // }

    // this.schedulingForm = this.fb.group({
    //     routingDetail: this.fb.group({
    //         convoyType: this.fb.control(''),
    //         // convoyType: this.fb.control(data?.routingDetail?.convoyType || ''),
    //         estimatedTimeArrival: this.fb.control(''),
    //         // locationPort: this.fb.control(data?.routingDetail?.locationPort || ''),
    //         departurePort: this.fb.control(''),
    //         arrivalPort: this.fb.control(''),
    //         company: this.fb.control(''),
    //         pilotCompany: this.fb.control(''),
    //         // length: this.fb.control(data?.routingDetail?.length || 0),
    //         // width: this.fb.control(data?.routingDetail?.width || 0),
    //         // maxDraft: this.fb.control(data?.routingDetail?.maxDraft || 0),
    //         // arrivalGauge: this.fb.control(data?.routingDetail?.arrivalGauge || 0),
    //         // maxCapacity: this.fb.control(data?.routingDetail?.maxCapacity || 0),
    //         // lockType: this.fb.control(data?.routingDetail?.lockType || ''),
    //         ridCoordinates: this.fb.control(''),
    //     }),
    //     convoyDetail: this.fb.control([]),
    //     documents: this.fb.control([]),
    // });

    initForm(index?: any, data?: any): void {
        if (index !== 1) {
            this.stepOneForm = this.fb.group({
                // convoyType: this.fb.control({ value: data?.planningWater?.convoyType || '', disabled: data?.planningWater?.convoyType ? true : false }, [...createRequiredValidators()]),
                // estimatedTimeArrival: this.fb.control(''),
                departurePort: this.fb.control(
                    {
                        value: Number(data?.planningWater?.departurePort) || '',
                        disabled: Number(data?.planningWater?.departurePort)
                            ? true
                            : false,
                    },
                    [...createRequiredValidators()]
                ),
                arrivalPort: this.fb.control(
                    {
                        value: Number(data?.planningWater?.arrivalPort) || '',
                        disabled: Number(data?.planningWater?.arrivalPort)
                            ? true
                            : false,
                    },
                    [...createRequiredValidators()]
                ),
                departurePortName: this.fb.control({
                    value: data?.planningWater?.departurePortName || '',
                    disabled: data?.planningWater?.departurePortName
                        ? true
                        : false,
                }),
                arrivalPortName: this.fb.control({
                    value: data?.planningWater?.arrivalPortName || '',
                    disabled: data?.planningWater?.arrivalPortName
                        ? true
                        : false,
                }),
                departureTime: this.fb.control({
                    value: data?.planningWater?.departureTime || '',
                    disabled: data?.planningWater?.departureTime
                        ? true
                        : false,
                }),
                arrivalTime: this.fb.control({
                    value: data?.planningWater?.arrivalTime || '',
                    disabled: data?.planningWater?.arrivalTime
                        ? true
                        : false,
                }),
                departureCompany: this.fb.control({
                    value: data?.planningWater?.departureCompany || '',
                    disabled: data?.planningWater?.departureCompany
                        ? true
                        : false,
                }),
                arrivalCompany: this.fb.control({
                    value: data?.planningWater?.arrivalCompany || '',
                    disabled: data?.planningWater?.arrivalCompany
                        ? true
                        : false,
                }),
                departureCompanyName: this.fb.control({
                    value: data?.planningWater?.departureCompany || '',
                    disabled: data?.planningWater?.departureCompany
                        ? true
                        : false,
                }),
                arrivalCompanyName: this.fb.control({
                    value: data?.planningWater?.arrivalCompany || '',
                    disabled: data?.planningWater?.arrivalCompany
                        ? true
                        : false,
                }),
                pilotCompany: this.fb.control(
                    {
                        value: data?.planningWater?.pilotCompany || '',
                        disabled: data?.planningWater?.pilotCompany
                            ? true
                            : false,
                    },
                    [...createRequiredValidators()]
                ),
                ridCoordinates: this.fb.control(
                    {
                        value: data?.planningWater?.ridCoordinates || '',
                        disabled: data?.planningWater?.ridCoordinates
                            ? true
                            : false,
                    },
                    [...createRequiredValidators()]
                ),
            });
        }
        this.schedulingForm = this.fb.group({
            routingDetail: this.stepOneForm,
            convoyDetail: this.fb.control([]),
            documents: this.fb.control([]),
        });
        const ids = data?.planningWaterShipmentProducts?.map(
            (item: any) => item?.product?.id
        );
        this.productsList = ids;
        this.stepTwoForm = this.fb.group({
            navigationType: this.fb.control('Fluvial', [
                ...createRequiredValidators(),
            ]),
            // company: this.fb.control(data?.pickUpFromCompany?.id || ''),
            ship: this.fb.control(data?.ship?.id || '', [
                ...createRequiredValidators(),
            ]),
            shipType: this.fb.control(data?.shipType || ''),
            pavilion: this.fb.control(data?.pavilion || ''),
            enginePower: this.fb.control(data?.enginePower || ''),
            lengthOverall: this.fb.control(data?.lengthOverall || ''),
            width: this.fb.control(data?.width || ''),
            maxDraft: this.fb.control(data?.maxDraft || ''),
            maxQuantity: this.fb.control(data?.maxQuantity || ''),
            shipowner: this.fb.control(data?.shipowner || ''),
            purpose: this.fb.control(data?.purpose || '', [
                ...createRequiredValidators(),
            ]),
            operator: this.fb.control(data?.operator || ''),
            trafficType: this.fb.control(data?.trafficType || '', [
                ...createRequiredValidators(),
            ]),
            operatonType: this.fb.control(data?.operatonType || '', [
                ...createRequiredValidators(),
            ]),
            // quantity: this.fb.control(data?.quantity || '', [...createRequiredValidators()]),
            numberOfCompartments: this.fb.control(
                data?.numberOfCompartments || '',
                [...createRequiredValidators()]
            ),
            observation: this.fb.control(data?.observation || '', [
                ...createRequiredValidators(),
            ]),
            products: this.fb.control(ids || [], [
                ...createRequiredValidators(),
            ]),
            lockType: this.fb.control(data?.lockType || ''),
            // arrivalGauge: this.fb.control(data?.aerialGauge || ''),
            registrationNo: this.fb.control(data?.registrationNo || ''),
            ais: this.fb.control(data?.ais || ''),
            propulsionType: this.fb.control(data?.propulsionType || ''),
            aerialGauge: this.fb.control(data?.aerialGauge || ''),
        });

        this.stepThreeForm = this.fb.group({
            clientComments: this.fb.control(data?.clientComments || ''),
            operatorComments: this.fb.control(data?.operatorComments || ''),
            additionalOperator: this.fb.control(
                localStorage.getItem('userName')
            ),
        });
    }

    saveScheduling(): void {
        this.isLoading$.next(true);
        this.convoys.push({
            ...this.stepTwoForm.value,
            ...this.stepThreeForm.value,
        });
        if (this.departureDateVal === undefined)
            this.departureDateVal = this.formatDate(this.departureDateModal);
        if (this.departureTimeVal === undefined)
            this.departureTimeVal = String(this.departureTimeVal);
        this.departureDateTimeVal = `${this.departureDateVal} ${this.departureTimeVal}`;
        if (this.arrivalDateVal === undefined)
            this.arrivalDateVal = this.formatDate(this.arrivalDateModal);
        if (this.arrivalTimeVal === undefined)
            this.arrivalTimeVal = String(this.arrivalDateModal);
        this.arrivalDateTimeVal = `${this.arrivalDateVal} ${this.arrivalTimeVal}`;
        this.stepOneForm.patchValue({
            departureTime: this.departureDateTimeVal,
            arrivalTime: this.arrivalDateTimeVal,
        });
        this.schedulingForm.patchValue({
            convoyDetail: this.convoys,
            documents: this.images,
            routingDetail: { ...this.stepOneForm.value },
        });

        if (this.id) {
            console.log(this.stepTwoForm.value);
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
