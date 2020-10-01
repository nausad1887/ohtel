import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'catLabel'
})
export class CatLabelPipe implements PipeTransform {
  transform(categoryLists: Array<any>, label?: Array<any>): any {
    if (label.length > 0) {
      label.map((lanData) => {
        categoryLists[0].categoryName = lanData.Spaces;
        categoryLists[1].categoryName = lanData.Used_equipments;
        categoryLists[2].categoryName = lanData.Jobs;
      });
    }
    return categoryLists;
  }
}
