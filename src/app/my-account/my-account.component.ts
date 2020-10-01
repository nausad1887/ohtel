import { Component, OnInit, DoCheck, KeyValueDiffers } from '@angular/core';
import { HomeService } from '../home.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PasswordUpdate } from '../interface.component';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmedValidator } from '../sign-up-modal/confirmed.validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmedValidatorForSameOldAndCurrentPassword } from './confirmed.validator';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { VerificationModalComponent } from '../verification-modal/verification-modal.component';
import { UserUpdateModalComponent } from '../user-update-modal/user-update-modal.component';
import { trigger } from '@angular/animations';
import { fadeIn } from '../details/animation';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
  animations: [trigger('fadeIn', fadeIn())]
})
export class MyAccountComponent implements OnInit, DoCheck {
  public userInfo = [];
  public labelData = [];
  public differ: any;
  public languageID: any;
  public oldPassword: string;
  public newPassword: string;
  public reEnterNewPassword: string;
  public userName: string;
  public languageList = [];
  public userVerified: string;
  public emailVarified: string;
  public defaultmyImgUrl = 'assets/images/user-icon-transparent-6.jpg';
  modalOption: NgbModalOptions = {}; // not null!
  closeResult: string;
  imageUrl = '';
  fileToUpload: File = null;
  changePassword: FormGroup;
  public hide = true;

  constructor(
    public homeService: HomeService,
    public toastr: ToastrManager,
    public http: HttpClient,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    fb: FormBuilder,
    public router: Router,
    private differs: KeyValueDiffers
  ) {
    this.changePassword = fb.group(
      {
        oldPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(4),
          ]),
        ],
        newPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(4),
          ]),
        ],
        reEnterNewPassword: [
          null,
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(4),
          ]),
        ],
      },
      {
        validators: [
          ConfirmedValidator('newPassword', 'reEnterNewPassword'),
          ConfirmedValidatorForSameOldAndCurrentPassword(
            'oldPassword',
            'newPassword'
          ),
        ],
      }
    );
    // detect diff
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    setTimeout(() => { this.makeItFalse(); });
    this.asyncFunctionCall();
    this.updatedLanguageID();
    this.homeService.count.subscribe((c) => {
      this.userName = c;
    });
    this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
    });
  }

  public asyncFunctionCall = async () => {
    this.spinner.show();
    await this.getUserInfo();
    await this.getAccountLabel();
    this.getLanguageList().then((response: Array<any>) => {
      this.languageList = response;
    }).catch(() => console.error);
  } // end of asyncFunctionCall

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'languageID') {
          this.getAccountLabel();
        }
      });
    }
  }
  nextCount() {
    this.homeService.nextCount();
  }
  myFunction() {
    this.hide = !this.hide;
  }
  makeItFalse() {
    const isTrue = false;
    this.homeService.nextCountBoolean(isTrue);
  }

  public isBlank(str: string) {
    return !str || /^\s*$/.test(str);
  }

  public getUserInfo = () => {
    return new Promise((resolve, reject) => {
      this.userVerified = Cookie.get('userVarified');
      this.emailVarified = Cookie.get('emailVarified');
      this.userInfo = this.homeService.getUserInfoFromLocalStorage();
      this.isBlank(this.userInfo[0].userProfilePicture)
        ? (this.imageUrl = null)
        : (this.imageUrl = `http://betaapplication.com/ohtel/backend/web/uploads/${this.userInfo[0].userID}/${this.userInfo[0].userProfilePicture}`);
      resolve(this.userInfo);
    });
  }

  public handleFileInput(files: FileList) {
    this.spinner.show();
    this.fileToUpload = files.item(0);
    const data = {
      file: this.fileToUpload,
      fileName: this.fileToUpload.name,
      filePath: this.userInfo[0].userID,
      userID: this.userInfo[0].userID,
    };
    this.homeService.uploadFile(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'success');
          this.homeService.userUpdateProfilePicture(data).subscribe((res) => {
            if (res[0].status === 'true') {
              setTimeout(() => {
                this.homeService.setInfoInLocalStorage(res[0].data);
                this.nextCount();
                this.getUserInfo();
              }, 500);
            } else {
              this.openSnackBar(response[0].message, 'error');
            }
          });
        } else {
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public passwordUpdate = (post: any) => {
    this.markFormTouched(this.changePassword);
    if (this.changePassword.valid) {
      const passwordData: PasswordUpdate = {
        languageID: this.languageID,
        userID: this.userInfo[0].userID,
        currentPassword: post.oldPassword,
        newPassword: post.newPassword,
      };
      this.homeService.changePassword(passwordData).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.openSnackBar(response[0].message, 'success');
            setTimeout(() => {
              this.signOut();
            }, 500);
          } else {
            this.openSnackBar(response[0].message, 'error');
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  // SignOut function
  public signOut: any = () => {
    Cookie.deleteAll();
    this.userInfo = [];
    setTimeout(() => {
      this.homeService.updateNavbr(false);
      this.router.navigate(['/home']);
    }, 1000);
  } // end of SignOut session

  getLanguageList = () => {
    return new Promise((resolve, reject) => {
      return this.homeService.getLanguageList().subscribe(
        (response) => {
          if (response.length > 0) { resolve(response); } else { resolve([]); }
        },
        (error) => {
          reject(error);
        }
      );
    });
  } // end of getLanguageList

  public updatedLanguageID = () => {
    this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
    });
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
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

  public openUserupdateProfile = () => {
    this.activeModal.close();
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      UserUpdateModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          setTimeout(() => {
            this.nextCount();
            this.ngOnInit();
          }, 100);
          this.getUserInfo();
        }
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        if (reason === 'success') {
          setTimeout(() => {
            this.nextCount();
            this.ngOnInit();
          }, 100);
          this.getUserInfo();
        }
        this.getUserInfo();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    modalRef.componentInstance.data = this.userInfo[0];
    modalRef.componentInstance.labelData = this.labelData[0];
  }

  public openUserMobileVerificationModal = (user: any) => {
    this.activeModal.close();
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      VerificationModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        this.getUserInfo();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.getUserInfo();
        this.closeResult = `Closed with: ${reason}`;
      }
    );
    modalRef.componentInstance.userMobileData = user;
    modalRef.componentInstance.labelData = this.labelData;
    modalRef.componentInstance.forgetPassword = false;
    modalRef.componentInstance.userMobile = true;
    modalRef.componentInstance.userEmail = false;
  }

  public openUserEmailVerificationModal = (user: any) => {
    this.activeModal.close();
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      VerificationModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        this.getUserInfo();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.getUserInfo();
        this.closeResult = `Closed with: ${reason}`;
      }
    );
    modalRef.componentInstance.userMobileData = user;
    modalRef.componentInstance.labelData = this.labelData;
    modalRef.componentInstance.forgetPassword = false;
    modalRef.componentInstance.userMobile = false;
    modalRef.componentInstance.userEmail = true;
  }

  public userMobileVerification = () => {
    this.spinner.show();
    const data = {
      loginuserID: this.userInfo[0].userID,
      userMobile: this.userInfo[0].userMobile,
      languageID: this.languageID,
      message: '',
    };
    this.homeService.userMobileVerification(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.spinner.hide();
          if (this.languageID === '2') {
            const indexFirstStr = this.labelData[0].Please_enter_the_4_digit_OTP_received_on_your.indexOf(
              'पर'
            );
            const firstStr = this.labelData[0].Please_enter_the_4_digit_OTP_received_on_your.slice(
              0,
              indexFirstStr
            );
            const indexSecondStr = this.labelData[0].Please_enter_the_4_digit_OTP_received_on_your.indexOf(
              'पर'
            );
            const secondStr = this.labelData[0].Please_enter_the_4_digit_OTP_received_on_your.slice(
              indexSecondStr
            );
            data.message = `${firstStr}${this.labelData[0].Mobile_number} ${secondStr}`;
            this.openUserMobileVerificationModal(data);
            this.openSnackBar(
              'Check your phone, We have send OTP on your Mobile Number.',
              'success'
            );
          } else {
            data.message = `${this.labelData[0].Please_enter_the_4_digit_OTP_received_on_your} ${this.labelData[0].Mobile_number}`;
            this.openUserMobileVerificationModal(data);
            this.openSnackBar(
              'Check your phone, We have send OTP on your Mobile Number.',
              'success'
            );
          }
        } else {
          this.spinner.hide();
          console.error(response[0].message);
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  public userEmailVerification = () => {
    this.spinner.show();
    const data = {
      loginuserID: this.userInfo[0].userID,
      userEmail: this.userInfo[0].userEmail,
      languageID: this.userInfo[0].languageID,
      message: '',
    };
    this.homeService.userEmailVerification(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.spinner.hide();
          if (this.languageID === '2') {
            const indexFirstStr = this.labelData[0].Please_enter_the_4_digit_OTP_received_on_your.indexOf(
              'पर'
            );
            const firstStr = this.labelData[0].Please_enter_the_4_digit_OTP_received_on_your.slice(
              0,
              indexFirstStr
            );
            const indexSecondStr = this.labelData[0].Please_enter_the_4_digit_OTP_received_on_your.indexOf(
              'पर'
            );
            const secondStr = this.labelData[0].Please_enter_the_4_digit_OTP_received_on_your.slice(
              indexSecondStr
            );
            data.message = `${firstStr}${this.labelData[0].Email_id} ${secondStr}`;
            this.openUserEmailVerificationModal(data);
            this.openSnackBar(
              'Check your phone, We have send OTP on your Email.',
              'success'
            );
          } else {
            data.message = `${this.labelData[0].Please_enter_the_4_digit_OTP_received_on_your} ${this.labelData[0].Email_id}`;
            this.openUserEmailVerificationModal(data);
            this.openSnackBar(
              'Check your phone, We have send OTP on your Email.',
              'success'
            );
          }
        } else {
          this.spinner.hide();
          console.error(response[0].message);
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public onChangePostGoesLive = (value: string) => {
    value === 'Yes'
      ? this.changePostGoesLiveStatus('No')
      : this.changePostGoesLiveStatus('Yes');
  }

  public onChangeSystemNotification = (value: string) => {
    value === 'Yes'
      ? this.changeSystemNotificationStatus('No')
      : this.changeSystemNotificationStatus('Yes');
  }

  public changePostGoesLiveStatus = (value: string) => {
    const data = {
      languageID: this.languageID,
      loginuserID: this.userInfo[0].userID,
      userpostGoesLive: value,
      usersystemNotification: this.userInfo[0].usersystemNotification,
    };
    this.homeService.userUpdateSettings(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.homeService.setInfoInLocalStorage(response[0].data);
          setTimeout(() => {
            this.getUserInfo();
          }, 100);
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public changeSystemNotificationStatus = (value: string) => {
    const data = {
      languageID: this.languageID,
      loginuserID: this.userInfo[0].userID,
      userpostGoesLive: this.userInfo[0].userpostGoesLive,
      usersystemNotification: value,
    };
    this.homeService.userUpdateSettings(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.homeService.setInfoInLocalStorage(response[0].data);
          setTimeout(() => {
            this.getUserInfo();
          }, 100);
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public onChangeUserLanguage = (value: any) => {
    const data = {
      loginuserID: this.userInfo[0].userID,
      languageID: value,
    };
    this.homeService.userUpdateLanguage(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.updateLanguage(data.languageID);
          this.homeService.setInfoInLocalStorage(response[0].data);
          setTimeout(() => {
            this.getUserInfo();
          }, 100);
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public updateLanguage = (languageID: any) => {
    this.homeService.nextLanguageID(languageID);
  }

  public getAccountLabel = () => {
    return new Promise((resolve, reject) => {
      this.homeService.getLabel().subscribe((response) => {
        if (response[0].info === 'RECORDFOUND') {
          this.labelData = response[0].data;
          this.spinner.hide();
          resolve(this.labelData);
        } else {
          this.spinner.hide();
          console.error(response);
          reject(response[0].info);
        }
      });
    });
  }
}
