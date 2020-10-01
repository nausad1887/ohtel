import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByPrice'
})
export class FilterByPricePipe implements PipeTransform {
  transform(postArr: Array<any>, priceFrom?: number, priceTo?: number): any {
    if (!priceFrom && !priceTo) {
      return postArr;
    }
    return postArr.filter(postPrice => postPrice.postotherPrice >= priceFrom && postPrice.postotherPrice <= priceTo);
  }
}
