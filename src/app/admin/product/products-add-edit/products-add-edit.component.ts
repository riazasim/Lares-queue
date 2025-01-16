import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from "rxjs";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/core/services/product.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { handleError } from 'src/app/shared/utils/error-handling.function';

@Component({
    selector: "app-products-add-edit",
    templateUrl: './products-add-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsAddEditComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isContentLoading$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    productForm: FormGroup;
    id: number;
    appliedFilters: any = {};
    category: any = new BehaviorSubject<any>([]);
    subCategory: any;
    search: any;
    isOptionSelected: boolean = false;
    type: string = "";
    categoryStart: number = 0;
    categoryQuery: string = "";

    status = [
        { id: 1, name: 'Active', value: 'ACTIVE' },
        { id: 2, name: 'Inactive', value: 'INACTIVE' },
    ]

    constructor(
        private readonly fb: UntypedFormBuilder,
        private readonly productService: ProductService,
        private readonly route: ActivatedRoute,
        private readonly cd: ChangeDetectorRef,
        private readonly router: Router,
        private snackBar: MatSnackBar
    ) {
        this.subscribeForQueryParams();
    }

    ngOnInit(): void {}

    onInputChange(ev: any) {
        // debugger
        this.search = ev?.target?.value
    }

    retrieveCategories(query?: any, len?: any, type?: any): void {
        this.isContentLoading$.next(true);
        this.type = type !== undefined ? String(type) : "";
        this.categoryQuery = query !== undefined ? String(query) : "";
        this.categoryStart += len !== undefined ? Number(len) : 0;

        let data = {
            "type": this.type,
            "start": this.categoryStart > 0 ? this.categoryStart : 0,
            "length":  20,
            "filter": this.categoryQuery
        }
        this.productService.getCategoryList(data).subscribe({
            next: res => {
                if (res.length > 0) {
                    let temp: any[] = [];
                    res?.forEach((item: any) => {
                        temp.push(item?.attributes);
                    });
                    this.category.next(temp);
                    this.cd.detectChanges();
                }
                if (this.category.length === 0) {
                    this.productForm.patchValue({ categoryId: null });
                }
                this.isContentLoading$.next(false);
            },
            error: err => {
                this.isContentLoading$.next(false);
                throw err
            }
        })
    }

    // retrieveCategories(type: any): void {
    //     this.productService.getCategoryList(type).subscribe({
    //         next: res => {
    //             this.category = res.map((item: any) => item.attributes) || [];
    //             if (this.category.length === 0) {
    //                 this.productForm.patchValue({ categoryId: null });
    //             }
    //             this.isLoading$.next(false);
    //         },
    //         error: err => {
    //             this.isLoading$.next(false);
    //         }
    //     });
    // }
    

    onCategoryChange(ev: any): void {
        this.isLoading$.next(true);
        // debugger
        const selectedCategoryId = Number(ev.value);
        const category = this.category.value.find((item: any) => Number(item.id) === selectedCategoryId);

        if (category) {
            this.productForm.patchValue({ categoryId: category.id });
            this.retrieveSubCategories(category.id);
        } else {
            this.isLoading$.next(false);
        }
    }

    retrieveSubCategories(categoryId: any): void {
        this.productService.getSubCategory(categoryId).subscribe({
            next: res => {
                this.subCategory = res.map((item: any) => item.attributes) || [];
                if (this.subCategory.length === 0) {
                    this.productForm.patchValue({ subCategoryId: null });
                }
                this.isLoading$.next(false);
            },
            error: err => {
                this.isLoading$.next(false);
            }
        });
    }

    subscribeForQueryParams(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            combineLatest([
                this.productService.get(this.id)
            ]).subscribe(([product]: [any]) => {
                this.retrieveCategories(product?.type)
                this.retrieveSubCategories(product?.category?.id)
                this.initForm(product);
                this.isOptionSelected = true;
                this.isLoading$.next(false);
            });
        } 
        else {
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

    initForm(data: any = <any>{}): void {
        this.productForm = this.fb.group({
            type: this.fb.control(data?.type || '', [...createRequiredValidators()]),
            name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
            productCode: this.fb.control(data?.productCode || '', [...createRequiredValidators()]),
            categoryId: this.fb.control(data?.category?.id || '', [...createRequiredValidators()]),
            subCategoryId: this.fb.control(data?.subCategory?.id || '', [...createRequiredValidators()]),
            status: this.fb.control(data?.status || '', [...createRequiredValidators()]),
        });
        if (data?.type) {
            this.isOptionSelected = true;
        }
    }

    saveProduct(): void {
        this.isLoading$.next(true);
        const parsedData = this.parseData(this.productForm.value);

        if (this.id) {
            this.productService.edit(this.id, parsedData).subscribe({
                next: () => {
                    this.isLoading$.next(false);
                    this.router.navigate(['../../success'], { relativeTo: this.route });
                },
                error: (body: any) => {
                    this.isLoading$.next(false);
                    handleError(this.snackBar, body, this.isLoading$);
                }
            });
        } else {
            this.productService.create(parsedData).subscribe({
                next: () => {
                    this.isLoading$.next(false);
                    this.router.navigate(['../success'], { relativeTo: this.route });
                },
                error: (body: any) => {
                    this.isLoading$.next(false);
                    handleError(this.snackBar, body, this.isLoading$);
                }
            });
        }
    }

    private parseData(data: any): any {
        if (!data.productId) delete data.productId;
        if (data.categoryId) data.categoryId = Number(data.categoryId);
        if (data.subCategoryId) data.subCategoryId = Number(data.subCategoryId);
        return data;
    }

    selectOption(type: string): void {
        this.retrieveCategories("",0,type)
        this.productForm.patchValue({ type });
        this.isOptionSelected = true;
    }
}
