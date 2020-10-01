import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'viewpost'
})
export class ViewpostPipe implements PipeTransform {
  transform(post: Array<any>): any {
    if (post !== undefined || post !== null) {
      post.sort((a, b) => {
        a.statusDate = new Date(a.postCreatedDate);
        b.statusDate = new Date(b.postCreatedDate);
        if (a.statusDate.getTime() < b.statusDate.getTime()) { return -1; }
        if (a.statusDate.getTime() > b.statusDate.getTime()) { return 1; }
        return 0;
      });
      post.map((temp) => {
        if (temp.postImage) {
          const img = temp.postImage.split(',');
          temp.homeImage = img[0];
        } else {
          temp.homeImage = '';
        }
      });
      return post.reverse();
    }
  }
}
