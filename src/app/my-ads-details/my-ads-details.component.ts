import { Component, OnInit, ChangeDetectorRef, KeyValueDiffers, DoCheck } from '@angular/core';
import { Observable } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../home.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-my-ads-details',
  templateUrl: './my-ads-details.component.html',
  styleUrls: ['./my-ads-details.component.scss']
})
export class MyAdsDetailsComponent implements OnInit, DoCheck {
  public spacesDetailsData: any;
  public images: any;
  public img: any;
  public imagePath: any;
  public imageUrlArr = [];
  public defaultImageUrl = [];
  public imageUrl: any;
  public languageID: any;
  public differ: any;
  public labelData = [];
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
    private cd: ChangeDetectorRef,
    public toastr: ToastrManager,
    private spinner: NgxSpinnerService,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.makeItFalse();
    });
    this.spinner.show();
    this.getAccountLabel();
    this.spacesDetailsData = this.homeService.getPostInfoFromLocalStorage();
    this.getAdFromBrowserStorage();
    this.updatedLanguageID();
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'languageID') {
          this.spinner.show();
          this.getAccountLabel();
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

  public getAccountLabel = () => {
    return new Promise((resolve, reject) => {
      this.homeService.getLabel().subscribe((response) => {
        if (response[0].info === 'RECORDFOUND') {
          this.labelData = response[0].data;
          this.spinner.hide();
          resolve(this.labelData);
        } else {
          console.error(response);
          reject(response[0].info);
        }
      });
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
        this.imageUrlArr.push(
          `http://betaapplication.com/ohtel/backend/web/uploads/${this.imagePath}/${this.img[i]}`
        );
        this.cd.detectChanges();
      }
    } else {
      this.imageUrlArr = [];
    }
  }

  public updatedLanguageID = () => {
    this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
    });
  }

  makeItFalse() {
    const isTrue = false;
    this.homeService.nextCountBoolean(isTrue);
  }
}
