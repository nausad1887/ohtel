import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'favouriteLists'
})
export class FavouriteListsPipe implements PipeTransform {

  transform(userFavouritesLists: Array<any>): any[] {
    if (userFavouritesLists !== undefined || userFavouritesLists !== null) {
      userFavouritesLists.map((post: any) => {
        if (post.postImage) {
          const img = post.postImage.split(',');
          post.homeImage = img[0];
        } else {
          post.homeImage = '';
        }
      });
      userFavouritesLists.sort((a, b) => {
        a.statusDate = new Date(a.postCreatedDate);
        b.statusDate = new Date(b.postCreatedDate);
        if (a.statusDate.getTime() < b.statusDate.getTime()) {
          return -1;
        }
        if (a.statusDate.getTime() > b.statusDate.getTime()) {
          return 1;
        }
        return 0;
      });
      return userFavouritesLists.reverse();
    }
  }

}
