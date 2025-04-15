import { Pipe, PipeTransform } from '@angular/core';
import { DockModel } from '../models/dock.model';

@Pipe({
  name: 'hasPartnerDockAccess'
})
export class HasPartnerDockAccessPipe implements PipeTransform {

  transform(dock: DockModel, docks: number[]): boolean {
    if (docks.length) {
      return docks.includes(<number>dock?.id);
    }

    return false;
  }

}
