import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortSubCat'
})
export class SortSubCatPipe implements PipeTransform {
  transform(subcategoryLists: Array<any>): any {
    if (subcategoryLists !== undefined || subcategoryLists !== null) {
      return subcategoryLists.sort((a, b) => {
        return a.subcatID - b.subcatID;
      });
    }
  }
}
