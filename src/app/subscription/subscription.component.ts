import { Component, OnInit, KeyValueDiffers, DoCheck, OnDestroy } from '@angular/core';
import { HomeService } from '../home.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit, DoCheck, OnDestroy {
  public languageID = '';
  public categoryID = '';
  public subcatID = '';
  public subTypeID = '';
  public show = 2;

  public packageDetails = [];
  public labelData = [];
  public differ: any;
  public p = 1;

  public loading = false;
  public noRecordFound = false;

  public data = {
    categoryID: '',
    subcatID: '',
    languageID: '',
    loginuserID: Cookie.get('userID') ? Cookie.get('userID') : ''
  };

  labelSubscription: Subscription;
  categoryLists$: Observable<Array<any>>;
  subcategoryLists$: Observable<Array<any>>;
  catTypeLists$: Observable<Array<any>>;
  subscriptionLists$: Observable<Array<any>>;

  planForm: FormGroup;

  constructor(
    public homeService: HomeService,
    public toastr: ToastrManager,
    private spinner: NgxSpinnerService,
    private differs: KeyValueDiffers,
    fb: FormBuilder
  ) {
    this.differ = this.differs.find({}).create();

    this.planForm = fb.group({
      categoryID: [null],
      subCatID: [null],
      catTypeID: [null]
    });
  }

  ngOnInit(): void {
    this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
      this.data.languageID = languageID;
    });
    setTimeout(() => {
      this.makeItFalse();
    });
    this.getAccountLabel().then((response: Array<any>) => {
      response.length > 0
        ? (this.labelData = response)
        : (this.labelData = []);
    }).catch(() => this.spinner.hide());

    this.subscriptionLists$ = this.homeService.getUserSubscription(this.data);
    this.categoryLists$ = this.homeService.getCategoryList;
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'languageID') {
          this.spinner.show();
          this.getAccountLabel().then((response: Array<any>) => {
            response.length > 0
              ? (this.labelData = response)
              : (this.labelData = []);
            this.spinner.hide();
          }).catch(() => this.spinner.hide());
        }
        if (item.key === 'categoryID') {
          this.modifyInputs();
          this.getSubcategoryLists(this.data);
        }
        if (item.key === 'subcatID') {
          if (this.categoryID === '14') {
            this.getPackageData()
              .then((fulfilled: Array<any>) => {
                if (fulfilled.filter(
                  (tempPackage) => tempPackage.Packagedetails.length > 0
                ).length > 0) {
                  this.loading = false;
                  this.packageDetails = fulfilled.filter(
                    (tempPackage) => tempPackage.Packagedetails.length > 0
                  )[0].Packagedetails;
                } else {
                  this.loading = false;
                  this.noRecordFound = true;
                  this.packageDetails = [];
                }
              })
              .catch((error) => {
                this.loading = false;
                console.error(error);
                // handle error
              });
          } else {
            this.planForm.get('catTypeID').patchValue(null);
            this.getCatTypeLists(this.data);
          }
        }
        if (item.key === 'subTypeID') {
          this.getPackageData()
            .then((fulfilled: Array<any>) => {
              if (fulfilled.filter(
                (tempPackage) => tempPackage.Packagedetails.length > 0
              ).length > 0) {
                this.loading = false;
                this.packageDetails = fulfilled.filter(
                  (tempPackage) => tempPackage.Packagedetails.length > 0
                )[0].Packagedetails;
              } else {
                this.loading = false;
                this.noRecordFound = true;
                this.packageDetails = [];
              }
            })
            .catch((error) => {
              this.loading = false;
              console.error(error);
              // handle error
            });
        }
      });
    }
  }

  public modifyInputs = () => {
    this.planForm.get('subCatID').patchValue(null);
    this.planForm.get('catTypeID').patchValue(null);
  }
  public onCategoryIDChange = (catID: string) => {
    if (catID !== undefined && catID !== null && catID !== '') {
      catID === '14' ? this.planForm.controls.catTypeID.disable() : this.planForm.controls.catTypeID.enable();
      this.categoryID = catID;
      this.data.categoryID = catID;
    } else {
      this.planForm.controls.catTypeID.enable();
    }
  }
  public onSubCatChange = (subCatID: string) => {
    if (subCatID !== undefined && subCatID !== null && subCatID !== '') {
      this.subcatID = subCatID;
      this.data.subcatID = subCatID;
    }
  }
  public onChangeType = (typeID: string) => {
    if (typeID !== undefined && typeID !== null && typeID !== '') { this.subTypeID = typeID; }
  }

  public getSubcategoryLists = (data: any) => {
    this.subcategoryLists$ = this.homeService.getSubCategoryList(data);
  }
  public getCatTypeLists = (data: any) => {
    this.catTypeLists$ = this.homeService.getCategoryTypeList(data);
  }

  public makeItFalse() {
    const isTrue = false;
    this.homeService.nextCountBoolean(isTrue);
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
        }, (error) => reject(error));
    });
  }

  public getPackageData = () => {
    this.noRecordFound = false;
    this.loading = true;
    this.packageDetails = [];
    return new Promise((resolve, reject) => {
      this.homeService.getPackageList(this.data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject('Error occured');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  ngOnDestroy(): void {
    if (this.labelSubscription) { this.labelSubscription.unsubscribe(); }
  }
}
