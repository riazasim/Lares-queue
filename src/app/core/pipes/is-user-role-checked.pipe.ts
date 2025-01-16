import { Pipe, PipeTransform } from '@angular/core';
import { CreateUserRoleModuleModel, UserRoleModule } from '../models/user-role-modules.model';

@Pipe({
  name: 'isUserRoleChecked'
})
export class IsUserRoleCheckedPipe implements PipeTransform {

  transform(row: UserRoleModule, roles: CreateUserRoleModuleModel[], access: string): boolean {
    const module = roles.find(r => r.moduleId === row.id);
    if (module) {
      return module?.roles.includes(this.getModuleAccess(row.name, access));
    }

    return false;
  }

  private getModuleAccess(name: string, access: string): string {
    switch(true) {
      case name.toLowerCase().includes('location'): return `location_${access}`;
      case ['warehouses', 'warehouse', 'buildings', 'building'].includes(name.toLowerCase()): return `warehouse_${access}`;
      case ['docks', 'dock', 'transfer points'].includes(name.toLowerCase()): return `dock_${access}`;
      case name.toLowerCase().includes('product'): return `product_${access}`;
      case name.toLowerCase().includes('planing'): return `planing_${access}`;
      default: return '';
    }
  }

}
