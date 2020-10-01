import { Component, OnInit, OnDestroy, KeyValueDiffers, DoCheck } from '@angular/core';
import { HomeService } from '../home.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { trigger } from '@angular/animations';
import { fadeIn } from '../details/animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class HomeComponent implements OnInit, OnDestroy, DoCheck {
  public labelData = [];
  public differ: any;
  public cityID: string;
  public languageID: string;
  public message: string;
  private future: Date;

  private futureString = new Date(Date.now() + 864e5 * 0.5);
  private subscription: Subscription;
  public citySubscription: Subscription;
  public languageSubscription: Subscription;

  public deals$: Observable<Array<any>>;
  public categoryLists$: Observable<Array<any>>;
  private counter$: Observable<number>;
  public labelSubscription: Subscription;

  constructor(
    public homeService: HomeService,
    private differs: KeyValueDiffers
  ) {
    setTimeout(() => {
      this.makeItFalse();
    });
    this.differ = this.differs.find({}).create();
  }

  customOptions2: OwlOptions = {
    loop: true,
    margin: 15,
    autoplay: false,
    autoplayTimeout: 1000,
    autoplayHoverPause: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 500,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };
  customOptions: OwlOptions = {
    loop: true,
    margin: 15,
    autoplayHoverPause: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 500,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };
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
  public defaultBannerImgUrl = [
    {
      id: 1,
      src: 'assets/images/banner-img.jpg',
      alt: 'Image_1',
      title: 'Image_1',
    },
    {
      id: 2,
      src: 'assets/images/banner-img.png',
      alt: 'Image_2',
      title: 'Image_3',
    },
    {
      id: 3,
      src: 'assets/images/banner-img.jpg',
      alt: 'Image_3',
      title: 'Image_3',
    },
  ];

  ngOnInit(): void {
    this.updatedCity();
    this.updatedLanguageID();
    this.asyncFunctionCall();
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'cityID') {
          this.deals$ = this.homeService.getDeals;
        }
        if (item.key === 'languageID') {
          this.getAccountLabel().then((fulfilled: Array<any>) => {
            if (fulfilled.length > 0) {
              this.labelData = fulfilled;
            } else {
              this.labelData = [];
            }
          }).catch(() => console.error);
        }
      });
    }
  }

  public asyncFunctionCall = async () => {
    this.categoryLists$ = this.homeService.getCategoryList;
    this.deals$ = this.homeService.getDeals;
    this.getAccountLabel().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.labelData = fulfilled;
      } else {
        this.labelData = [];
      }
    }).catch(() => console.error);
    this.future = new Date(this.futureString);
    this.counter$ = interval(1000).pipe(
      map(() => Math.floor((this.future.getTime() - new Date().getTime()) / 1000)));
    this.subscription = this.counter$.subscribe((x) => {
      this.message = this.dhms(x);
    });
  }
  public updatedCity = () => {
    this.citySubscription = this.homeService.updatedID.subscribe((cityId) => {
      this.cityID = cityId;
    });
  }
  public updatedLanguageID = () => {
    this.languageSubscription = this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
    });
  }
  public handleImgError(ev: any, item: any) {
    const source = ev.srcElement;
    const imgSrc = `assets/images/deals-${item}.png`;
    source.src = imgSrc;
  }
  public makeItFalse() {
    this.homeService.nextCountBoolean(false);
  }
  public nextCountBoolean() {
    this.homeService.nextCountBoolean(true);
  }

  public dhms(t: number) {
    let days: string | number;
    let hours: string | number;
    let minutes: string | number;
    let seconds: string | number;
    days = Math.floor(t / 86400);
    t -= days * 86400;
    hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;
    seconds = t % 60;
    seconds > 10 ? (seconds = seconds) : ['0' + seconds].join();
    return days > 0
      ? [days + ':', hours + ':', minutes + ':', seconds].join('')
      : [hours + ':', minutes + ':', seconds].join('');
  }

  public getAccountLabel = () => {
    return new Promise((resolve, reject) => {
      this.labelSubscription = this.homeService.getLabel().subscribe(
        (response) => {
          if (response[0].info === 'RECORDFOUND') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        },
        (error) => reject(error)
      );
    });
  }

  public trackByFn(item: any) {
    return item.categoryID;
  }

  ngOnDestroy() {
    if (this.citySubscription) { this.citySubscription.unsubscribe(); }
    if (this.labelSubscription) { this.labelSubscription.unsubscribe(); }
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
}
