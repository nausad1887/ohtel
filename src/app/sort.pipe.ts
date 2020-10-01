import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {
  transform(categoryLists: Array<any>): any {
    if (categoryLists !== undefined || categoryLists !== null) {
      return categoryLists.sort((a, b) => {
        return a.categoryID - b.categoryID;
      });
    }
  }
}

