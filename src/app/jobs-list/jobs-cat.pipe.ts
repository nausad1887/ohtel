import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jobsCat'
})
export class JobsCatPipe implements PipeTransform {
  transform(subcategoryLists: Array<any>, categorytypeID?: string): any {
    if (subcategoryLists !== undefined || subcategoryLists !== null) {
      subcategoryLists.sort((a, b) => {
        return a.subcatID - b.subcatID;
      });
      return subcategoryLists.filter(
        (list: { categorytypeID: string; }) => list.categorytypeID === categorytypeID
      );
    }
  }
}
