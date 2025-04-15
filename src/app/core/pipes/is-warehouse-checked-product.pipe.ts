import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isWarehouseCheckedProduct'
})
export class IsWarehouseCheckedProductPipe implements PipeTransform {

  transform(warehouses: Map<number, number[]>, locationId: number|undefined, warehouseId: number|undefined): boolean {
    if (!warehouses.get(locationId||0)?.length) return false;

    if (!locationId) return false;

    return (warehouses.get(locationId) || []).includes(warehouseId||0);
  }

}
