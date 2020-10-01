import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'home'
})
export class HomePipe implements PipeTransform {
  transform(categoryLists: Array<any>): any {
    if (categoryLists !== undefined || categoryLists !== null) {
      categoryLists.sort((a, b) => {
        return a.categoryID - b.categoryID;
      });
      categoryLists[0].routeName = 'Spaces';
      categoryLists[1].routeName = 'Used-Equipments';
      categoryLists[2].routeName = 'Jobs';
      categoryLists[3].routeName = 'Deals';
    }
    return categoryLists;
  }
}
