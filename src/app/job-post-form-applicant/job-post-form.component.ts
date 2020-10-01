import { Component, OnInit, KeyValueDiffers, DoCheck } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../home.service';
import { Router } from '@angular/router';
import { getPackageData, uploadFileData, jobs } from '../interface.component';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { VerificationPopUpComponent } from '../verification-pop-up/verification-pop-up.component';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { contactPresent } from '../valueCheck.validator';

@Component({
  selector: 'app-job-post-form',
  templateUrl: './job-post-form.component.html',
  styleUrls: ['./job-post-form.component.scss'],
  providers: [DatePipe],
})
export class JobPostFormComponent implements OnInit, DoCheck {
  public userInfo = [];
  public arrEmailMode = [];
  public arrMobileMode = [];
  public cityList = [];
  public packageDetails = [];
  public selectedFiles: File[] = [];
  public selectedResume: File[] = [];
  public experianceList = [];
  public educationList = [];
  public labelData = [];
  public arrLocationIndia = [];
  public arrLocationAbroad = [];
  // input data
  public postLevel: string;
  public selectedLanguageID: any;
  public postotherResume = [];
  public postCurrentDate = new Date();
  public postEndDate: string;
  public differ: any;
  public routeObject: any;
  public modalOption: NgbModalOptions = {}; // not null!
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

  public perfferedJobLOc = [];
  public fileToUpload = [];
  public imgURL = [];
  public postImageName = [];
  public fileName: string;
  applicantForm: FormGroup;

  constructor(
    public homeService: HomeService,
    public router: Router,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    public fb: FormBuilder,
    public snackBar: MatSnackBar,
    private differs: KeyValueDiffers
  ) {
    // for any diff
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.applicantForm = this.fb.group({
      userfirstName: [
        null,
        [Validators.required, Validators.pattern(`^[a-zA-Z -']+`)],
      ],
      userLastName: [
        null,
        [Validators.required, Validators.pattern(`^[a-zA-Z -']+`)],
      ],
      postotherJobRole: [
        null,
        [Validators.maxLength(50), Validators.minLength(3)],
      ],
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
      postotherSalary: ['', [Validators.pattern('^[0-9]*$')]],
      email: [
        history.state.data ? history.state.data.email : '',
        Validators.compose([
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]),
      ],
      packageDetail: ['', Validators.compose([Validators.required])],
      selectedLocation: [
        {
          value: '',
          disabled: false,
        },
        Validators.compose([Validators.required]),
      ],
      postDescription: ['', Validators.compose([Validators.required])],
      userExperiance: ['', Validators.compose([Validators.required])],
      userEducation: ['', Validators.compose([Validators.required])],
      modeEmail: [false],
      modeMobile: [false],
      modeAnywhereAbroad: [false],
      modeAnywhereIndia: [false],
    });

    this.spinner.show();
    this.userInfo = this.homeService.getUserInfoFromLocalStorage();
    setTimeout(() => {
      this.homeService.updatedLanguageID.subscribe((languageID) => {
        this.selectedLanguageID = languageID;
      });
    });
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
    this.getEducationList().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.educationList = fulfilled;
      } else {
        this.educationList = [];
      }
    }).catch((error) => {
      console.error(error);
    });
    this.getExperianceList().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.experianceList = fulfilled;
      } else {
        this.experianceList = [];
      }
    }).catch((error) => {
      console.error(error);
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
      }, error => {
        reject(error);
      });
    });
  }

  public getExperianceList = () => {
    return new Promise((resolve, reject) => {
      this.homeService.getExperianceList().subscribe((list) => {
        if (list[0].status === 'true') {
          resolve(list[0].data);
        } else {
          resolve([]);
        }
      }, error => {
        console.error(error);
      });
    });
  } // end of get experiance list function

  public getEducationList = () => {
    return new Promise((resolve, reject) => {
      this.homeService.getEducationList().subscribe((list) => {
        if (list[0].status === 'true') {
          resolve(list[0].data);
        } else {
          resolve([]);
        }
      }, error => {
        reject(error);
      });
    });
  } // end of get education list function

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

  public transFormingDate = (selectedPackageDays: number) => {
    const dateNow = new Date(Date.now());
    dateNow.setTime(
      dateNow.getTime() + selectedPackageDays * 24 * 60 * 60 * 1000
    );
    this.postEndDate = this.datePipe.transform(dateNow, 'yyyy-MM-dd');
  }

  public onClickChangemodeAnywhereIndia(value: any) {
    const newval = `${value}`;
    const index = this.arrLocationIndia.indexOf(newval);
    if (index === -1) {
      // val not found, pushing onto array
      this.applicantForm.get('selectedLocation').disable();
      this.arrLocationIndia.push(newval);
    } else {
      // val is found, removing from array
      if (this.arrLocationAbroad.length > 0) {
        this.applicantForm.get('selectedLocation').disable();
      } else {
        this.applicantForm.get('selectedLocation').enable();
      }
      this.arrLocationIndia.splice(index, 1);
    }
  }

  public onClickChangemodeAnywhereAbroad(value: any) {
    const newval = `${value}`;
    const index = this.arrLocationAbroad.indexOf(newval);
    if (index === -1) {
      // val not found, pushing onto array
      this.applicantForm.get('selectedLocation').disable();
      this.arrLocationAbroad.push(newval);
    } else {
      // val is found, removing from array
      if (this.arrLocationIndia.length > 0) {
        this.applicantForm.get('selectedLocation').disable();
      } else {
        this.applicantForm.get('selectedLocation').enable();
      }
      this.arrLocationAbroad.splice(index, 1);
    }
  }

  // selection mode through radio button
  public onClickChangeModeEmail(value: any) {
    const newval = `${value}`;
    const index = this.arrEmailMode.indexOf(newval);
    if (index === -1) {
      // val not found, pushing onto array
      this.applicantForm
        .get('email')
        .setValidators([
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]);
      this.applicantForm.get('email').updateValueAndValidity();
      this.arrEmailMode.push(newval);
    } else {
      // val is found, removing from array
      this.applicantForm.get('email').clearValidators();
      this.applicantForm
        .get('email')
        .setValidators([
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]);
      this.applicantForm.get('email').updateValueAndValidity();
      this.arrEmailMode.splice(index, 1);
    }
  } // end of onClickChangeMode

  // selection mode through radio button
  public onClickChangeModeMobile(value: any) {
    const newval = `${value}`;
    const index = this.arrMobileMode.indexOf(newval);
    if (index === -1) {
      // val not found, pushing onto array
      this.applicantForm
        .get('contactNumber')
        .setValidators([
          Validators.required,
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ]);
      this.applicantForm.get('contactNumber').updateValueAndValidity();
      this.arrMobileMode.push(newval);
    } else {
      // val is found, removing from array
      this.applicantForm.get('contactNumber').clearValidators();
      this.applicantForm
        .get('contactNumber')
        .setValidators([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]);
      this.applicantForm.get('contactNumber').updateValueAndValidity();
      this.arrMobileMode.splice(index, 1);
    }
  } // end of onClickChangeMode

  // de-selecting selected images
  public onClose(index: any) {
    for (let i = 0; i < this.imgURL.length; i++) {
      if (i === index) {
        this.imgURL.splice(i, 1);
        this.selectedFiles.splice(i, 1);
      }
    }
  } // end of onClose function

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

  // when files are selected, save them in array selectedFiles
  public resumeAdded(event: any) {
    if (event.target.files.length > 50) {
      window.alert(`Images will Not Be greater than 50`);
    } else {
      this.fileName = event.target.files[0].name;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < event.target.files.length; i++) {
        this.selectedResume.push(event.target.files[i] as File);
      }
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.selectedResume.length; i++) {
      this.postotherResume.push(this.selectedResume[i].name);
    }
  } // end of fileAdded function

  // uploading files when post success
  public uploadImagesFiles = () => {
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
          // console.log('file uploaded successfully');
        } else {
          // console.log(response[0].message);
        }
      });
    }
  } // end of uploadFiles

  // uploading files when post success
  public uploadResumeFiles = () => {
    for (let i = 0; i < this.selectedResume.length; i++) {
      this.fileToUpload.push(this.selectedResume[i]);
      const data: uploadFileData = {
        file: this.fileToUpload[i],
        fileName: this.postotherResume[i],
        filePath: this.userInfo[0].userID,
        userID: this.userInfo[0].userID,
      };
      // console.log(data);
      this.homeService.uploadFile(data).subscribe((response) => {
        if (response[0].status === 'true') {
          // console.log('file uploaded successfully');
        } else {
          // console.log(response[0].message);
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

  public jobPreferredLocation = (arr: any) => {
    this.perfferedJobLOc = [];
    for (const ar of arr) {
      this.perfferedJobLOc.push(ar.cityID);
    }
    return this.perfferedJobLOc.toString();
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
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
    const controls = this.applicantForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  // posting ads on click
  public postSpaceAds = (post: any) => {
    this.markFormTouched(this.applicantForm);
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
        this.applicantForm.get('contactNumber').setErrors({
          emptyMobile: true,
        });
        this.applicantForm.get('email').setErrors({
          emptyEmail: true,
        });
      }
    } else if (post.modeMobile === false && post.modeEmail === false) {
      this.applicantForm.get('modeMobile').setErrors({
        notSelectedMobile: true,
      });
      this.applicantForm.get('modeEmail').setErrors({
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
  } // end of post-ad function

  public post = (post: any) => {
    this.applicantForm.get('contactNumber').setErrors(null);
    this.applicantForm.get('email').setErrors(null);
    this.applicantForm
      .get('contactNumber')
      .setValidators([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]);
    this.applicantForm.get('contactNumber').updateValueAndValidity();
    this.applicantForm
      .get('email')
      .setValidators([
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]);
    this.applicantForm.get('email').updateValueAndValidity();
    this.applicantForm.get('modeMobile').setErrors(null);
    this.applicantForm.get('modeEmail').setErrors(null);
    const invalidinput = this.findInvalidControls();
    if (this.applicantForm.valid && invalidinput.length === 0) {
      this.transFormingDate(post.packageDetail.packagedetailDays); // look it in the end
      this.spinner.show();
      const temp = this.homeService.getPackageInfoFromLocalStorage();
      const data: jobs = {
        languageID: this.selectedLanguageID,
        loginuserID: this.userInfo[0].userID,
        postType: temp.categorytypeName,
        categoryID: temp.categoryID,
        categorytypeID: temp.categorytypeID,
        postLevel: this.postLevel,
        subcategoryID: temp.subCatID,
        postTitle: temp.categorytypeName ? temp.categorytypeName : '',
        postDescription: post.postDescription ? post.postDescription : '',
        cityID: post.selectedLocation
          ? this.jobPreferredLocation(post.selectedLocation)
          : '',
        postMobile: post.contactNumber ? post.contactNumber : '',
        postEmail: post.email ? post.email : '',
        postModeOfContact:
          post.modeEmail === true && post.modeMobile === true
            ? 'Both'
            : post.modeEmail === true
              ? 'Email'
              : 'Mobile',
        postImage: this.postImageName.toString(),
        packageID: post.packageDetail.packageID,
        postotherArea: '',
        packagedetailID: post.packageDetail.packagedetailID,
        packagedetailFees: post.packageDetail.packagedetailFees,
        postAlternateNo: post.altcontactNumber ? post.altcontactNumber : '',
        postotherLocation: 0,
        postStartDate: this.datePipe.transform(
          this.postCurrentDate,
          'yyyy-MM-dd'
        ),
        postEndDate: this.postEndDate,
        postotherFirstName: post.userfirstName,
        postotherLastName: post.userLastName,
        postotherJobRole: post.postotherJobRole ? post.postotherJobRole : '',
        postotherYearExp: post.userExperiance ?
          this.experianceList.filter(exp => exp.experianceID === post.userExperiance)[0].experianceName : '',
        educationID: post.userEducation,
        experianceID: post.userExperiance,
        postotherSalary: post.postotherSalary ? post.postotherSalary : '',
        postotherIndia: post.modeAnywhereIndia === true ? 'Yes' : 'No',
        postotherAbroad: post.modeAnywhereAbroad === true ? 'Yes' : 'No',
        postotherResume:
          this.postotherResume.length > 0
            ? this.postotherResume.toString()
            : '',
        postLatitude: '0',
        postLongitude: '0'
      };
      this.homeService.postSpacesAds(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.uploadImagesFiles();
              this.uploadResumeFiles();
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
                    this.router.navigate(['/applicant-preview']);
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
                  this.router.navigate(['/applicant-preview']);
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
