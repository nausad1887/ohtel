import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { Observable } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  public defaultBannerImgUrl = [
    {
      id: 1,
      src: 'assets/images/about-banner.png',
      alt: 'Image_1',
      title: 'Image_1',
    },
    {
      id: 2,
      src: 'assets/images/about-banner.png',
      alt: 'Image_2',
      title: 'Image_3',
    },
    {
      id: 3,
      src: 'assets/images/about-banner.png',
      alt: 'Image_3',
      title: 'Image_3',
    },
  ];
  customOptionsBanner: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 500,
    responsiveRefreshRate: 200,
    responsive: {
      0: {
        items: 1,
        dots: false,
      },
      400: {
        items: 1,
      },
      560: {
        items: 1,
      },
      740: {
        items: 1,
      },
      920: {
        items: 1,
      },
      1080: {
        items: 1,
      },
    },
  };
  public cmsPageName = 'About Us';
  innnerHTML$: Observable<Array<any>>;
  constructor(public homeService: HomeService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.makeItFalse();
    });
    this.innnerHTML$ = this.homeService.getCmsPage(this.cmsPageName);
  }

  makeItFalse() {
    const isTrue = false;
    this.homeService.nextCountBoolean(isTrue);
  }
}
