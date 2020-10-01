import { Component, OnInit, OnDestroy, DoCheck, KeyValueDiffers } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from '../home.service';
import { map, debounceTime, distinctUntilChanged, mergeMap, delay } from 'rxjs/operators';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, Subject, of, Observable } from 'rxjs';
import { trigger } from '@angular/animations';
import { fadeIn } from '../details/animation';

@Component({
  selector: 'app-used-equipment',
  templateUrl: './used-equipment.component.html',
  styleUrls: ['./used-equipment.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class UsedEquipmentComponent implements OnInit, OnDestroy, DoCheck {
  public categorytypeID = '5';
  public subCategoryId = '61';
  public locationID = '';
  public cityID: string;
  public languageID: string;
  public searchWord: string;
  public searchTexts: string;
  public filterLocation: string;
  public priceFrom: number;
  public priceTo: number;
  public selectedFilterID = [];
  public labelData = [];
  public differ: any;
  public show = 5; // 5
  public page = 1;

  public keyUp = new Subject<KeyboardEvent>();

  subCATEGORYLists$: Observable<Array<any>>;
  subCategoryTypeLists$: Observable<Array<any>>;
  locationLists$: Observable<Array<any>>;
  viewPost$: Observable<Array<any>>;

  subscription: Subscription;
  citySubscription: Subscription;
  languageSubscription: Subscription;
  labelSubscription: Subscription;

  public data = {
    loginuserID: Cookie.get('userID') ? Cookie.get('userID') : '',
    searchWord: '',
    categoryID: '',
    categorytypeID: '5',
    languageID: '',
    postType: 'Buyer',
    subCatID: '61',
    locationID: '0'
  };
  constructor(
    public route: Router,
    public activatedRoute: ActivatedRoute,
    public homeService: HomeService,
    public toastr: ToastrManager,
    private spinner: NgxSpinnerService,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find({}).create();
    this.subscription = this.keyUp
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(500),
        distinctUntilChanged(),
        mergeMap((search) => of(search).pipe(delay(100))))
      .subscribe((input) => {
        this.filterLocation = input;
      });
  }

  ngOnInit(): void {
    this.data.categoryID = this.activatedRoute.snapshot.paramMap.get('usedEquipmentsID');
    this.updatedCity();
    this.updatedLanguageID();
    this.updatedSearchWord();
    setTimeout(() => {
      this.homeService.nextCountBoolean(true);
    });
    setTimeout(() => {
      this.spinner.show();
      this.asyncFunctionCall();
    });
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        switch (item.key) {
          case 'cityID':
            this.data.locationID = '0';
            this.searchTexts = '';
            this.selectedFilterID = [];
            this.locationLists$ = this.homeService.getLocationLists(this.cityID);
            this.viewPostMethod();
            break;
          case 'searchWord':
            this.viewPostMethod();
            break;
          case 'languageID':
            this.spinner.show();
            this.getAccountLabel().then((fulfilled: Array<any>) => {
              if (fulfilled.length > 0) {
                this.labelData = fulfilled;
                this.spinner.hide();
              } else {
                this.spinner.hide();
                this.labelData = [];
              }
            }).catch(() => this.spinner.hide());
            break;
          case 'categorytypeID':
            this.viewPostMethod();
            break;
          case 'subCategoryId':
            this.viewPostMethod();
            break;
          case 'locationID':
            this.locationID ? this.searchTexts = this.selectedFilterID[0].name : this.searchTexts = '';
            break;
          default:
          // Do nothing;
        }
      });
    }
  }

  public asyncFunctionCall = async () => {
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
    this.subCategoryTypeLists$ = this.homeService.usedEquipmentSubCategoryTypeList(this.data);
    this.subCATEGORYLists$ = this.homeService.usedEquipmentSubCategoryList(this.data);
    this.locationLists$ = this.homeService.getLocationLists(this.cityID);
    this.viewPostMethod();
  }

  public onChangeSubCat(subcatID: string) {
    this.subCategoryId = subcatID;
    this.data.subCatID = subcatID;
  }
  public onChangeType(typeID: string, categorytypeName: string) {
    this.categorytypeID = typeID;
    this.data.postType = categorytypeName;
  }
  public onChangeLocation = (locationID: string, locationName: string) => {
    this.locationID = locationID;
    this.selectedFilterID = [];
    const obj = { name: locationName };
    this.selectedFilterID.push(obj);
  }
  public updatedCity = () => {
    this.citySubscription = this.homeService.updatedID.subscribe((cityId) => {
      this.cityID = cityId;
    });
  }
  public updatedLanguageID = () => {
    this.languageSubscription = this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
      this.data.languageID = languageID;
    });
  }
  public updatedSearchWord = () => {
    this.subscription = this.homeService.nextSearch.subscribe((search) => {
      this.searchWord = search;
    });
  }
  public popOutLocation(index: number) {
    for (let i = 0; i < this.selectedFilterID.length; i++) {
      if (i === index) {
        this.selectedFilterID.splice(i, 1);
        this.locationID = '';
      }
    }
  }
  public getPost(post: any) {
    this.homeService.setPostInfoInLocalStorage(post);
  }
  public filterBYprice = (price: any) => {
    this.priceFrom = price.from;
    this.priceTo = price.to;
  }

  public viewPostMethod = () => {
    this.page = 1;
    const data = {
      loginuserID: this.data.loginuserID,
      languageID: this.data.languageID,
      categoryID: this.data.categoryID,
      experianceID: '',
      educationID: '',
      postLevel: '',
      postotherArea: '',
      otherlocation: this.data.locationID ? this.data.locationID : '',
      postotherLocation: '',
      subcategoryID: this.data.subCatID,
      searchWord: this.searchWord ? this.searchWord : '',
      cityID: this.cityID,
      categorytypeID: this.categorytypeID,
      postType: this.data.postType,
      postotherYearExp: '',
      page: '0',
      pagesize: '100',
    };
    this.viewPost$ = this.homeService.viewPost(data);
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

  public postFavourites = (post: any) => {
    if (Cookie.get('userID') === undefined || Cookie.get('userID') === null || Cookie.get('userID') === '') {
      this.toastr.warningToastr('You have to sign-in first', 'warning');
    } else {
      const data = { postID: post.postID, loginuserID: Cookie.get('userID'), languageID: this.languageID };
      if (post.IsYourFavorite === 'No') {
        this.favourite(data).then((response: string) => {
          if (response === 'success') {
            this.toastr.successToastr('added', 'success');
            this.viewPostMethod();
          } else { this.toastr.errorToastr(response, 'error'); }
        }).catch((error) => console.error(error));
      } else {
        this.unfavourite(data).then((response: string) => {
          if (response === 'success') {
            this.toastr.successToastr('Removed', 'success');
            this.viewPostMethod();
          } else { this.toastr.errorToastr(response, 'error'); }
        }).catch((error) => console.error(error));
      }
    }
  }
  public unfavourite = (data: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.postingUserUnFavourites(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve('success');
          } else {
            resolve(response[0].message);
          }
        }, (error) => reject(error));
    });
  }
  public favourite = (data: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.postingUserFavourites(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve('success');
          } else {
            resolve(response[0].message);
          }
        }, (error) => reject(error));
    });
  }
  public trackByFn(item: any) {
    return item.postID;
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.citySubscription) { this.citySubscription.unsubscribe(); }
    if (this.languageSubscription) { this.languageSubscription.unsubscribe(); }
    if (this.labelSubscription) { this.labelSubscription.unsubscribe(); }
  }
}
