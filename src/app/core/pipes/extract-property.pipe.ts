import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractProperty'
})
export class ExtractPropertyPipe implements PipeTransform {

  transform(list: any[], property: string): string {
    if (!list?.length) {
      return '-';
    }

    if (list.length === 1) {
      return list[0][property];
    }

    return list.map(e => e[property]).join(', ');
  }

}
