import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterById'
})
export class FilterByIdPipe implements PipeTransform {

  /**
   * Filters a list of objects which have property id
   * 
   * If there are no ids on 'include' type, empty array is returned
   * On 'exclude' type is returned the same list array
   * 
   * @param list - list of objects containing property id
   * @param type - action type which can exclude or include
   * @param ids - ids from which will take action type,
   * @returns returns the filtered list by ids
   */
  transform(list: any[], type: 'include' | 'exclude', ids: number[]): any[] {

    if (!list.length || type ==='include' && !ids.length) return [];

    if (type === 'include') {
      return list.filter(x => ids.includes(x.id));
    }

    if (type === 'exclude') {
      return list.filter(x => !ids.includes(x.id));
    }
    
    return list;
  }

}
