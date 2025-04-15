import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, fieldName: string): any[] {
    // console.log(items, searchText, fieldName)
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(item => {
      const field = fieldName.split('?.').reduce((prev, curr) => prev && prev[curr], item);
      return field && field.toLowerCase().includes(searchText);
    });
  }

}
