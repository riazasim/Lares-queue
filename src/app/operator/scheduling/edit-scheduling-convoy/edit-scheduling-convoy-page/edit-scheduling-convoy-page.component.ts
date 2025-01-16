import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { ShipsService } from 'src/app/core/services/ships.service';
import { ProductModel } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';


@Component({
    selector: 'app-edit-scheduling-convoy-page',
    templateUrl: './edit-scheduling-convoy-page.component.html',
    styleUrl: './edit-scheduling-convoy-page.component.scss'
})
export class EditSchedulingConvoyPageComponent {
    file1Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file2Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file3Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    @ViewChild('stepper', { static: false }) matStepper: MatStepper;
    firstFormGroup = this.fb.group({
        firstCtrl: ['', []],
    });

    convoyForm: FormGroup;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    showFileThree$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isLinear = true;
    products: ProductModel[] = [];
    productsList: any[] = [];
    oldId: any[] = [];
    oldImagesId: any[] = [];
    images: any[] = [];
    tempImg: File[] = [];
    shipsList: any;
    selectedProducts: []
    selectedShips: Set<number> = new Set<number>();
    stepOne$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    id: number;
    search: string;
    shipType = [
        { id: 1, name: 'ship type1' },
        { id: 2, name: 'ship type2' },
        { id: 3, name: 'ship type3' },
    ];
    agent = [
        { id: 1, name: 'agent1' },
        { id: 2, name: 'agent2' },
        { id: 3, name: 'agent3' },
    ];
    operator = [
        { id: 1, name: 'operator1' },
        { id: 2, name: 'operator2' },
        { id: 3, name: 'operator3' },
    ];
    trafficType = [
        { id: 1, name: 'traffic type1' },
        { id: 2, name: 'traffic type2' },
        { id: 3, name: 'traffic type3' },
    ];
    operationType = [
        { id: 1, name: 'operation type1' },
        { id: 2, name: 'operation type2' },
        { id: 3, name: 'operation type3' },
    ];
    options:any

    constructor(private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly productService: ProductService,
        private readonly shipsService: ShipsService,
        private readonly snackBar: MatSnackBar,) { }

    ngOnInit(): void {
        this.getRoute();
        this.retrieveShips();
        this.retriveProducts();
        this.initConvoyForm();
        this.isLoading$.next(false)
    }
    // public filterOptions(filter: any): void {
    //     this.options = this.products.filter(x => x.name.toLowerCase().includes(filter.toLowerCase()));
    //    }

    getRoute() {
        this.id = this.route.snapshot.params['id'];
        this.planningService.getConvoy(this.id).subscribe(response => {
            response.planningConvoyDocuments.map((item: any) => {
                this.oldImagesId.push(item.id)
            })
            this.initConvoyForm(response);
            this.isLoading$.next(false);
        });
    }

    next(index: any): void {
        this.matStepper.selectedIndex = index;
    }

    retriveProducts() {
        this.isLoading$.next(true);
        let data = {
            "start": 0,
            "length": 0,
            "filters": ["", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.productService.pagination(data).subscribe(response => {
            this.products = response.items;
            this.isLoading$.next(false);
        })
    }

    onInputChange(ev : any){
        this.search = ev?.target?.value
    }

    onProductChange(ev: any) {
        if (this.productsList.includes(ev?.source?.value)) {
            const index = this.productsList.indexOf(ev?.source?.value);
            this.productsList.splice(index, 1);
        }
        else this.productsList.push(ev?.source?.value);
        this.convoyForm.patchValue({ products: `[${this.productsList}]` })
    }

    retrieveShips(): void {
        let data = {
            "start": '',
            "length": '',
            "filters": ["", "", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.shipsService.pagination(data).subscribe(response => {
            this.shipsList = response.items;
            this.updateSelectedShipsState();
            this.isLoading$.next(false);
        })
    }

    updateSelectedShipsState(): void {
        this.shipsList.forEach((ship: any) => {
            if (this.selectedShips.has(ship.id)) {
                ship.disabled = true;
            }
        });
    }

    onShipSelected(ev: any): void {
        const selectedShipId = ev.target.value
        const selectedShip = this.shipsList.find((ship: any) => Number(ship.id) === Number(selectedShipId));
        if (selectedShip) {
            this.convoyForm.patchValue({
                width: selectedShip.width || '',
                maxDraft: selectedShip.maxDraft || '',
                maxQuantity: selectedShip.maxCapacity || '',
                arrivalGauge: selectedShip.aerialGauge || '',
                lockType: selectedShip.lockType || ''
            });
        }
    }


    initConvoyForm(data?: any): void {
        const ids = data?.planningConvoyProducts?.map((item: any) => item?.product?.id)
        this.convoyForm = this.fb.group({
            navigationType: this.fb.control(data?.navigationType || '', [...createRequiredValidators()]),
            ship: this.fb.control(data?.ship?.id || '', [...createRequiredValidators()]),
            // company: this.fb.control(data?.company || '', [...createRequiredValidators()]),
            shipType: this.fb.control(data?.shipType || '', [...createRequiredValidators()]),
            pavilion: this.fb.control(data?.pavilion || '', [...createRequiredValidators()]),
            enginePower: this.fb.control(data?.enginePower || null, [...createRequiredValidators()]),
            lengthOverall: this.fb.control(data?.lengthOverall || null, [...createRequiredValidators()]),
            width: this.fb.control(data?.width || null, [...createRequiredValidators()]),
            maxDraft: this.fb.control(data?.maxDraft || null, [...createRequiredValidators()]),
            maxQuantity: this.fb.control(data?.maxCapacity || null, [...createRequiredValidators()]),
            // agent: this.fb.control(data?.agent || '', [...createRequiredValidators()]),
            // maneuvering: this.fb.control(data?.maneuvering || '', [...createRequiredValidators()]),
            shipowner: this.fb.control(data?.shipowner || '', [...createRequiredValidators()]),
            purpose: this.fb.control(data?.purpose || '', [...createRequiredValidators()]),
            operator: this.fb.control(data?.operator || '', [...createRequiredValidators()]),
            trafficType: this.fb.control(data?.trafficType || '', [...createRequiredValidators()]),
            operatonType: this.fb.control(data?.operatonType || '', [...createRequiredValidators()]),
            quantity: this.fb.control(data?.quantity || '', [...createRequiredValidators()]),
            unitNo: this.fb.control(data?.unitNo || '', [...createRequiredValidators()]),
            products: this.fb.control(ids || []),
            lockType: this.fb.control(data?.lockType || '', [...createRequiredValidators()]),
            arrivalGauge: this.fb.control(data?.aerialGauge || 0, [...createRequiredValidators()]),
            observation: this.fb.control(data?.observation || '', [...createRequiredValidators()]),
            additionalOperator: this.fb.control(data?.additionalOperator || '', [...createRequiredValidators()]),
            clientComments: this.fb.control(data?.clientComments || '', [...createRequiredValidators()]),
            operatorComments: this.fb.control(data?.operatorComments || '', [...createRequiredValidators()]),
            oldDocuments: this.fb.control(data?.oldDocuments || '', [...createRequiredValidators()]),
            documents: this.fb.control(data?.documents || [], [...createRequiredValidators()]),
        });

        this.convoyForm.get('ship')?.valueChanges.subscribe((selectedShipId) => {
            if (this.selectedShips.has(selectedShipId)) {
                this.convoyForm.get('ship')?.setErrors({ 'shipAlreadySelected': true });
            }
        });
    }

    addShipToConvoy(shipId: number): void {
        this.selectedShips.add(shipId);
        this.updateSelectedShipsState();
        this.convoyForm.patchValue({ ship: shipId });
    }

    removeShipFromConvoy(shipId: number): void {
        this.selectedShips.delete(shipId);
        this.updateSelectedShipsState();
    }

    updateConvoys(): void {
        this.isLoading$.next(true);
        this.convoyForm.patchValue({ documents: this.images, oldDocuments: `[${String(this.oldId)}]` })
        // console.log(this.convoyForm)
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

    patchFile(file: File, index: number): void {
        this.images[index] = file
        this.oldId[index] = this.oldImagesId[index]
    }

}
