import { Component, OnInit, DoCheck, KeyValueDiffers } from '@angular/core';
import { HomeService } from '../home.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { VerificationPopUpComponent } from '../verification-pop-up/verification-pop-up.component';
import {
  spacePostAdFormData,
  getPackageData,
  uploadFileData,
} from '../interface.component';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { contactPresent } from '../valueCheck.validator';
const accessKey = '45bb2497c3c015e6a98934742a76dabf';
@Component({
  selector: 'app-spaces-post-ads-form',
  templateUrl: './spaces-post-ads-form.component.html',
  styleUrls: ['./spaces-post-ads-form.component.scss'],
  providers: [DatePipe],
})
export class SpacesPostAdsFormComponent implements OnInit, DoCheck {
  public userInfo = [];
  public arrEmailMode = [];
  public arrMobileMode = [];
  public cityList = [];
  public cityListArray = [];
  public zipCodeList = [];
  public locationList = [];
  public coordinatesValues = [];
  public packageDetails = [];
  public selectedFiles: File[] = [];
  public postCurrentDate = new Date();
  public postEndDate: string;
  public differ: any;
  // input data
  public selectedLanguageID: any;
  public routeObject: any;
  public modalOption: NgbModalOptions = {}; // not null!
  public isBuyer = false;
  public isSeller = false;
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
  public labelData = [];
  postForm: FormGroup;

  constructor(
    public homeService: HomeService,
    public router: Router,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    public snackBar: MatSnackBar,
    public fb: FormBuilder,
    private differs: KeyValueDiffers
  ) {
    // validation
    this.postForm = this.fb.group({
      contactNumber: [
        history.state.data ? history.state.data.contactNumber : null,
        Validators.compose([
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          contactPresent,
        ]),
      ],
      altcontactNumber: [
        null,
        Validators.compose([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      ],
      areaInSqFt: ['', [Validators.pattern('^[0-9]*$')]],
      price: ['', [Validators.pattern('^[0-9]*$')]],
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
      postotherArea: ['', Validators.compose([Validators.maxLength(150)])],
      organizationName: [
        '',
        Validators.compose([Validators.maxLength(60), Validators.minLength(3)]),
      ],
      ContactPerson: [
        '',
        Validators.compose([Validators.maxLength(60), Validators.minLength(3)]),
      ],
      city: [null, Validators.compose([Validators.required])],
      area: [null, Validators.compose([Validators.required])],
      zip: [null, Validators.compose([Validators.required])],
      modeEmail: [false],
      modeMobile: [false],
    });
    // for any diff
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.userInfo = this.homeService.getUserInfoFromLocalStorage();
    setTimeout(() => {
      this.homeService.updatedLanguageID.subscribe((languageID) => {
        this.selectedLanguageID = languageID;
      });
    });
    this.spinner.show();
    this.getAccountLabel();
    this.getCities()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.cityList = fulfilled;
        } else {
          this.cityList = [];
        }
      })
      .catch((error) => {
        console.error(error);
      });
    this.asyncFunctionCall();
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

  // executes when user clicks on city options
  onChangeCity(cityID: string) {
    if (cityID) {
      this.spinner.show();
      this.postForm.get('area').patchValue(null);
      this.postForm.get('zip').patchValue(null);
      this.getLocationList(cityID)
        .then((fulfilled: Array<any>) => {
          if (fulfilled.length > 0) {
            this.locationList = fulfilled;
            this.spinner.hide();
          } else {
            this.locationList = [];
            this.spinner.hide();
          }
        })
        .catch((error) => {
          console.error(error);
          this.spinner.hide();
        });
    }
  } // end of onChangeCity function

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
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
        stateID: '0',
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

  // getting zipCode through cityID
  public getZipCode = async (locID: any) => {
    const data = await this.locationList.filter(
      (location) => location.locationID === locID)[0];
    this.zipCode(data)
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.spinner.hide();
          this.zipCodeList = fulfilled;
        } else {
          this.spinner.hide();
          this.zipCodeList = [];
        }
      })
      .catch((error) => {
        console.error(error);
        this.spinner.hide();
      });
  } // end of getZipCode function

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

  // getting package data from behaviroral object
  public getPackageDataFromBehavioral = () => {
    return new Promise((resolve, reject) => {
      this.homeService.updateObject.subscribe(
        (objectRec) => {
          if (objectRec) {
            resolve(objectRec);
          } else {
            reject('No Record Found');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  } // end of behavioral function

  // async function for getting package
  public asyncFunctionCall = async () => {
    this.getPackageDataFromBehavioral()
      .then((object: any) => {
        const data: getPackageData = {
          languageID: this.selectedLanguageID,
          loginuserID: Cookie.get('userID'),
          subcatID: object.subCatID,
          categoryID: object.categoryID,
        };
        this.checkPostType(object);
        this.routeObject = object;
        this.getPackageData(data)
          .then((fulfilled: Array<any>) => {
            if (fulfilled.length > 0) {
              this.packageDetails = fulfilled.filter(
                (tempPackage) => tempPackage.Packagedetails.length > 0
              )[0].Packagedetails;
              this.spinner.hide();
            } else {
              this.packageDetails = [];
              this.spinner.hide();
            }
          })
          .catch((error) => {
            this.spinner.hide();
          });
      })
      .catch((error) => {
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

  public checkPostType(value: any) {
    if (value.categorytypeName === 'Buyer') {
      this.isBuyer = true;
      this.isSeller = false;
      this.postForm.get('zip').clearValidators();
      this.postForm.get('zip').updateValueAndValidity();
    } else {
      this.isBuyer = false;
      this.isSeller = true;
      this.postForm.get('zip').setValidators([Validators.required]);
      this.postForm.get('zip').updateValueAndValidity();
    }
  }

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
      this.postForm
        .get('email')
        .setValidators([
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]);
      this.postForm.get('email').updateValueAndValidity();
      this.arrEmailMode.push(newval);
    } else {
      // val is found, removing from array
      this.postForm.get('email').clearValidators();
      this.postForm
        .get('email')
        .setValidators([
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]);
      this.postForm.get('email').updateValueAndValidity();
      this.arrEmailMode.splice(index, 1);
    }
  } // end of onClickChangeMode

  // selection mode through radio button
  public onClickChangeModeMobile(value: any) {
    const newval = `${value}`;
    const index = this.arrMobileMode.indexOf(newval);
    if (index === -1) {
      // val not found, pushing onto array
      this.postForm
        .get('contactNumber')
        .setValidators([
          Validators.required,
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ]);
      this.postForm.get('contactNumber').updateValueAndValidity();
      this.arrMobileMode.push(newval);
    } else {
      // val is found, removing from array
      this.postForm.get('contactNumber').clearValidators();
      this.postForm
        .get('contactNumber')
        .setValidators([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]);
      this.postForm.get('contactNumber').updateValueAndValidity();
      this.arrMobileMode.splice(index, 1);
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
          // this.openSnackBar(response[0].message, 'success');
        } else {
          // this.openSnackBar(response[0].message, 'error');
        }
      });
    }
  }

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
  }

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

  public isBlank(str: string) {
    return !str || /^\s*$/.test(str);
  }
  public isEmpty(str: any) {
    return !str || 0 === str.length;
  }

  // checking which form control is invalid
  public findInvalidControls() {
    const invalid = [];
    const controls = this.postForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  public onChangeArea = (locID: string) => {
    this.getZipCode(locID);
    this.postForm.get('zip').patchValue(null);
    this.forwardGeoCode(locID);
  }

  public forwardGeoCode = (locID: string) => {
    this.getForwardGeocode(locID)
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.coordinatesValues = fulfilled;
        } else {
          this.coordinatesValues = [];
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public getForwardGeocode = (locID: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        key: accessKey,
        query: this.locationList.filter(
          (location) => location.locationID === locID
        )[0].locationName,
      };
      this.homeService.getForwardGeoCode(data).subscribe(
        (response) => {
          if (response.data.length > 0) {
            resolve(response.data);
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

  // posting ads on click
  public postSpaceAds = (post: any) => {
    this.markFormTouched(this.postForm);
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
        this.postForm.get('contactNumber').setErrors({
          emptyMobile: true,
        });
        this.postForm.get('email').setErrors({
          emptyEmail: true,
        });
      }
    } else if (post.modeMobile === false && post.modeEmail === false) {
      this.postForm.get('modeMobile').setErrors({
        notSelectedMobile: true,
      });
      this.postForm.get('modeEmail').setErrors({
        notSelectedEmail: true,
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
  }

  public post = (post: any) => {
    this.postForm.get('contactNumber').setErrors(null);
    this.postForm.get('email').setErrors(null);
    this.postForm
      .get('contactNumber')
      .setValidators([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]);
    this.postForm.get('contactNumber').updateValueAndValidity();
    this.postForm
      .get('email')
      .setValidators([
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]);
    this.postForm.get('email').updateValueAndValidity();
    this.postForm.get('modeMobile').setErrors(null);
    this.postForm.get('modeEmail').setErrors(null);
    const invalidinput = this.findInvalidControls();
    if (this.postForm.valid && invalidinput.length === 0) {
      this.transFormingDate(post.packageDetail.packagedetailDays);
      this.spinner.show();
      const temp = this.homeService.getPackageInfoFromLocalStorage();
      const data: spacePostAdFormData = {
        languageID: this.selectedLanguageID,
        loginuserID: this.userInfo[0].userID,
        postType: temp.categorytypeName,
        categoryID: temp.categoryID,
        categorytypeID: temp.categorytypeID,
        subcategoryID: temp.subCatID,
        postTitle: temp.categorytypeName ? temp.categorytypeName : '',
        postDescription: post.postDescription ? post.postDescription : '',
        cityID: post.city,
        postMobile: post.contactNumber ? post.contactNumber : '',
        postEmail: post.email ? post.email : '',
        postModeOfContact:
          post.modeEmail === true && post.modeMobile === true
            ? 'Both'
            : post.modeEmail === true
              ? 'Email'
              : 'Mobile',
        postImage: this.postImageName ? this.postImageName.toString() : '',
        packageID: post.packageDetail.packageID,
        postotherArea: post.postotherArea ? post.postotherArea : '',
        postotherOragnisation: post.organizationName
          ? post.organizationName
          : '',
        zipID: post.zip ? post.zip : '',
        postStartDate: this.datePipe.transform(
          this.postCurrentDate,
          'yyyy-MM-dd'
        ),
        postEndDate: this.postEndDate,
        postotherContactPerson: post.ContactPerson ? post.ContactPerson : '',
        postotherPrice: post.price ? post.price : '',
        packagedetailID: post.packageDetail.packagedetailID,
        packagedetailFees: post.packageDetail.packagedetailFees,
        postAlternateNo: post.altcontactNumber ? post.altcontactNumber : '',
        postotherLocation: post.area ? post.area : 0,
        postLatitude:
          this.coordinatesValues.length > 0
            ? this.coordinatesValues[0].latitude
            : '0',
        postLongitude:
          this.coordinatesValues.length > 0
            ? this.coordinatesValues[0].longitude
            : '0',
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
            this.contactNumberData.postID = response[0].data[0].postID;
            this.contactNumberData.postData = response[0].data[0];
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
                    this.router.navigate(['/review-ad']);
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
                  this.router.navigate(['/review-ad']);
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
            this.openSnackBar(response[0].message, 'error');
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
