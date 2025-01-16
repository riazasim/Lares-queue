import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomFieldModel } from 'src/app/core/models/custom-field.model';
import { ProductModel } from 'src/app/core/models/product.model';
import { SchedulingCustomField } from 'src/app/core/models/scheduling.model';

@Component({
  selector: 'app-scheduling-add-product-modal',
  templateUrl: './scheduling-add-product-modal.component.html',
  styleUrls: ['./scheduling-add-product-modal.component.scss']
})
export class SchedulingAddProductModalComponent {
  product: ProductModel|null;
  productId: number|null = null;
  constructor(private readonly dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: {
                product: ProductModel,
                products: ProductModel[],
                customFieldCargoData: SchedulingCustomField[],
                cargoData: CustomFieldModel[]
              }) {
                if (this.data.product) {
                  this.productId = <number>this.data.product.id;
                  this.setProduct({ target: { value: <number>this.data.product.id }} as any)
                }
  }

  setProduct(event: Event): void {
    const product = this.data.products.find(p => p.id === +(event.target as any).value);
    this.product = {...<ProductModel>product};
  }

  resetProduct(): void {
    this.product = null;
    this.productId = null;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close({ product: this.product, customFieldCargoData: this.data.customFieldCargoData });
  }

}
