import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'details'
})
export class DetailsPipe implements PipeTransform {
  transform(relatedAds: Array<any>, postID?: string): any {
    if (relatedAds !== undefined || relatedAds !== null) {
      relatedAds.map((post: any) => {
        if (post.postImage) {
          const img = post.postImage.split(',');
          post.homeImage = img[0];
        } else {
          post.homeImage = '';
        }
      });
      return relatedAds.filter((post: { postID: string }) => post.postID !== postID);
    }
  }
}
