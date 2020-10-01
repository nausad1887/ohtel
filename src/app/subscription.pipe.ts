import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subscription'
})
export class SubscriptionPipe implements PipeTransform {
  transform(subcriptionLists: Array<any>): any {
    if (subcriptionLists !== undefined || subcriptionLists !== null) {
      return subcriptionLists.sort((a, b) => {
        return a.usersubscriptionID - b.usersubscriptionID;
      });
    }
  }
}
