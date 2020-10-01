import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ResetPasswordModalComponent } from '../reset-password-modal/reset-password-modal.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-verification-modal',
  templateUrl: './verification-modal.component.html',
  styleUrls: ['./verification-modal.component.scss'],
})
export class VerificationModalComponent implements OnInit {
  @Input() usersData: any;
  @Input() labelData: any;
  @Input() userMobileData: any;
  @Input() forgetPassword: boolean;
  @Input() userMobile: boolean;
  @Input() userEmail: boolean;
  modalOption: NgbModalOptions = {}; // not null!
  public closeResult: string;
  userMobileVerify: FormGroup;
  userEmailVerify: FormGroup;
  userForgetPssVerify: FormGroup;
  constructor(
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private homeService: HomeService,
    private spinner: NgxSpinnerService,
    public router: Router,
    fb: FormBuilder
  ) {
    this.userMobileVerify = fb.group({
      one: [null, Validators.compose([Validators.required])],
      two: [null, Validators.compose([Validators.required])],
      three: [null, Validators.compose([Validators.required])],
      four: [null, Validators.compose([Validators.required])],
    });
    this.userEmailVerify = fb.group({
      one: [null, Validators.compose([Validators.required])],
      two: [null, Validators.compose([Validators.required])],
      three: [null, Validators.compose([Validators.required])],
      four: [null, Validators.compose([Validators.required])],
    });
    this.userForgetPssVerify = fb.group({
      one: [null, Validators.compose([Validators.required])],
      two: [null, Validators.compose([Validators.required])],
      three: [null, Validators.compose([Validators.required])],
      four: [null, Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    $(document).ready(() => {
      $('input.mobile-verify.pass').on('keyup', function () {
        if ($(this).val()) {
          // tslint:disable-next-line: deprecation
          $(this).closest('div').next().find('input').focus();
          // $(this).next().focus();
        }
      });
    });
  }

  public onClose = () => {
    this.activeModal.close('manually');
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public openResetPasswordModal = (data: any) => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      ResetPasswordModalComponent,
      this.modalOption
    );
    modalRef.componentInstance.usersData = data;
    modalRef.componentInstance.labelData = this.labelData;
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  public onResendClick = () => {
    this.spinner.show();
    const data = {
      loginuserID: this.usersData.userID,
      userMobile: this.usersData.userMobile,
    };
    this.homeService.otpResendForForgetPassword(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.userForgetPssVerify.reset();
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'success');
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

  public onResendUserMobile = () => {
    this.spinner.show();
    const data = {
      loginuserID: this.userMobileData.loginuserID,
      userMobile: this.userMobileData.userMobile,
      languageID: this.userMobileData.languageID,
    };
    this.homeService.userMobileOtpResendVerification(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.userMobileVerify.reset();
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'success');
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

  public onResendUserEmail = () => {
    this.spinner.show();
    const data = {
      loginuserID: this.userMobileData.loginuserID,
      userEmail: this.userMobileData.userEmail,
      languageID: this.userMobileData.languageID,
    };
    this.homeService.userEmailOtpResendVerification(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.userEmailVerify.reset();
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'success');
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

  public onSubmitResetPasswordOTP = (post: any) => {
    this.markFormTouched(this.userForgetPssVerify);
    if (this.userForgetPssVerify.valid) {
      this.spinner.show();
      const otp1 = post.one.concat(post.two);
      const otp2 = post.three.concat(post.four);
      const otpSubmit = otp1.concat(otp2);
      const data = {
        loginuserID: this.usersData.userID,
        userOTP: otpSubmit,
      };
      this.homeService.otpVerificationForForgetPassword(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.spinner.hide();
              this.openSnackBar(response[0].message, 'success');
              this.openResetPasswordModal(response[0].data);
              this.userForgetPssVerify.reset();
            }, 1000);
          } else {
            this.spinner.hide();
            this.openSnackBar(response[0].message, 'false');
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );
    } else {
      // do nothing
    }
  }

  public onSubmitMobileOTP = (post: any) => {
    this.markFormTouched(this.userMobileVerify);
    if (this.userMobileVerify.valid) {
      this.spinner.show();
      const otp1 = post.one.concat(post.two);
      const otp2 = post.three.concat(post.four);
      const otpSubmit = otp1.concat(otp2);
      const data = {
        languageID: this.userMobileData.languageID,
        loginuserID: this.userMobileData.loginuserID,
        userMobile: this.userMobileData.userMobile,
        userOTP: otpSubmit,
      };
      this.homeService.userMobileOTPVerification(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.homeService.setInfoInLocalStorage(response[0].data);
            Cookie.set(
              'userName',
              response[0].data[0].userFirstName +
              ' ' +
              response[0].data[0].userLastName
            );
            Cookie.set('userID', response[0].data[0].userID);
            Cookie.set('userRefKey', response[0].data[0].userReferKey);
            Cookie.set('userVarified', response[0].data[0].userVerified);
            Cookie.set('emailVarified', response[0].data[0].userEmailVerified);
            this.homeService.updateNavbr(true);
            setTimeout(() => {
              this.spinner.hide();
              this.userMobileVerify.reset();
              this.openSnackBar(response[0].message, 'success');
              this.activeModal.close();
            }, 1000);
            this.makeSessionStorageEmpty();
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
    } else {
      // do nothing
    }
  }

  public onSubmitEmailOTP = (post: any) => {
    this.markFormTouched(this.userEmailVerify);
    if (this.userEmailVerify.valid) {
      this.spinner.show();
      const otp1 = post.one.concat(post.two);
      const otp2 = post.three.concat(post.four);
      const otpSubmit = otp1.concat(otp2);
      const data = {
        languageID: this.userMobileData.languageID,
        loginuserID: this.userMobileData.loginuserID,
        userEmail: this.userMobileData.userEmail,
        userEmailOTP: otpSubmit,
      };
      this.homeService.userEmailOTPVerification(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.homeService.setInfoInLocalStorage(response[0].data);
            Cookie.set(
              'userName',
              response[0].data[0].userFirstName +
              ' ' +
              response[0].data[0].userLastName
            );
            Cookie.set('userID', response[0].data[0].userID);
            Cookie.set('userRefKey', response[0].data[0].userReferKey);
            Cookie.set('userVarified', response[0].data[0].userVerified);
            Cookie.set('emailVarified', response[0].data[0].userEmailVerified);
            this.homeService.updateNavbr(true);
            setTimeout(() => {
              this.spinner.hide();
              this.openSnackBar(response[0].message, 'success');
              this.userEmailVerify.reset();
              this.activeModal.close();
            }, 1000);
            this.makeSessionStorageEmpty();
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
    } else {
      // do nothing
    }
  }

  public makeSessionStorageEmpty = () => {
    sessionStorage.removeItem('temporaryStorage');
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
}
