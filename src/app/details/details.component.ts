import { Component, OnInit, KeyValueDiffers, DoCheck } from '@angular/core';
import { HomeService } from '../home.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, DoCheck {
  public spacesDetailsData: any;
  public images: any;
  public img: any;
  public imagePath: any;
  public imageUrlArr = [];
  public defaultImageUrl = [];
  public languageID: string;
  public differ: any;
  public labelData = [];
  spacesAdsLists$: Observable<Array<any>>;
  labelSubscription: Subscription;
  languageSubscription: Subscription;
  customOptions: OwlOptions = {
    loop: true,
    margin: 15,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 500,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 2,
      },
      940: {
        items: 2,
      },
    },
  };
  public userID: string;

  constructor(
    public homeService: HomeService,
    public toastr: ToastrManager,
    private spinner: NgxSpinnerService,
    private differs: KeyValueDiffers,
    private location: Location
  ) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    setTimeout(() => { this.makeItFalse(); });
    this.spinner.show();
    this.getAccountLabel().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.labelData = fulfilled;
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.labelData = [];
      }
    }).catch(() => {
      this.spinner.hide();
    });
    this.spacesDetailsData = this.homeService.getPostInfoFromLocalStorage();
    this.getRelatedAds();
    this.getAdFromBrowserStorage();
    this.updatedLanguageID();
  }

  goBack() {
    this.location.back();
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'languageID') {
          this.spinner.show();
          this.getAccountLabel().then((fulfilled: Array<any>) => {
            if (fulfilled.length > 0) {
              this.labelData = fulfilled;
              this.spinner.hide();
            } else {
              this.spinner.hide();
              this.labelData = [];
            }
          }).catch(() => {
            this.spinner.hide();
          });
        }
      });
    }
  }

  public getAdFromBrowserStorage = () => {
    this.images = this.spacesDetailsData.postImage;
    this.userID = this.spacesDetailsData.userID;
    this.img = this.images.split(',');
    this.imagePath = this.userID;
    this.arrOfImg();
    this.defaultImage();
  }

  public onClickAds = (ad: any) => {
    this.spacesDetailsData = ad;
    this.defaultImageUrl = [];
    this.imageUrlArr = [];
    this.getRelatedAds();
    this.getAdFromBrowserStorage();
  }

  public getRelatedAds = () => {
    this.spacesAdsLists$ = this.homeService.spacePostAdsList;
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

  public defaultImage = () => {
    if (this.spacesDetailsData.categoryName === 'Used Equipments') {
      for (let i = 1; i <= 4; i++) {
        this.defaultImageUrl.push(`assets/images/equipments${i}.jpg`);
      }
    } else {
      for (let i = 1; i <= 4; i++) {
        this.defaultImageUrl.push(`assets/images/spaces${i}.png`);
      }
    }
  }

  public handleImgError(ev: any, item: any) {
    const source = ev.srcElement;
    const imgSrc = `assets/images/spaces${item + 1}.png`;
    source.src = imgSrc;
  }

  public arrOfImg = () => {
    if (this.images) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.img.length; i++) {
        this.imageUrlArr.push(`http://betaapplication.com/ohtel/backend/web/uploads/${this.imagePath}/${this.img[i]}`);
      }
    } else {
      this.imageUrlArr = [];
    }
  }

  public updatedLanguageID = () => {
    this.languageSubscription = this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
    });
  }

  public postFavourites = (post: any) => {
    if (Cookie.get('userID') === undefined || Cookie.get('userID') === null || Cookie.get('userID') === '') {
      this.toastr.warningToastr('You Have To Sign-In First', 'warning');
    } else {
      this.spinner.show();
      if (post.IsYourFavorite === 'No') {
        const data = {
          postID: post.postID,
          loginuserID: Cookie.get('userID'),
          languageID: this.languageID,
        };
        this.homeService.postingUserFavourites(data).subscribe(
          (response) => {
            if (response[0].status === 'true') {
              this.getRelatedAds();
              this.spinner.hide();
              this.toastr.successToastr('Added');
            } else {
              this.spinner.hide();
              console.error(response[0].message);
            }
          },
          (error) => {
            console.error(error);
            this.spinner.hide();
          }
        );
      } else {
        const data = {
          postID: post.postID,
          loginuserID: Cookie.get('userID'),
          languageID: this.languageID,
        };
        this.homeService.postingUserUnFavourites(data).subscribe(
          (response) => {
            if (response[0].status === 'true') {
              this.getRelatedAds();
              this.spinner.hide();
              this.toastr.successToastr('Un-Favourites');
            } else {
              this.spinner.hide();
              console.error(response[0].message);
            }
          },
          (error) => {
            console.error(error);
            this.spinner.hide();
          }
        );
      }
    }
  }

  makeItFalse() {
    this.homeService.nextCountBoolean(false);
  }
}
