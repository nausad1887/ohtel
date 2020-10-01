import { Component, OnInit, KeyValueDiffers, DoCheck } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../home.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { getPackageData, uploadFileData, jobsRecruiter } from '../interface.component';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { VerificationPopUpComponent } from '../verification-pop-up/verification-pop-up.component';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
const accessKey = '45bb2497c3c015e6a98934742a76dabf';
@Component({
  selector: 'app-job-post-form-recruiter',
  templateUrl: './job-post-form-recruiter.component.html',
  styleUrls: ['./job-post-form-recruiter.component.scss'],
  providers: [DatePipe],
})
export class JobPostFormRecruiterComponent implements OnInit, DoCheck {
  public userInfo = [];
  public labelData = [];
  public arrEmailMode = [];
  public arrMobileMode = [];
  public arrWalkInMode = [];
  public differ: any;
  public cityList = [];
  public zipCodeListInterview = [];
  public locationList = [];
  public coordinatesValues = [];
  public packageDetails = [];
  public selectedFiles: File[] = [];
  public postCurrentDate = new Date();
  public postEndDate: string;
  public selectedLanguageID: any;
  public routeObject: any;
  public modalOption: NgbModalOptions = {};
  public recruiterForm: FormGroup;
  public minDate: any;
  public formRoute: string;
  public eData = {
    postID: null,
    email: null,
    postData: null,
  };
  public alernateContNumberData = {
    postID: null,
    alternateContactNumber: null,
    postData: null,
  };
  public contactNumberData = {
    postID: null,
    contactNumber: null,
    postData: null,
  };
  public fileToUpload = [];
  public imgURL = [];
  public postImageName = [];

  constructor(
    public homeService: HomeService,
    public toastr: ToastrManager,
    public router: Router,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    fb: FormBuilder,
    public snackBar: MatSnackBar,
    private differs: KeyValueDiffers
  ) {
    this.recruiterForm = fb.group({
      contactNumber: [
        history.state.data ? history.state.data.contactNumber : null,
        Validators.compose([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      ],
      altcontactNumber: [
        null,
        Validators.compose([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      ],
      getDateObject: [''],
      postotherInterviewTime: [''],
      email: [
        history.state.data ? history.state.data.email : '',
        Validators.compose([
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]),
      ],
      packageDetail: ['', Validators.compose([Validators.required])],
      postDescription: ['', Validators.compose([Validators.required])],
      postotherInterviewzip: [
        null,
        Validators.compose([Validators.pattern('^[0-9]*$')]),
      ],
      postotherInterviewHouse: [
        '',
        Validators.compose([Validators.maxLength(150)]),
      ],
      postotherInterviewAddressDetail: [
        '',
        Validators.compose([Validators.maxLength(150)]),
      ],
      postotherInterviewLandmark: [
        '',
        Validators.compose([Validators.maxLength(150)]),
      ],
      AddressCity: [null],
      jobLocationArea: [null, Validators.compose([Validators.required])],
      jobLocationCity: [null, Validators.compose([Validators.required])],
      organizationName: [
        '',
        Validators.compose([Validators.maxLength(60), Validators.minLength(3)]),
      ],
      ContactPerson: [
        '',
        Validators.compose([Validators.maxLength(60), Validators.minLength(3)]),
      ],
      modeEmail: [false],
      modeMobile: [false],
      modeWalkIn: [false],
    });

    // different data
    let month: any;
    let day: any;
    const dtToday = new Date();
    month = dtToday.getMonth() + 1;
    day = dtToday.getDate();
    const year = dtToday.getFullYear();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) {
      day = '0' + day.toString();
    }
    this.minDate = year + '-' + month + '-' + day;

    // for any diff
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.spinner.show();
    this.userInfo = this.homeService.getUserInfoFromLocalStorage();
    setTimeout(() => {
      this.homeService.updatedLanguageID.subscribe((languageID) => {
        this.selectedLanguageID = languageID;
      });
    });
    setTimeout(() => {
      this.spinner.show();
      this.getAccountLabel();
      this.getCities().then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.cityList = fulfilled;
        } else {
          this.cityList = [];
        }
      }).catch((error) => {
        console.error(error);
      });
      this.asyncFunctionCall();
    }, 100);
  }

  // executes when user clicks on city options
  onChangeCity(cityID: string) {
    if (cityID) {
      this.spinner.show();
      this.recruiterForm.get('jobLocationArea').patchValue(null);
      this.getLocationList(cityID).then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.locationList = fulfilled;
          this.spinner.hide();
        } else {
          this.locationList = [];
          this.spinner.hide();
        }
      }).catch((error) => {
        console.error(error);
        this.spinner.hide();
      });
    }
  }

  public onChangeInterviewAddressCity(cityID: string) {
    const data = {
      stateID: '0',
      cityID: this.cityList.filter(city => city.cityID === cityID)[0].cityID,
      locationID: '0'
    };
    this.recruiterForm.get('postotherInterviewzip').patchValue(null);
    this.zipCode(data).then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.spinner.hide();
        this.zipCodeListInterview = fulfilled;
      } else {
        this.spinner.hide();
        this.zipCodeListInterview = [];
      }
    }).catch((error) => {
      console.error(error);
      this.spinner.hide();
    });
  }

  public zipCode = (data: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.getZipCode(data).subscribe(
        (zipCode) => {
          if (zipCode[0].status === 'true') {
            resolve(zipCode[0].data);
          } else {
            resolve([]);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'selectedLanguageID') {
          this.spinner.show();
          this.getAccountLabel();
        }
      });
    }
  }

  public getAccountLabel = () => {
    return new Promise((resolve, reject) => {
      this.homeService.getLabel().subscribe((response) => {
        if (response[0].info === 'RECORDFOUND') {
          this.labelData = response[0].data;
          if (this.cityList.length > 0) {
            this.spinner.hide();
          }
          resolve(this.labelData);
        } else {
          console.error(response);
          reject(response[0].info);
        }
      });
    });
  }

  // getting location list through cityId
  public getLocationList = (cityID: string) => {
    return new Promise((resolve, reject) => {
      this.homeService.getLocationLists(cityID).subscribe(
        (locationList) => {
          if (locationList.length > 0) {
            resolve(locationList);
          } else {
            resolve([]);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  } // end of get location list function

  // getting cities
  public getCities = () => {
    return new Promise((resolve, reject) => {
      const data = {
        countryID: '1', // India
        stateID: '0'
      };
      return this.homeService.getCity(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  } // end of getCities

  // getting package data from behaviroral object
  public getPackageDataFromBehavioral = () => {
    return new Promise((resolve, reject) => {
      this.homeService.updateObject.subscribe((objectRec) => {
        if (objectRec) {
          resolve(objectRec);
        } else {
          reject('No Record Found');
        }
      }, error => {
        reject(error);
      });
    });
  } // end of behavioral function

  // async function for getting package
  public asyncFunctionCall = async () => {
    this.getPackageDataFromBehavioral().then((object: any) => {
      const data: getPackageData = {
        languageID: this.selectedLanguageID,
        loginuserID: Cookie.get('userID'),
        subcatID: object.subCatID,
        categoryID: object.categoryID,
      };
      this.routeObject = object;
      this.getPackageData(data).then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.packageDetails = fulfilled.filter(tempPackage => tempPackage.Packagedetails.length > 0)[0].Packagedetails;
          this.spinner.hide();
        } else {
          this.packageDetails = [];
          this.spinner.hide();
        }
      }).catch((error) => {
        this.spinner.hide();
      });
    }).catch((error) => {
      if (error === 'No Record Found.') {
        console.error('No Record Found.');
      } else {
        console.error(error);
      }
    });
  } // end of asyncFunctionCall

  // getting package data
  public getPackageData = (data: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.getPackageList(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  } // end of getPackage data function

  // updated packege for post-ad
  public transFormingDate = (selectedPackageDays: number) => {
    const dateNow = new Date(Date.now());
    dateNow.setTime(
      dateNow.getTime() + selectedPackageDays * 24 * 60 * 60 * 1000
    );
    this.postEndDate = this.datePipe.transform(dateNow, 'yyyy-MM-dd');
  }
  // de-selecting selected images
  public onClose(index: any) {
    for (let i = 0; i < this.imgURL.length; i++) {
      if (i === index) {
        this.imgURL.splice(i, 1);
        this.selectedFiles.splice(i, 1);
      }
    }
  } // end of onClose function

  // selection mode through radio button
  public onClickChangeModeEmail(value: any) {
    const newval = `${value}`;
    const index = this.arrEmailMode.indexOf(newval);
    if (index === -1) {
      // val not found, pushing onto array
      this.recruiterForm
        .get('email')
        .setValidators([
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]);
      this.recruiterForm.get('email').updateValueAndValidity();
      this.arrEmailMode.push(newval);
    } else {
      // val is found, removing from array
      this.recruiterForm.get('email').clearValidators();
      this.recruiterForm
        .get('email')
        .setValidators([
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]);
      this.recruiterForm.get('email').updateValueAndValidity();
      this.arrEmailMode.splice(index, 1);
    }
  } // end of onClickChangeMode

  // selection mode through radio button
  public onClickChangeModeMobile(value: any) {
    const newval = `${value}`;
    const index = this.arrMobileMode.indexOf(newval);
    if (index === -1) {
      // val not found, pushing onto array
      this.recruiterForm
        .get('contactNumber')
        .setValidators([
          Validators.required,
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ]);
      this.recruiterForm.get('contactNumber').updateValueAndValidity();
      this.arrMobileMode.push(newval);
    } else {
      // val is found, removing from array
      this.recruiterForm.get('contactNumber').clearValidators();
      this.recruiterForm
        .get('contactNumber')
        .setValidators([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]);
      this.recruiterForm.get('contactNumber').updateValueAndValidity();
      this.arrMobileMode.splice(index, 1);
    }
  } // end of onClickChangeMode

  // selection mode through radio button
  public onClickChangeModeWalkin(value: any) {
    const newval = `${value}`;
    const index = this.arrWalkInMode.indexOf(newval);
    if (index === -1) {
      // val not found, pushing onto array
      this.recruiterForm
        .get('getDateObject')
        .setValidators([Validators.required]);
      this.recruiterForm
        .get('postotherInterviewTime')
        .setValidators([Validators.required]);
      this.recruiterForm
        .get('AddressCity')
        .setValidators([Validators.required]);
      this.recruiterForm
        .get('postotherInterviewzip')
        .setValidators([Validators.required]);
      this.recruiterForm
        .get('postotherInterviewHouse')
        .setValidators([Validators.required, Validators.maxLength(150)]);
      this.recruiterForm
        .get('postotherInterviewAddressDetail')
        .setValidators([Validators.required, Validators.maxLength(150)]);
      this.recruiterForm
        .get('postotherInterviewLandmark')
        .setValidators([Validators.required, Validators.maxLength(150)]);
      this.recruiterForm.get('getDateObject').updateValueAndValidity();
      this.recruiterForm.get('postotherInterviewTime').updateValueAndValidity();
      // this.recruiterForm.get('AddressState').updateValueAndValidity();
      this.recruiterForm.get('AddressCity').updateValueAndValidity();
      this.recruiterForm.get('postotherInterviewzip').updateValueAndValidity();
      this.recruiterForm
        .get('postotherInterviewHouse')
        .updateValueAndValidity();
      this.recruiterForm
        .get('postotherInterviewAddressDetail')
        .updateValueAndValidity();
      this.recruiterForm
        .get('postotherInterviewLandmark')
        .updateValueAndValidity();
      this.arrWalkInMode.push(newval);
    } else {
      // val is found, removing from array
      // for interview address
      this.recruiterForm.get('getDateObject').clearValidators();
      this.recruiterForm.get('postotherInterviewTime').clearValidators();
      // this.recruiterForm.get('AddressState').clearValidators();
      this.recruiterForm.get('AddressCity').clearValidators();
      this.recruiterForm.get('postotherInterviewzip').clearValidators();
      this.recruiterForm.get('postotherInterviewHouse').clearValidators();
      this.recruiterForm
        .get('postotherInterviewAddressDetail')
        .clearValidators();
      this.recruiterForm.get('postotherInterviewLandmark').clearValidators();
      this.recruiterForm.get('getDateObject').updateValueAndValidity();
      this.recruiterForm.get('postotherInterviewTime').updateValueAndValidity();
      // this.recruiterForm.get('AddressState').updateValueAndValidity();
      this.recruiterForm.get('AddressCity').updateValueAndValidity();
      this.recruiterForm.get('postotherInterviewzip').updateValueAndValidity();
      this.recruiterForm
        .get('postotherInterviewHouse')
        .updateValueAndValidity();
      this.recruiterForm
        .get('postotherInterviewAddressDetail')
        .updateValueAndValidity();
      this.recruiterForm
        .get('postotherInterviewLandmark')
        .updateValueAndValidity();
      // set other than required
      this.recruiterForm
        .get('postotherInterviewHouse')
        .setValidators([Validators.maxLength(150)]);
      this.recruiterForm
        .get('postotherInterviewAddressDetail')
        .setValidators([Validators.maxLength(150)]);
      this.recruiterForm
        .get('postotherInterviewLandmark')
        .setValidators([Validators.maxLength(150)]);
      this.recruiterForm
        .get('postotherInterviewHouse')
        .updateValueAndValidity();
      this.recruiterForm
        .get('postotherInterviewAddressDetail')
        .updateValueAndValidity();
      this.recruiterForm
        .get('postotherInterviewLandmark')
        .updateValueAndValidity();
      this.arrWalkInMode.splice(index, 1);
    }
  } // end of onClickChangeMode

  // when files are selected, save them in array selectedFiles
  public fileAdded(event: any) {
    if (event.target.files.length > 50) {
      window.alert(`Images will Not Be greater than 50`);
    } else {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < event.target.files.length; i++) {
        this.selectedFiles.push(event.target.files[i] as File);
      }
    }
    setTimeout(() => {
      this.prewiewImage(event);
    }, 300);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.postImageName.push(this.selectedFiles[i].name);
    }
  } // end of fileAdded function

  // uploading files when post success
  public uploadFiles = () => {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.fileToUpload.push(this.selectedFiles[i]);
      const data: uploadFileData = {
        file: this.fileToUpload[i],
        fileName: this.postImageName[i],
        filePath: this.userInfo[0].userID,
        userID: this.userInfo[0].userID,
      };
      this.homeService.uploadFile(data).subscribe((response) => {
        if (response[0].status === 'true') {
        } else {
        }
      });
    }
  } // end of uploadFiles

  // creating url for selected images
  public prewiewImage = (event: any) => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < event.target.files.length; i++) {
      const reader = new FileReader();
      setTimeout(() => {
        reader.readAsDataURL(event.target.files[i]);
        // tslint:disable-next-line: variable-name
        reader.onload = (_event) => {
          this.imgURL.push(reader.result);
        };
      }, 100);
    }
  } // end of prewiew image function

  public markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) {
        control.markAsTouched();
        this.markFormTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  // checking which form control is invalid
  public findInvalidControls() {
    const invalid = [];
    const controls = this.recruiterForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  public isBlank(str: string) {
    return !str || /^\s*$/.test(str);
  }
  public isEmpty(str: any) {
    return !str || 0 === str.length;
  }

  // convert 12 hours to 24 hours
  public convertTime12to24 = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    // tslint:disable-next-line: prefer-const
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      const newHours = parseInt(hours, 10) + 12;
      hours = newHours.toString();
    }
    return `${hours}:${minutes}`;
  }

  public onChangeArea = (locID: string) => {
    this.getForwardGeocode(locID).then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.coordinatesValues = fulfilled;
      } else {
        this.coordinatesValues = [];
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  public getForwardGeocode = (locID: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        key: accessKey,
        query: this.locationList.filter(location => location.locationID === locID)[0].locationName
      };
      this.homeService.getForwardGeoCode(data).subscribe(
        (response) => {
          if (response.data.length > 0) {
            resolve(response.data);
          } else {
            resolve([]);
          }
        }, error => {
          reject(error);
        }
      );
    });
  }

  // posting ads on click
  public postSpaceAds = (post: any) => {
    this.markFormTouched(this.recruiterForm);
    if (!post.contactNumber && !post.email) {
      if (post.modeMobile === true && post.modeEmail === true) {
        this.arrMobileMode = [];
        this.arrEmailMode = [];
        this.onClickChangeModeMobile('Mobile');
        this.onClickChangeModeEmail('Email');
      } else if (post.modeMobile === true && post.modeEmail === false) {
        this.arrMobileMode = [];
        this.onClickChangeModeMobile('Mobile');
      } else if (post.modeMobile === false && post.modeEmail === true) {
        this.arrEmailMode = [];
        this.onClickChangeModeEmail('Email');
      } else {
        this.recruiterForm.get('contactNumber').setErrors({
          emptyMobile: true,
        });
        this.recruiterForm.get('email').setErrors({
          emptyEmail: true,
        });
      }
    } else if (
      post.modeMobile === false &&
      post.modeEmail === false &&
      post.modeWalkIn === false
    ) {
      this.recruiterForm.get('modeMobile').setErrors({
        notSelectedMobile: true,
      });
      this.recruiterForm.get('modeEmail').setErrors({
        notSelectedEmail: true,
      });
      this.recruiterForm.get('modeWalkIn').setErrors({
        notSelectedWalkIn: true,
      });
    } else if (post.modeMobile === true && post.modeEmail === true) {
      if (!post.email) {
        this.arrEmailMode = [];
        this.onClickChangeModeEmail('Email');
      } else if (!post.contactNumber) {
        this.arrMobileMode = [];
        this.onClickChangeModeMobile('Mobile');
      } else {
        this.post(post);
      }
    } else {
      this.post(post);
    }
  } // end of post-ad function

  public post = (post: any) => {
    this.recruiterForm.get('contactNumber').setErrors(null);
    this.recruiterForm.get('email').setErrors(null);
    this.recruiterForm
      .get('contactNumber')
      .setValidators([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]);
    this.recruiterForm.get('contactNumber').updateValueAndValidity();
    this.recruiterForm
      .get('email')
      .setValidators([
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]);
    this.recruiterForm.get('email').updateValueAndValidity();
    this.recruiterForm.get('modeMobile').setErrors(null);
    this.recruiterForm.get('modeEmail').setErrors(null);
    this.recruiterForm.get('modeWalkIn').setErrors(null);
    const invalidinput = this.findInvalidControls();
    if (this.recruiterForm.valid && invalidinput.length === 0) {
      this.transFormingDate(post.packageDetail.packagedetailDays);
      this.spinner.show();
      const temp = this.homeService.getPackageInfoFromLocalStorage();
      const data: jobsRecruiter = {
        languageID: this.selectedLanguageID,
        loginuserID: this.userInfo[0].userID,
        postType: temp.categorytypeName,
        categoryID: temp.categoryID,
        categorytypeID: temp.categorytypeID,
        subcategoryID: temp.subCatID,
        postLevel: '',
        postTitle: temp.categorytypeName ? temp.categorytypeName : '',
        postDescription: post.postDescription ? post.postDescription : '',
        cityID: post.jobLocationCity ? post.jobLocationCity : '0',
        postMobile: post.contactNumber ? post.contactNumber : '',
        postEmail: post.email ? post.email : '',
        postModeOfContact:
          post.modeWalkIn === true &&
            post.modeEmail === true &&
            post.modeMobile === true
            ? 'WalkIn'
            : post.modeWalkIn === false &&
              post.modeEmail === true &&
              post.modeMobile === true
              ? 'Both'
              : post.modeWalkIn === true &&
                post.modeEmail === false &&
                post.modeMobile === false
                ? 'WalkIn'
                : post.modeWalkIn === true &&
                  post.modeEmail === false &&
                  post.modeMobile === true
                  ? 'WalkIn'
                  : post.modeWalkIn === true &&
                    post.modeEmail === true &&
                    post.modeMobile === false
                    ? 'WalkIn'
                    : post.modeWalkIn === false &&
                      post.modeEmail === false &&
                      post.modeMobile === true
                      ? 'Mobile'
                      : 'Email',
        postotherArea: '',
        postImage: this.postImageName.toString()
          ? this.postImageName.toString()
          : '',
        packageID: post.packageDetail.packageID,
        postotherContactPerson: post.ContactPerson ? post.ContactPerson : '',
        postotherOragnisation: post.organizationName
          ? post.organizationName
          : '',
        zipID: '',
        packagedetailID: post.packageDetail.packagedetailID,
        packagedetailFees: post.packageDetail.packagedetailFees,
        postAlternateNo: post.alternateContactNumber
          ? post.alternateContactNumber
          : '',
        postotherLocation: post.jobLocationArea ? post.jobLocationArea : 0,
        postStartDate: this.datePipe.transform(
          this.postCurrentDate,
          'yyyy-MM-dd'
        ),
        postEndDate: this.postEndDate,
        postotherInterviewTime: post.postotherInterviewTime
          ? this.convertTime12to24(post.postotherInterviewTime)
          : '',
        postotherInterviewState: '',
        postotherInterviewzip: post.postotherInterviewzip
          ? post.postotherInterviewzip
          : '',
        postotherInterviewCity: post.AddressCity ? this.cityList.filter(city => city.cityID === post.AddressCity)[0].cityName : '',
        postotherInterviewHouse: post.postotherInterviewHouse
          ? post.postotherInterviewHouse
          : '',
        postotherInterviewLandmark: post.postotherInterviewLandmark
          ? post.postotherInterviewLandmark
          : '',
        postotherInterviewAddressDetail: post.postotherInterviewAddressDetail
          ? post.postotherInterviewAddressDetail
          : '',
        postotherInterviewDate: post.getDateObject ? post.getDateObject : '',
        postotherInterviewAdd: '',
        postLatitude: this.coordinatesValues.length > 0 ? this.coordinatesValues[0].latitude : '0',
        postLongitude: this.coordinatesValues.length > 0 ? this.coordinatesValues[0].longitude : '0'
      };
      this.homeService.postSpacesAds(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.uploadFiles();
            }, 500);
            this.spinner.hide();
            this.eData.email = post.email;
            this.eData.postID = response[0].data[0].postID;
            this.eData.postData = response[0].data[0];
            this.contactNumberData.contactNumber = post.contactNumber;
            this.contactNumberData.postData = response[0].data[0];
            this.contactNumberData.postID = response[0].data[0].postID;
            this.alernateContNumberData.postID = response[0].data[0].postID;
            this.alernateContNumberData.alternateContactNumber =
              post.altcontactNumber;
            this.alernateContNumberData.postData = response[0].data[0];
            if (
              response[0].data[0].postMobileVerified === 'Yes' &&
              response[0].data[0].postMobile === response[0].data[0].userMobile
            ) {
              if (response[0].data[0].postAlternateNoVerified === 'Yes') {
                if (response[0].data[0].postEmailVerified === 'Yes') {
                  // all are verified
                  // move to post payment page
                  this.homeService.setPostInfoInLocalStorage(
                    response[0].data[0]
                  );
                  setTimeout(() => {
                    this.router.navigate(['/recruiter-preview']);
                  }, 2000);
                } else {
                  this.modalOption.backdrop = 'static';
                  this.modalOption.keyboard = false;
                  const modalRef = this.modalService.open(
                    VerificationPopUpComponent,
                    this.modalOption
                  );
                  modalRef.componentInstance.formRoute = this.router.url;
                  modalRef.componentInstance.emailData = !this.isBlank(
                    post.email
                  )
                    ? this.eData
                    : null;
                }
              } else if (
                response[0].data[0].postEmailVerified === 'No' &&
                !this.isBlank(post.email)
              ) {
                this.modalOption.backdrop = 'static';
                this.modalOption.keyboard = false;
                const modalRef = this.modalService.open(
                  VerificationPopUpComponent,
                  this.modalOption
                );
                modalRef.componentInstance.formRoute = this.router.url;
                modalRef.componentInstance.emailData = !this.isBlank(post.email)
                  ? this.eData
                  : null;
                modalRef.componentInstance.alternateContactNumber = !this.isEmpty(
                  post.altcontactNumber
                )
                  ? this.alernateContNumberData
                  : null;
              } else if (
                response[0].data[0].postAlternateNoVerified === 'No' &&
                !this.isEmpty(post.altcontactNumber)
              ) {
                this.modalOption.backdrop = 'static';
                this.modalOption.keyboard = false;
                const modalRef = this.modalService.open(
                  VerificationPopUpComponent,
                  this.modalOption
                );
                modalRef.componentInstance.formRoute = this.router.url;
                modalRef.componentInstance.alternateContactNumber = !this.isEmpty(
                  post.altcontactNumber
                )
                  ? this.alernateContNumberData
                  : null;
              } else {
                this.homeService.setPostInfoInLocalStorage(response[0].data[0]);
                setTimeout(() => {
                  this.router.navigate(['/recruiter-preview']);
                }, 2000);
              }
            } else if (
              response[0].data[0].postAlternateNoVerified === 'No' &&
              !this.isEmpty(post.altcontactNumber)
            ) {
              if (
                response[0].data[0].postEmailVerified === 'Yes' &&
                !this.isBlank(post.email)
              ) {
                this.modalOption.backdrop = 'static';
                this.modalOption.keyboard = false;
                const modalRef = this.modalService.open(
                  VerificationPopUpComponent,
                  this.modalOption
                );
                modalRef.componentInstance.formRoute = this.router.url;
                modalRef.componentInstance.postMobile = this.contactNumberData;
                modalRef.componentInstance.alternateContactNumber = !this.isEmpty(
                  post.altcontactNumber
                )
                  ? this.alernateContNumberData
                  : null;
              } else {
                this.modalOption.backdrop = 'static';
                this.modalOption.keyboard = false;
                const modalRef = this.modalService.open(
                  VerificationPopUpComponent,
                  this.modalOption
                );
                modalRef.componentInstance.formRoute = this.router.url;
                modalRef.componentInstance.postMobile = this.contactNumberData;
                modalRef.componentInstance.emailData = !this.isBlank(post.email)
                  ? this.eData
                  : null;
                modalRef.componentInstance.alternateContactNumber = !this.isEmpty(
                  post.altcontactNumber
                )
                  ? this.alernateContNumberData
                  : null;
              }
            } else if (
              response[0].data[0].postEmailVerified === 'Yes' &&
              !this.isBlank(post.email)
            ) {
              this.modalOption.backdrop = 'static';
              this.modalOption.keyboard = false;
              const modalRef = this.modalService.open(
                VerificationPopUpComponent,
                this.modalOption
              );
              modalRef.componentInstance.formRoute = this.router.url;
              modalRef.componentInstance.postMobile = this.contactNumberData;
              modalRef.componentInstance.alternateContactNumber = !this.isEmpty(
                post.altcontactNumber
              )
                ? this.alernateContNumberData
                : null;
            } else {
              this.modalOption.backdrop = 'static';
              this.modalOption.keyboard = false;
              const modalRef = this.modalService.open(
                VerificationPopUpComponent,
                this.modalOption
              );
              modalRef.componentInstance.formRoute = this.router.url;
              modalRef.componentInstance.postMobile = this.contactNumberData;
              modalRef.componentInstance.emailData = !this.isBlank(post.email)
                ? this.eData
                : null;
              modalRef.componentInstance.alternateContactNumber = !this.isEmpty(
                post.altcontactNumber
              )
                ? this.alernateContNumberData
                : null;
            }
          } else {
            this.spinner.hide();
            console.error(response[0].message);
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );
    }
  }
}
