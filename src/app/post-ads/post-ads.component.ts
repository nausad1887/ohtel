import { Component, OnInit, DoCheck, KeyValueDiffers, OnDestroy } from '@angular/core';
import { HomeService } from '../home.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-post-ads',
  templateUrl: './post-ads.component.html',
  styleUrls: ['./post-ads.component.scss'],
})
export class PostAdsComponent implements OnInit, DoCheck, OnDestroy {
  public labelData = [];
  public languageID: string;
  public categorytypeID = '';
  public differ: any;
  public data = {
    categorytypeID: '',
    categorytypeName: '',
    categoryID: '',
    subCatID: '',
    loginuserID: Cookie.get('userID') ? Cookie.get('userID') : '',
    subCatName: '',
    languageID: '',
    postLevel: '',
    searchWord: '',
    subcategorylevelID: '',
  };
  spaceSubCatLists$: Observable<Array<any>>;
  spaceSubCatTypeLists$: Observable<Array<any>>;
  usedEquipSubCatLists$: Observable<Array<any>>;
  usedEquipTypeLists$: Observable<Array<any>>;
  jobsSubCatLists$: Observable<Array<any>>;
  jobsTypeLists$: Observable<Array<any>>;
  jobLevelLists$: Observable<Array<any>>;
  dealsSubCatLists$: Observable<Array<any>>;
  dealsTypeLists$: Observable<Array<any>>;

  labelSubscription: Subscription;
  languageSubscription: Subscription;

  constructor(
    public homeService: HomeService,
    private spinner: NgxSpinnerService,
    private differs: KeyValueDiffers
  ) {
    setTimeout(() => { this.makeItFalse(); });
    this.differ = this.differs.find({}).create();
  }

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    this.updatedLanguageID();
    await this.getAccountLabel().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.labelData = fulfilled;
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.labelData = [];
      }
    }).catch(() => this.spinner.hide());
    this.spaces();
    this.usedEquipments();
    this.jobs();
    this.deals();
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'selectedLanguageID') {
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
        }
        if (item.key === 'categorytypeID') {
          if (this.categorytypeID === '1') { this.jobLevelLists$ = this.homeService.jobLevelList(this.data); }
        }
      });
    }
  }

  public updatedLanguageID = () => {
    this.languageSubscription = this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
      this.data.languageID = languageID;
    });
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

  public spaces() {
    this.data.categoryID = '11';
    this.spaceSubCatLists$ = this.homeService.spacesSubCategoryList(this.data);
    this.spaceSubCatTypeLists$ = this.homeService.spacesSubCategoryTypeList(this.data);
  }
  public usedEquipments() {
    this.data.categoryID = '12';
    this.usedEquipSubCatLists$ = this.homeService.usedEquipmentSubCategoryList(this.data);
    this.usedEquipTypeLists$ = this.homeService.usedEquipmentSubCategoryTypeList(this.data);
  }
  public jobs() {
    this.data.categoryID = '13';
    this.jobsSubCatLists$ = this.homeService.jobsSubCategoryList(this.data);
    this.jobsTypeLists$ = this.homeService.jobsSubCategoryTypeList(this.data);
  }
  public deals() {
    this.data.categoryID = '14';
    this.dealsSubCatLists$ = this.homeService.dealsSubCategoryList(this.data);
    this.dealsTypeLists$ = this.homeService.dealsSubCategoryTypeList(this.data);
  }

  public getJobsRelatedData(data: any) {
    this.data.postLevel = data.subcategorylevelName;
    this.data.subcategorylevelID = data.subcategorylevelID;
  }
  public onChangeJobType(categorytypeID: string, categoryID: string) {
    this.categorytypeID = categorytypeID;
    this.data.categoryID = categoryID;
  }
  public getType(categorytypeID: string, categorytypeName: string) {
    this.data.categorytypeID = categorytypeID;
    this.data.categorytypeName = categorytypeName;
    this.homeService.updateSpaceObject(this.data);
  }
  public getCatData(rData: any) {
    this.data.categoryID = rData.categoryID;
    this.data.subCatID = rData.subcatID;
    this.data.subCatName = rData.subcatName;
    this.data.languageID = this.languageID;
    this.homeService.updateSpaceObject(this.data);
  }
  public makeItFalse() {
    this.homeService.nextCountBoolean(false);
  }
  ngOnDestroy(): void {
    if (this.labelSubscription) { this.labelSubscription.unsubscribe(); }
    if (this.languageSubscription) { this.languageSubscription.unsubscribe(); }
  }
}
//   this.typelist[0].labelName = this.labelData[0].Applicant;
//   this.typelist[1].labelName = this.labelData[0].Recruiter;
