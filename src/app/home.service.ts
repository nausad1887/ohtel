import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { retry, catchError, shareReplay, map } from 'rxjs/operators';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';
const CACHE_SIZE = 1;
const REFRESH_INTERVAL = 10000;
const geocodeBaseUrl = 'http://api.positionstack.com/v1';
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  public label: any;
  private languageLists$: Observable<Array<any>>;
  private cityLists$: Observable<Array<any>>;
  private categoryLists$: Observable<Array<any>>;
  private spacesSubcategoryLists$: Observable<Array<any>>;
  private usedEquipmentSubcategoryLists$: Observable<Array<any>>;
  private jobsSubcategoryLists$: Observable<Array<any>>;
  private dealsSubcategoryLists$: Observable<Array<any>>;
  private spacesSubcategoryTypeLists$: Observable<Array<any>>;
  private usedEquipmentSubcategoryTypeLists$: Observable<Array<any>>;
  private jobsSubcategoryTypeLists$: Observable<Array<any>>;
  private dealsSubcategoryTypeLists$: Observable<Array<any>>;
  private jobLevelLists$: Observable<Array<any>>;
  private experianceLists$: Observable<Array<any>>;
  private educationLists$: Observable<Array<any>>;

  private subscriptionLists$: Observable<Array<any>>;
  private subCategoryLists$: Observable<Array<any>>;
  private userFavoriteLists$: Observable<Array<any>>;
  private spacesAdsLists$: Observable<Array<any>>;
  // Url
  public cityUrl = '/city/get-city-list';
  public categoryListsUrl = '/category/get-category-list';
  public languageUrl = '/language/get-language-list';
  public dealsUrl = '/users/user-home';
  public userRegistrationUrl = '/users/user-registration';
  public userLoginUrl = '/users/user-login-password';
  public subCategoryListUrl = '/subcategory/get-subcategory-list';
  public userUpdateUrl = '/users/user-update-profile';
  public userUpdateProfilePictureUrl = '/users/user-update-profile-picture';
  public changePasswordUrl = '/users/change-password';
  public forgetPasswordUrl = '/users/user-forgot-password';
  public resetPasswordUrl = '/users/reset-password';
  public getPostUrl = '/posts/get-posts';
  public spaceAdsUrl = '/posts/create-post';
  public zipCodeUrl = '/zipcode/get-zipcode-list';
  public locationUrl = '/locations/get-locations-list';
  public packageUrl = '/packages/get-package-list';
  public categoryTypeListUrl = '/categorytype/get-categorytype-list';
  public subCatLevelList = '/subcategorylevel/get-subcategorylevel-list';
  public fileUploadUrl = '/users/file-upload';
  public postMobileVerifyUrl = '/posts/verify-mobile';
  public postMobileOtpVerificationUrl = '/posts/mobile-otp-verification';
  public postMobileResendOtpUrl = '/posts/mobile-otp-resend';
  public postAlterNateMobileVerifyUrl = '/posts/verify-alternateno';
  public postAlterNateOtpVerificationUrl =
    '/posts/alternateno-otp-verification';
  public postAlterNateOtpResendUrl = '/posts/alternateno-otp-resend';
  public getCmsPageUrl = '/cmspage/get-cmspage';
  public reviewPostUrl = '/posts/review-post';
  public emailOtpVerificationUrl = '/posts/verify-email';
  public emailOtpReSendUrl = '/posts/email-otp-resend';
  public emailOtpSubmitUrl = '/posts/email-otp-verification';
  public getEducationListUrl = '/education/get-education-list';
  public getExperianceListUrl = '/experiance/get-experiance-list';
  public getStateListUrl = '/state/get-state-list';
  public myPostUrl = '/posts/my-posts';
  public postFavouritesUrl = '/userfavorite/user-favorite';
  public postUnFavouritesUrl = '/userfavorite/user-un-favorite';
  public getUserFavouritesUrl = '/userfavorite/get-user-favorites';
  public userSubscriptionUrl = '/packages/get-my-subscriptions';
  public otpResendUrl = '/users/otp-resend';
  public otpVerificationUrl = '/users/otp-verification';
  public userEmailVerificationUrl = '/users/verify-email';
  public userEmailOTPVerificationUrl = '/users/email-otp-verification';
  public userEmailOtpResendUrl = '/users/email-otp-resend';
  public userMobileVerificationUrl = '/users/verify-mobile';
  public userMobileOTPVerificationUrl = '/users/mobile-otp-verification';
  public userMobileOtpResendUrl = '/users/mobile-otp-resend';
  public userDuplicationUrl = '/users/check-user-duplication';
  public userUpdateSettingsUrl = '/users/user-update-settings';
  public userUpdateLanguageUrl = '/users/user-update-language';
  public userChangeLanguageUrl = '/language/list-labels';
  // Behavior Subject
  public userName: string;
  count: BehaviorSubject<string>;

  // Behavior Subject
  public updateNavbar: boolean;
  updateNav: BehaviorSubject<boolean>;

  public searchString: string;
  nextSearch: BehaviorSubject<string>;

  public spaceObject: object;
  updateObject: BehaviorSubject<object>;

  public cityID: string;
  updatedID: BehaviorSubject<string>;

  public postID: object;
  updatedPostID: BehaviorSubject<object>;

  public languageID: string;
  updatedLanguageID: BehaviorSubject<string>;

  public show = false;
  isShow: BehaviorSubject<boolean>;

  constructor(public http: HttpClient, public toastr: ToastrManager) {
    this.nextSearch = new BehaviorSubject(this.searchString);
    this.isShow = new BehaviorSubject(this.show);
    this.count = new BehaviorSubject(this.userName);
    this.updatedID = new BehaviorSubject(this.cityID);
    this.updateObject = new BehaviorSubject(this.spaceObject);
    this.updatedLanguageID = new BehaviorSubject(this.languageID);
    this.updatedPostID = new BehaviorSubject(this.postID);
    this.updateNav = new BehaviorSubject(this.updateNavbar);
  }

  httpOptions = {
    headers: new HttpHeaders({}),
  };

  nextString(search: string) {
    this.nextSearch.next(search);
  }
  updateNavbr(update: boolean) {
    this.updateNav.next(update);
  }
  nextCount() {
    this.count.next(Cookie.get('userName'));
  }
  nextUpdatedPostID(postData: any) {
    this.updatedPostID.next(postData);
    setTimeout(() => {
      this.setPostIDInLocalStorage(postData);
    }, 500);
  }
  nextCountBoolean(value: boolean) {
    this.isShow.next(value);
  }
  nextCityID(cityId: string) {
    this.updatedID.next(cityId);
  }
  nextLanguageID(languageID: string) {
    this.updatedLanguageID.next(languageID);
  }
  updateSpaceObject(data: object) {
    const objectData = data;
    this.updateObject.next(objectData);
    this.setPackageInfoInLocalStorage(data);
  }

  public setInfoInLocalStorage = (data: any) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }
  public setPostIDInLocalStorage = (postID: any) => {
    localStorage.setItem('postID', JSON.stringify(postID));
  }
  public setPackageInfoInLocalStorage = (data: any) => {
    localStorage.setItem('packageData', JSON.stringify(data));
  }
  public setPostInfoInLocalStorage = (data) => {
    localStorage.setItem('postDeatils', JSON.stringify(data));
  }

  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }
  public getPackageInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('packageData'));
  }
  public getPostInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('postDeatils'));
  }
  public getPostIDInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('postID'));
  }

  get getCategoryList() {
    if (!this.subCategoryLists$) {
      this.subCategoryLists$ = this.subCategoryList().pipe(shareReplay(CACHE_SIZE));
    }
    return this.subCategoryLists$;
  }
  // getting category-list
  public subCategoryList(): Observable<any> {
    const form = new FormData();
    const fdata =
      `[{"loginuserID": "","searchWord": "","languageID": "" ,"apiType": "Android","apiVersion": "1.0"}]`;
    form.append('json', fdata);
    return this.http
      .post<any>(this.categoryListsUrl, form, this.httpOptions)
      .pipe(map((response) => response = response[0].data), retry(1), catchError(this.handleError));
  }

  public spacesSubCategoryList(data: any) {
    if (!this.spacesSubcategoryLists$) {
      this.spacesSubcategoryLists$ = this.getSubCategoryList(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.spacesSubcategoryLists$;
  }
  public usedEquipmentSubCategoryList(data: any) {
    if (!this.usedEquipmentSubcategoryLists$) {
      this.usedEquipmentSubcategoryLists$ = this.getSubCategoryList(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.usedEquipmentSubcategoryLists$;
  }
  public jobsSubCategoryList(data: any) {
    if (!this.jobsSubcategoryLists$) {
      this.jobsSubcategoryLists$ = this.getSubCategoryList(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.jobsSubcategoryLists$;
  }
  public dealsSubCategoryList(data: any) {
    if (!this.dealsSubcategoryLists$) {
      this.dealsSubcategoryLists$ = this.getSubCategoryList(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.dealsSubcategoryLists$;
  }
  // getting sub category-list
  public getSubCategoryList(data: any): Observable<any> {
    const form = new FormData();
    const fData = `[{
      "loginuserID": "${data.loginuserID}",
      "searchWord":"${data.searchWord}",
      "categoryID":"${data.categoryID}",
      "languageID": "${data.languageID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.subCategoryListUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  // getting zip code through city id
  public getZipCode(data: any): Observable<any> {
    const form = new FormData();
    const zipData = `
    [{
      "loginuserID": "0",
      "languageID": "1",
      "countryID":"1",
      "stateID":"${data.stateID}",
      "cityID":"${data.cityID}",
      "locationID":"${data.locationID}",
      "apiType": "Android",
      "page" : "0",
      "pagesize": "10",
      "apiVersion": "1.0"
    }]`;
    form.append('json', zipData);
    return this.http
      .post<any>(this.zipCodeUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getLocationLists(cityID: string): Observable<any> {
    const form = new FormData();
    const fData = `[{
    "loginuserID": "0",
    "languageID": "1",
    "countryID":"1",
    "stateID":"0",
    "cityID":"${cityID}",
    "apiType": "Android",
    "page" : "0",
    "pagesize": "10",
    "apiVersion": "1.0"
  }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.locationUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  // uploading files
  userUpdateProfilePicture(file: any): Observable<any> {
    const form = new FormData();
    const x =
      '[{"apiType": "Android","apiVersion": "1.0","languageID": "1","userProfilePicture":"' +
      file.fileName +
      '","loginuserID": "' +
      file.userID +
      '"}]';
    form.append('json', x);
    return this.http
      .post<any>(this.userUpdateProfilePictureUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // this is for progress for file upload
  public file = (filedata: any) => {
    const req = new HttpRequest('POST', this.fileUploadUrl, filedata.file, {
      reportProgress: true,
    });
    this.http.request(req).subscribe((event) => {
      // Via this API, you get access to the raw event stream.
      // Look for upload progress events.
      if (event.type === HttpEventType.UploadProgress) {
        // This is an upload progress event. Compute and show the % done:
        const percentDone = Math.round((100 * event.loaded) / event.total);
        console.log(`File is ${percentDone}% uploaded.`);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
      }
    });
  }

  // uploading files
  uploadFile(fileData: any): Observable<any> {
    this.file(fileData);
    const form = new FormData();
    const x =
      '[{"loginuserID": "' +
      fileData.userID +
      '", "apiType": "Android","apiVersion": "1.0"}]';
    const fileField = fileData.file;
    const filePath = fileData.filePath;
    form.append('json', x);
    form.append('FileField', fileField);
    form.append('FilePath', filePath);
    return this.http
      .post<any>(this.fileUploadUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  get languages() {
    if (!this.languageLists$) {
      this.languageLists$ = this.getLanguageList().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.languageLists$;
  }
  public getLanguageList(): Observable<any> {
    const form = new FormData();
    const fData = '[{"loginuserID": "0","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', fData);
    return this.http
      .post<any>(this.languageUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  get getDeals() {
    if (!this.categoryLists$) {
      this.categoryLists$ = this.deals().pipe(shareReplay(CACHE_SIZE));
    }
    return this.categoryLists$;
  }
  public deals(): Observable<any> {
    const form = new FormData();
    const fDeal = `[{
      "loginuserID": "0",
      "languageID": "1",
      "page": "0",
      "pagesize": "10",
      "cityID":"1",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', fDeal);
    return this.http
      .post<any>(this.dealsUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].Banners), retry(1), catchError(this.handleError));
  }

  // creating user
  userRegistration(data): Observable<any> {
    const form = new FormData();
    const user =
      '[{"apiType": "Android","apiVersion": "1.0","languageID": "' +
      data.languageID +
      '","userFirstName": "' +
      data.userFirstName +
      '","userLastName": "' +
      data.userLastName +
      '","userEmail": "' +
      data.userEmail +
      '","userCountryCode": "' +
      data.userCountryCode +
      '","userMobile": "' +
      data.userMobile +
      '","userPassword":"' +
      data.userPassword +
      '","userDeviceType": "Android","userProfilePicture":"' +
      data.userProfilePicture +
      '","userFBID":"","userGoogleID":"0","userDeviceID":"100" }]';
    form.append('json', user);
    return this.http
      .post<any>(this.userRegistrationUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // userLogin
  userLogin(data): Observable<any> {
    const form = new FormData();
    const user =
      '[{"userPassword": "' +
      data.password +
      '", "userMobile": "' +
      data.emailOrMobileNumber +
      '","languageID": "' +
      data.languageID +
      '", "userDeviceID": "token", "apiType": "Android", "apiVersion": "1.0" }]';
    form.append('json', user);
    return this.http
      .post<any>(this.userLoginUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  get cities() {
    if (!this.cityLists$) {
      const data = {
        countryID: '1',
        stateID: '0'
      };
      this.cityLists$ = this.getCity(data).pipe(shareReplay(CACHE_SIZE));
    }
    return this.cityLists$;
  }
  public getCity(data: any): Observable<any> {
    const form = new FormData();
    const cityData = `[{
    "loginuserID": "0",
    "languageID": "1",
    "countryID":"${data.countryID}",
    "stateID":"${data.stateID}",
    "apiType": "Android",
    "page" : "0",
    "pagesize": "10",
    "apiVersion": "1.0"
  }]`;
    form.append('json', cityData);
    return this.http
      .post<any>(this.cityUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // getting state-list
  getStateList(): Observable<any> {
    const form = new FormData();
    const state =
      '[{ "loginuserID": "0","apiType": "Android","apiVersion": "1.0","countryID":"1"}]';
    form.append('json', state);
    return this.http
      .post<any>(this.getStateListUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public spacesSubCategoryTypeList(data: any) {
    if (!this.spacesSubcategoryTypeLists$) {
      this.spacesSubcategoryTypeLists$ = this.getCategoryTypeList(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.spacesSubcategoryTypeLists$;
  }
  public usedEquipmentSubCategoryTypeList(data: any) {
    if (!this.usedEquipmentSubcategoryTypeLists$) {
      this.usedEquipmentSubcategoryTypeLists$ = this.getCategoryTypeList(
        data
      ).pipe(shareReplay(CACHE_SIZE));
    }
    return this.usedEquipmentSubcategoryTypeLists$;
  }
  public jobsSubCategoryTypeList(data: any) {
    if (!this.jobsSubcategoryTypeLists$) {
      this.jobsSubcategoryTypeLists$ = this.getCategoryTypeList(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.jobsSubcategoryTypeLists$;
  }
  public dealsSubCategoryTypeList(data: any) {
    if (!this.dealsSubcategoryTypeLists$) {
      this.dealsSubcategoryTypeLists$ = this.getCategoryTypeList(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.dealsSubcategoryTypeLists$;
  }
  // getting category type list
  public getCategoryTypeList(data: any): Observable<any> {
    const form = new FormData();
    const typedata = `[{
      "loginuserID": "${data.loginuserID}",
      "searchWord":"",
      "categoryID":"${data.categoryID}",
      "languageID": "${data.languageID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', typedata);
    return this.http
      .post<any>(this.categoryTypeListUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  public jobLevelList(data: any) {
    if (!this.jobLevelLists$) {
      this.jobLevelLists$ = this.getSubCategoryLevelList(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.jobLevelLists$;
  }
  // getting SubCategoryLevelList
  public getSubCategoryLevelList(data: any): Observable<any> {
    const form = new FormData();
    const fData = `[{
      "loginuserID": "${data.loginuserID}",
      "searchWord":"",
      "categoryID":"${data.categoryID}",
      "categorytypeID":"${data.categorytypeID}",
      "languageID": "${data.languageID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.subCatLevelList, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  // get cms-Page
  public getCmsPage(cmsPageName: string): Observable<any> {
    const form = new FormData();
    const cmspage = `[{
      "loginuserID": "","languageID": "1","cmspageName": "${cmsPageName}","apiType": "Android","apiVersion": "1.0"
    }]`;
    form.append('json', cmspage);
    return this.http
      .post<any>(this.getCmsPageUrl, form, this.httpOptions)
      .pipe(map((page) => page = page[0].data), retry(1), catchError(this.handleError));
  }

  // user posts
  public getUserPosts(data: any): Observable<any> {
    const form = new FormData();
    const post = `[{
      "languageID":"${data.languageID}",
      "loginuserID": "${data.loginuserID}",
      "page":"0",
      "categoryID":"${data.categoryID}",
      "pagesize":"100",
      "apiType":"iphone",
      "apiVersion":"1.0",
      "mypostType":"${data.mypostType}"
    }]`;
    form.append('json', post);
    return this.http
      .post<any>(this.myPostUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // userUpdate
  userUpdate(userUpdate: any): Observable<any> {
    const form = new FormData();
    const user =
      '[{"apiType": "Android","apiVersion": "1.0", "languageID": "' +
      userUpdate.languageID +
      '", "loginuserID":"' +
      userUpdate.userID +
      '", "userFirstName": "' +
      userUpdate.firstName +
      '", "userLastName": "' +
      userUpdate.lastName +
      '",	"userEmail": "' +
      userUpdate.email +
      '", "userMobile": "' +
      userUpdate.mobileNumber +
      '", "userDeviceType": "Android", "userProfilePicture":"' +
      userUpdate.userProfilePicture +
      '",	"userDeviceID":"100" }]';
    form.append('json', user);
    return this.http
      .post<any>(this.userUpdateUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // change password
  changePassword(passwordData): Observable<any> {
    const form = new FormData();
    const user =
      '[{"loginuserID": "' +
      passwordData.userID +
      '","userCurrentPassword": "' +
      passwordData.currentPassword +
      '","languageID": "' +
      passwordData.languageID +
      '","userNewPassword": "' +
      passwordData.newPassword +
      '","apiType": "Android", "apiVersion": "1.0"}]';
    form.append('json', user);
    return this.http
      .post<any>(this.changePasswordUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  get spacePostAdsList() {
    return this.spacesAdsLists$.pipe(shareReplay(CACHE_SIZE));
  }
  // get post along with subcateId and cityId
  viewPost(data: any): Observable<any> {
    const form = new FormData();
    const getPost = `[{
      "languageID": "${data.languageID}",
      "loginuserID": "${data.loginuserID}",
      "categoryID": "${data.categoryID}",
      "searchWord": "${data.searchWord}",
      "categorytypeID": "${data.categorytypeID}",
      "subcategoryID": "${data.subcategoryID}",
      "postType": "${data.postType}",
      "todaysDeal": "No",
      "cityID": "${data.cityID}",
      "page": "${data.page}",
      "pagesize":"${data.pagesize}",
      "apiType": "iphone",
      "apiVersion": "1.0",
      "educationID": "${data.educationID}",
      "otherlocation": "${data.otherlocation}",
      "postotherYearExp": "${data.postotherYearExp}",
      "postotherArea": "${data.postotherArea}",
      "postotherLocation": "${data.postotherLocation}",
      "experianceID": "${data.experianceID}",
      "postLevel": "${data.postLevel}",
      "postLatitude": 23.035817,
      "postLongitude": 72.518362
    }]`;
    form.append('json', getPost);
    this.spacesAdsLists$ = this.http
      .post<any>(this.getPostUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
    return this.spacesAdsLists$;
  }
  // forget password
  forgetPassword(newPassword: any): Observable<any> {
    const form = new FormData();
    const user =
      '[{"userEmail": "' +
      newPassword.email +
      '","userCountryCode": "+91","languageID": "' +
      newPassword.languageID +
      '","userMobile": "' +
      newPassword.mobileNumber +
      '","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', user);
    return this.http
      .post<any>(this.forgetPasswordUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // otpResend
  otpResendForForgetPassword(data: any): Observable<any> {
    const form = new FormData();
    const user = `[{
        "loginuserID": "${data.loginuserID}",
        "userMobile": "${data.userMobile}",
        "languageID": "1",
        "userDeviceID": "token",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', user);
    return this.http
      .post<any>(this.otpResendUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // otpResend
  otpVerificationForForgetPassword(data: any): Observable<any> {
    const form = new FormData();
    const user = `[{
        "loginuserID": "${data.loginuserID}",
        "userOTP": "${data.userOTP}",
        "apiType": "iphone",
        "apiVersion": "1.0",
        "languageID": "1",
        "userDeviceID": "dUHZTkZ_wKE:APA91bEq4lb0webqnoTgx72aId4YOm9v5TFVe21nAhzE7fIgz3XJxP5wXJSYxgNHb-d-LeFOtKT6Q0-X5XCmxPuUAZHrB44TqnxA_hWu2ZS-CrBF_a6NNaUNfTCoGKTPUFjKeOqMkj98",
        "userDeviceType": "iphone"
      }]`;
    form.append('json', user);
    return this.http
      .post<any>(this.otpVerificationUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // sending otp in user mobile for otp verification
  mobileVerification(data: any): Observable<any> {
    const form = new FormData();
    const post =
      '[{	"languageID": "' +
      data.languageID +
      '","loginuserID":"' +
      data.loginuserID +
      '","postID":"' +
      data.postID +
      '","postMobile":"' +
      data.postMobile +
      '","page" : "0","pagesize" : "10","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', post);
    return this.http
      .post<any>(this.postMobileVerifyUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // mobile otp verification method
  mobileOtpVerification(data: any): Observable<any> {
    const form = new FormData();
    const post =
      '[{"languageID": "' +
      data.languageID +
      '","loginuserID":"' +
      data.loginuserID +
      '","postID":"' +
      data.postID +
      '","postMobile":"' +
      data.postMobile +
      '","page" : "0","pagesize" : "10","postMobileOTP":"' +
      data.postMobileOTP +
      '","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', post);
    return this.http
      .post<any>(this.postMobileOtpVerificationUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // mobile otp resend
  mobileOtpResend(data: any): Observable<any> {
    const form = new FormData();
    const user =
      '[{"languageID": "' +
      data.languageID +
      '","loginuserID":"' +
      data.loginuserID +
      '","postID":"' +
      data.postID +
      '","postMobile":"' +
      data.postMobile +
      '","page" : "0","pagesize" : "10","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', user);
    return this.http
      .post<any>(this.postMobileResendOtpUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // check user duplication
  checkUserDuplication(data: any): Observable<any> {
    const form = new FormData();
    const post = `[{
      "loginuserID": "0",
      "userEmail": "${data.userEmail}",
      "userMobile": "${data.userMobile}",
      "languageID": "${data.languageID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', post);
    return this.http
      .post<any>(this.userDuplicationUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getLabel(): Observable<any> {
    return this.label;
  }
  // change language
  changeLanguage(languageID: string): Observable<any> {
    const form = new FormData();
    const post = `[{
        "langLabelApp": "User App",
        "languageID": "${languageID}",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', post);
    this.label = this.http
      .post<any>(this.userChangeLanguageUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
    return this.label;
  }

  // user update setting
  userUpdateSettings(data: any): Observable<any> {
    const form = new FormData();
    const post = `[{
      "apiType": "Android",
      "apiVersion": "1.0",
      "languageID": "${data.languageID}",
      "loginuserID": "${data.loginuserID}",
      "userpostGoesLive":"${data.userpostGoesLive}",
      "usersystemNotification":"${data.usersystemNotification}"
      }]`;
    form.append('json', post);
    return this.http
      .post<any>(this.userUpdateSettingsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // user update Language
  userUpdateLanguage(data: any): Observable<any> {
    const form = new FormData();
    const post = `[{
      "apiType": "Android",
      "apiVersion": "1.0",
      "languageID": "${data.languageID}",
      "loginuserID":"${data.loginuserID}",
      "userDeviceID":"100"
    }]`;
    form.append('json', post);
    return this.http
      .post<any>(this.userUpdateLanguageUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // sending otp in user mobile for otp verification
  userMobileVerification(data: any): Observable<any> {
    const form = new FormData();
    const post = `[{
      "languageID": "${data.languageID}",
      "loginuserID":"${data.loginuserID}",
      "userMobile":"${data.userMobile}",
      "page" : "0",
      "pagesize" : "10",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', post);
    return this.http
      .post<any>(this.userMobileVerificationUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // sending otp in user mobile for otp verification
  userMobileOTPVerification(data: any): Observable<any> {
    const form = new FormData();
    const post = `[{
      "languageID": "${data.languageID}",
      "loginuserID":"${data.loginuserID}",
      "userMobile":"${data.userMobile}",
      "userOTP":"${data.userOTP}",
      "page" : "0",
      "pagesize" : "10",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', post);
    return this.http
      .post<any>(this.userMobileOTPVerificationUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // sending otp in user mobile for otp verification
  userMobileOtpResendVerification(data: any): Observable<any> {
    const form = new FormData();
    const post = `[{
      "languageID": "${data.languageID}",
      "loginuserID":"${data.loginuserID}",
      "userMobile":"${data.userMobile}",
      "page" : "0",
      "pagesize" : "10",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', post);
    return this.http
      .post<any>(this.userMobileOtpResendUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // sending otp in user mobile for otp verification
  userEmailVerification(data: any): Observable<any> {
    const form = new FormData();
    const post = `[{
      "languageID": "${data.languageID}",
      "loginuserID":"${data.loginuserID}",
      "userEmail":"${data.userEmail}",
      "page" : "0",
      "pagesize" : "10",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', post);
    return this.http
      .post<any>(this.userEmailVerificationUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // sending otp in user mobile for otp verification
  userEmailOTPVerification(data: any): Observable<any> {
    const form = new FormData();
    const post = `[{
      "languageID": "${data.languageID}",
      "loginuserID":"${data.loginuserID}",
      "userEmail":"${data.userEmail}",
      "userEmailOTP":"${data.userEmailOTP}",
      "page" : "0",
      "pagesize" : "10",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', post);
    return this.http
      .post<any>(this.userEmailOTPVerificationUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // sending otp in user mobile for otp verification
  userEmailOtpResendVerification(data: any): Observable<any> {
    const form = new FormData();
    const post = `[{
      "languageID": "${data.languageID}",
      "loginuserID":"${data.loginuserID}",
      "userEmail":"${data.userEmail}",
      "page" : "0",
      "pagesize" : "10",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', post);
    return this.http
      .post<any>(this.userEmailOtpResendUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // alternate mobile verification
  alternateMobileVerification(data: any): Observable<any> {
    const form = new FormData();
    const post =
      '[{	"languageID": "' +
      data.languageID +
      '","loginuserID":"' +
      data.loginuserID +
      '","postID":"' +
      data.postID +
      '","postAlternateNo":"' +
      data.postAlternateNo +
      '","page" : "0","pagesize" : "10","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', post);
    return this.http
      .post<any>(this.postAlterNateMobileVerifyUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // alternate mobile otp verification
  alternateMobileOtpVerification(data: any): Observable<any> {
    const form = new FormData();
    const post =
      '[{"languageID": "' +
      data.languageID +
      '","loginuserID":"' +
      data.loginuserID +
      '","postID":"' +
      data.postID +
      '","postAlternateNo":"' +
      data.postAlternateNo +
      '","page" : "0","pagesize" : "10","postAlternateNoOTP":"' +
      data.postAlternateNoOTP +
      '","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', post);
    return this.http
      .post<any>(this.postAlterNateOtpVerificationUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // resend otp for alternate mobile number
  alternateMobileOtpResend(data: any): Observable<any> {
    const form = new FormData();
    const user =
      '[{"languageID": "' +
      data.languageID +
      '","loginuserID":"' +
      data.loginuserID +
      '","postID":"' +
      data.postID +
      '","postAlternateNo":"' +
      data.postAlternateNo +
      '","page" : "0","pagesize" : "10","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', user);
    return this.http
      .post<any>(this.postAlterNateOtpResendUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // email verification method
  emailVerification(data: any): Observable<any> {
    const form = new FormData();
    const user =
      '[{"languageID": "' +
      data.languageID +
      '","loginuserID":"' +
      data.loginuserID +
      '","postID":"' +
      data.postID +
      '","postEmail":"' +
      data.postEmail +
      '","page" : "0","pagesize" : "10","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', user);
    return this.http
      .post<any>(this.emailOtpVerificationUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // mobile otp resend
  emailOtpReSend(data: any): Observable<any> {
    const form = new FormData();
    const user =
      '[{"languageID": "' +
      data.languageID +
      '","loginuserID":"' +
      data.loginuserID +
      '","postID":"' +
      data.postID +
      '","postEmail":"' +
      data.postEmail +
      '","page" : "0","pagesize" : "10","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', user);
    return this.http
      .post<any>(this.emailOtpReSendUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // mobile otp resend
  emailOtpSubmit(data: any): Observable<any> {
    const form = new FormData();
    const user =
      '[{"languageID": "' +
      data.languageID +
      '","loginuserID":"' +
      data.loginuserID +
      '","postID":"' +
      data.postID +
      '","postEmail":"' +
      data.postEmail +
      '","postEmailOTP":"' +
      data.postEmailOTP +
      '","page" : "0","pagesize" : "10","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', user);
    return this.http
      .post<any>(this.emailOtpSubmitUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // reset password
  resetPassword(password: any): Observable<any> {
    const form = new FormData();
    const user =
      '[{"loginuserID": "' +
      password.userID +
      '","languageID": "' +
      password.languageID +
      '", "userNewPassword":"' +
      password.newPassword +
      '","apiType": "Android", "apiVersion": "1.0"}]';
    form.append('json', user);
    return this.http
      .post<any>(this.resetPasswordUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // getting pakage-list
  getPackageList(packageData: any): Observable<any> {
    const form = new FormData();
    const pac =
      '[{"loginuserID": "' +
      packageData.loginuserID +
      '","languageID": "' +
      packageData.languageID +
      '","countryID":"1","categoryID":"' +
      packageData.categoryID +
      '","packageUserType":"0","subcatID":"' +
      packageData.subcatID +
      '","apiType": "Android","page" : "0","pagesize": "20","apiVersion": "1.0"}]';
    form.append('json', pac);
    return this.http
      .post<any>(this.packageUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  get education() {
    if (!this.educationLists$) {
      this.educationLists$ = this.getEducationList().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.educationLists$;
  }
  getEducationList(): Observable<any> {
    const form = new FormData();
    const pac =
      '[{"loginuserID": "0","searchWord":"","languageID": "1","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', pac);
    return this.http
      .post<any>(this.getEducationListUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  get experiance() {
    if (!this.experianceLists$) {
      this.experianceLists$ = this.getExperianceList().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.experianceLists$;
  }
  getExperianceList(): Observable<any> {
    const form = new FormData();
    const pac =
      '[{"loginuserID": "0","searchWord":"","languageID": "1","apiType": "Android", "apiVersion": "1.0"}]';
    form.append('json', pac);
    return this.http
      .post<any>(this.getExperianceListUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  // getting user favourites lists
  public getUserSubscription(data: any): Observable<any> {
    const form = new FormData();
    const subData = `[{
      "loginuserID": "${data.loginuserID}",
      "languageID": "${data.languageID}",
      "apiType": "Android",
      "page" : "0",
      "pagesize": "1000",
      "apiVersion": "1.0"
    }]`;
    form.append('json', subData);
    this.subscriptionLists$ = this.http
      .post<any>(this.userSubscriptionUrl, form, this.httpOptions)
      .pipe(map((response) => response = response[0].data), retry(1), catchError(this.handleError));
    return this.subscriptionLists$;
  }

  // getting user favourites lists
  public getUserFavourites(data: any): Observable<any> {
    const form = new FormData();
    const fav = `[{
      "loginuserID": "${data.loginuserID}",
      "languageID": "${data.languageID}",
      "categoryID":"${data.categoryID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', fav);
    this.userFavoriteLists$ = this.http
      .post<any>(this.getUserFavouritesUrl, form, this.httpOptions)
      .pipe(map((response) => response = response[0].data), retry(1), catchError(this.handleError));
    return this.userFavoriteLists$;
  }

  // getting user favourites lists
  postingUserFavourites(data: any): Observable<any> {
    const form = new FormData();
    const fav =
      '[{"loginuserID": "' +
      data.loginuserID +
      '","languageID": "' +
      data.languageID +
      '", "postID": "' +
      data.postID +
      '","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', fav);
    return this.http
      .post<any>(this.postFavouritesUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // getting user favourites lists
  postingUserUnFavourites(data: any): Observable<any> {
    const form = new FormData();
    const fav =
      '[{"loginuserID": "' +
      data.loginuserID +
      '","languageID": "' +
      data.languageID +
      '","postID": "' +
      data.postID +
      '","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', fav);
    return this.http
      .post<any>(this.postUnFavouritesUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  postSpacesAds(data: any): Observable<any> {
    const form = new FormData();
    const post = `[{
      "languageID": "${data.languageID}",
      "loginuserID": "${data.loginuserID}",
      "postType": "${data.postType}",
      "postLevel": "${data.postLevel}",
      "categoryID": "${data.categoryID}",
      "categorytypeID": "${data.categorytypeID}",
      "subcategoryID": "${data.subcategoryID}",
      "postTitle": "${data.postTitle}",
      "postDescription": "${data.postDescription}",
      "cityID": "${data.cityID}",
      "postMobile": "${data.postMobile}",
      "postEmail": "${data.postEmail}",
      "postModeOfContact": "${data.postModeOfContact}",
      "postEmailVerified": "No",
      "postMobileVerified": "Yes",
      "postImage": "${data.postImage}",
      "packageID": "${data.packageID}",
      "postStartDate": "${data.postStartDate}",
      "postEndDate": "${data.postEndDate}",
      "postotherArea": "${data.postotherArea}",
      "postotherOragnisation": "${data.postotherOragnisation}",
      "postotherLocation": "${data.postotherLocation}",
      "postotherContactPerson": "${data.postotherContactPerson}",
      "zipID": "${data.zipID}",
      "postotherPrice": "${data.postotherPrice}",
      "postotherInterviewDate": "${data.postotherInterviewDate}",
      "postotherInterviewAdd": "${data.postotherInterviewAdd}",
      "postotherFirstName":"${data.postotherFirstName}",
      "postotherLastName": "${data.postotherLastName}",
      "postotherJobRole": "${data.postotherJobRole}",
      "postotherYearExp": "${data.postotherYearExp}",
      "educationID": "${data.educationID}",
      "experianceID": "${data.experianceID}",
      "postotherSalary": "${data.postotherSalary}",
      "postotherIndia": "${data.postotherIndia}",
      "postotherAbroad": "${data.postotherAbroad}",
      "postotherResume": "${data.postotherResume}",
      "packagedetailID": "${data.packagedetailID}",
      "packagedetailFees": "${data.packagedetailFees}",
      "packagedetailCurrency": "${data.packagedetailCurrency}",
      "postLatitude": "${data.postLatitude}",
      "postLongitude": "${data.postLongitude}",
      "apiType": "iphone",
      "apiVersion": "1.0",
      "postGSTCharges": "10",
      "postAlternateNo": "${data.postAlternateNo}",
      "postAlternateNoVerified": "No",
      "postGST": "5",
      "postotherInterviewTime": "${data.postotherInterviewTime}",
      "postotherInterviewState": "${data.postotherInterviewState}",
      "postotherInterviewzip": "${data.postotherInterviewzip}",
      "postotherInterviewCity": "${data.postotherInterviewCity}",
      "postotherInterviewHouse": "${data.postotherInterviewHouse}",
      "postotherInterviewLandmark": "${data.postotherInterviewLandmark}",
      "postotherInterviewAddressDetail": "${data.postotherInterviewAddressDetail}"
    }]`;
    form.append('json', post);
    return this.http
      .post<any>(this.spaceAdsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  reviewPost(data: any): Observable<any> {
    const form = new FormData();
    const post =
      '[{"languageID": "' +
      data.languageID +
      '","loginuserID": "' +
      data.loginuserID +
      '","postType": "' +
      data.postType +
      '","postLevel": "", "categoryID": "' +
      data.categoryID +
      '","categorytypeID": "' +
      data.categorytypeID +
      '","subcategoryID": "' +
      data.subcategoryID +
      '", "postTitle": "' +
      data.postTitle +
      '","postDescription": "' +
      data.postDescription +
      '","cityID": "' +
      data.cityID +
      '","postMobile": "' +
      data.postMobile +
      '", "postEmail": "' +
      data.postEmail +
      '", "postModeOfContact": "' +
      data.postModeOfContact +
      '", "postEmailVerified": "No","postMobileVerified": "Yes", "postImage": "' +
      data.postImage +
      '", "packageID": "' +
      data.packageID +
      '", "postStartDate": "2020-02-21", "postEndDate": "2020-04-21", "postotherArea": "", "postotherOragnisation": "' +
      data.postotherOragnisation +
      '", "postotherLocation": "1", "postotherContactPerson": "", "zipID": "' +
      data.zipID +
      '", "postotherPrice": "' +
      data.postotherPrice +
      '", "postotherInterviewDate": "", "postotherInterviewAdd": "", "postotherFirstName":"", "postotherLastName": "", "postotherJobRole": "", "postotherYearExp": "", "educationID": "", "experianceID": "", "postotherSalary": "", "postotherIndia": "", "postotherAbroad": "", "postotherResume": "", "packagedetailID": "' +
      data.packagedetailID +
      '", "packagedetailFees": "' +
      data.packagedetailFees +
      '", "packagedetailCurrency": "' +
      data.packagedetailCurrency +
      '", "postLatitude": "23.0350", "postLongitude": "72.5293","apiType": "iphone", "apiVersion": "1.0", "postGSTCharges": "10", "postAlternateNo": "' +
      data.postAlternateNo +
      '", "postAlternateNoVerified": "No", "postGST": "5", "postotherInterviewTime": "","postotherInterviewState": "", "postotherInterviewzip": "", "postotherInterviewCity": "", "postotherInterviewHouse": "", "postotherInterviewLandmark": "", "postotherInterviewAddressDetail": ""}]';
    form.append('json', post);
    return this.http
      .post<any>(this.reviewPostUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // ErrorHandling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get Client Side Error
      errorMessage = error.error.messages;
    } else {
      // Get Server-Side Error
      errorMessage = `Error Code : ${error.status}\nMessage : ${error.messsage}`;
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }

  // Forward Geocoding API Endpoint
  getForwardGeoCode(data: any): Observable<any> {
    return this.http
      .get<any>(`${geocodeBaseUrl}/forward?access_key=${data.key}&query=${data.query}&limit=1&output=json`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // Reverse Geocoding API Endpoint
  getReverseGeoCode(data: any): Observable<any> {
    return this.http
      .get<any>(`${geocodeBaseUrl}/reverse?access_key=${data.key}&query=${data.query}&limit=1&output=json`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
