import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../home.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {
  emailVarificationData, contactNumberVerificationData,
  alternateNumberVerificationData, contactNumberVerificationDataWithOtp,
  emailVerificationDataWithOtp, alternateNumberVerificationDataWithOtp
} from '../interface.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-verification-pop-up',
  templateUrl: './verification-pop-up.component.html',
  styleUrls: ['./verification-pop-up.component.scss'],
})
export class VerificationPopUpComponent implements OnInit {
  public postData: any;
  public userInfo: any;
  public postDetails: any;

  public number: number;
  public selectedLanguageID: any;

  public show = false;
  public show2 = false;
  public showEmail = false;
  public notShowContact = false;
  public notShowContactEmail = false;
  public notShow2AlternateMobile = false;

  userMobileVerify: FormGroup;
  userEmailVerify: FormGroup;
  userAlternateContactVerify: FormGroup;

  @Input() public postMobile: any;
  @Input() public formRoute: any;
  @Input() public emailData: any;
  @Input() public alternateContactNumber: any;
  constructor(
    public activeModal: NgbActiveModal,
    public homeService: HomeService,
    public toastr: ToastrManager,
    public router: Router,
    private spinner: NgxSpinnerService,
    fb: FormBuilder
  ) {
    this.userMobileVerify = fb.group({
      one: [null, Validators.compose([Validators.required])],
      two: [null, Validators.compose([Validators.required])],
      three: [null, Validators.compose([Validators.required])],
      four: [null, Validators.compose([Validators.required])],
    });
    this.userAlternateContactVerify = fb.group({
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
  }

  ngOnInit(): void {
    this.checkContactStatus();
    this.checkAltContactStatus();
    this.checkEmailStatus();
    this.userInfo = this.homeService.getUserInfoFromLocalStorage();
    this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.selectedLanguageID = languageID;
    });
    this.homeService.updatedPostID.subscribe((postData) => {
      this.postData = postData;
    });
  }

  public jQueryCode = () => {
    // tslint:disable-next-line: deprecation
    $(document).ready(() => {
      $('input.mobile-verify.pass').on('keyup', function () {
        if ($(this).val()) {
          // tslint:disable-next-line: deprecation
          $(this).closest('td').next().find('input').focus();
          // $(this).next().focus();
        }
      });
    });
  }

  public checkContactStatus = () => {
    if (this.postMobile) {
      if (
        this.postMobile.contactNumber === null ||
        this.postMobile.contactNumber === undefined ||
        this.postMobile === ''
      ) {
        this.show = false;
      } else {
        this.show = true;
      }
    } else {
      this.show = false;
    }
  }
  public checkAltContactStatus = () => {
    if (this.alternateContactNumber) {
      if (
        this.alternateContactNumber.alternateContactNumber === null ||
        this.alternateContactNumber.alternateContactNumber === undefined ||
        this.alternateContactNumber.alternateContactNumber === ''
      ) {
        this.show2 = false;
      } else {
        this.show2 = true;
      }
    } else {
      this.show2 = false;
    }
  }
  public checkEmailStatus = () => {
    if (this.emailData) {
      if (
        this.emailData.email === null ||
        this.emailData.email === undefined ||
        this.emailData === ''
      ) {
        this.showEmail = false;
      } else {
        this.showEmail = true;
      }
    } else {
      this.showEmail = false;
    }
  }

  cancelContactVerify() {
    this.show = false;
    this.notShowContact = false;
    this.postDetails = this.postMobile.postData;
    this.cancelReDirectPage();
  }
  cancelAlternateContactVerify() {
    this.show2 = false;
    this.notShow2AlternateMobile = false;
    this.postDetails = this.alternateContactNumber.postData;
    this.cancelReDirectPage();
  }
  cancelEmailVerify() {
    this.showEmail = false;
    this.notShowContactEmail = false;
    this.postDetails = this.emailData.postData;
    this.cancelReDirectPage();
  }

  public cancelReDirectPage = () => {
    if (
      this.show === false &&
      this.show2 === false &&
      this.showEmail === false &&
      this.notShowContact === false &&
      this.notShow2AlternateMobile === false &&
      this.notShowContactEmail === false
    ) {
      this.homeService.setPostInfoInLocalStorage(this.postDetails);
      if (this.postDetails.postType === 'Applicant') {
        this.activeModal.close();
        setTimeout(() => {
          this.router.navigate([this.formRoute]);
        }, 1000);
      } else if (this.postDetails.postType === 'Recruiter') {
        this.activeModal.close();
        setTimeout(() => {
          this.router.navigate([this.formRoute]);
        }, 1000);
      } else {
        this.activeModal.close();
        setTimeout(() => {
          this.router.navigate([this.formRoute]);
        }, 1000);
      }
    }
  }

  public successReDirectPage = (data: any) => {
    if (
      this.show === false &&
      this.show2 === false &&
      this.showEmail === false &&
      this.notShowContact === false &&
      this.notShow2AlternateMobile === false &&
      this.notShowContactEmail === false
    ) {
      if (data[0].postType === 'Applicant') {
        this.activeModal.close();
        setTimeout(() => {
          this.router.navigate(['/applicant-preview']);
        }, 1000);
      } else if (data[0].postType === 'Recruiter') {
        this.activeModal.close();
        setTimeout(() => {
          this.router.navigate(['/recruiter-preview']);
        }, 1000);
      } else {
        this.activeModal.close();
        setTimeout(() => {
          this.router.navigate(['/review-ad']);
        }, 1000);
      }
    }
  }

  public onEmailVerifyClick = () => {
    this.spinner.show();
    const data: emailVarificationData = {
      languageID: this.selectedLanguageID,
      loginuserID: Cookie.get('userID'),
      postID: this.emailData.postID,
      postEmail: this.emailData.email,
    };
    this.homeService.emailVerification(data).subscribe((response) => {
      if (response[0].status === 'true') {
        this.showEmail = false;
        this.notShowContactEmail = true;
        this.jQueryCode();
        this.spinner.hide();
        this.toastr.successToastr(response[0].message, 'success');
        setTimeout(() => {
          const postData = {
            postID: data.postID,
            postMobile: data.postEmail,
          };
          this.homeService.nextUpdatedPostID(postData);
        }, 500);
      } else {
        this.spinner.hide();
        this.toastr.errorToastr(response[0].message);
      }
    }, error => {
      console.error(error);
      this.spinner.hide();
    });
  }

  public onContactVerifyClick = () => {
    this.spinner.show();
    const data: contactNumberVerificationData = {
      languageID: this.selectedLanguageID,
      loginuserID: Cookie.get('userID'),
      postID: this.postMobile.postID,
      postMobile: this.postMobile.contactNumber,
    };
    this.homeService.mobileVerification(data).subscribe((response) => {
      if (response[0].status === 'true') {
        this.show = false;
        this.notShowContact = true;
        this.jQueryCode();
        this.spinner.hide();
        this.toastr.successToastr(response[0].message, 'success');
        setTimeout(() => {
          const postData = {
            postID: data.postID,
            postMobile: data.postMobile,
          };
          this.homeService.nextUpdatedPostID(postData);
        }, 500);
      } else {
        this.toastr.errorToastr(response[0].message);
      }
    }, error => {
      console.error(error);
      this.spinner.hide();
    });
  }

  public onAlternateContactNumberVerify = () => {
    this.spinner.show();
    const data: alternateNumberVerificationData = {
      languageID: this.selectedLanguageID,
      loginuserID: Cookie.get('userID'),
      postID: this.alternateContactNumber.postID,
      postAlternateNo: this.alternateContactNumber.alternateContactNumber,
    };
    this.homeService.alternateMobileVerification(data).subscribe((response) => {
      if (response[0].status === 'true') {
        this.show2 = false;
        this.notShow2AlternateMobile = true;
        this.jQueryCode();
        this.spinner.hide();
        this.toastr.successToastr(response[0].message, 'success');
        setTimeout(() => {
          const postData = {
            postID: data.postID,
            postAlternateNo: data.postAlternateNo,
          };
          this.homeService.nextUpdatedPostID(postData);
        }, 500);
      } else {
        this.spinner.hide();
        this.toastr.errorToastr(response[0].message);
      }
    }, error => {
      console.error(error);
      this.spinner.hide();
    });
  }

  public onResendContactClick = () => {
    this.spinner.show();
    const data: contactNumberVerificationData = {
      languageID: this.selectedLanguageID,
      loginuserID: Cookie.get('userID'),
      postID: this.postMobile.postID,
      postMobile: this.postMobile.contactNumber,
    };
    this.homeService.mobileOtpResend(data).subscribe((response) => {
      if (response[0].status === 'true') {
        this.show = false;
        this.notShowContact = true;
        this.userMobileVerify.reset();
        this.jQueryCode();
        this.spinner.hide();
        this.toastr.successToastr(response[0].message, 'success');
      } else {
        this.spinner.hide();
        this.toastr.errorToastr(response[0].message);
      }
    }, error => {
      console.error(error);
      this.spinner.hide();
    });
  }

  public onResendAltContactClick = () => {
    this.spinner.show();
    const data: alternateNumberVerificationData = {
      languageID: this.selectedLanguageID,
      loginuserID: Cookie.get('userID'),
      postID: this.alternateContactNumber.postID,
      postAlternateNo: this.alternateContactNumber.alternateContactNumber,
    };
    this.homeService.alternateMobileOtpResend(data).subscribe((response) => {
      if (response[0].status === 'true') {
        this.show2 = false;
        this.notShow2AlternateMobile = true;
        this.userAlternateContactVerify.reset();
        this.jQueryCode();
        this.spinner.hide();
        this.toastr.successToastr(response[0].message, 'success');
      } else {
        this.spinner.hide();
        this.toastr.errorToastr(response[0].message);
      }
    }, error => {
      console.error(error);
      this.spinner.hide();
    });
  }

  public onResendEmailClick = () => {
    this.spinner.show();
    const data: emailVarificationData = {
      languageID: this.selectedLanguageID,
      loginuserID: Cookie.get('userID'),
      postID: this.emailData.postID,
      postEmail: this.emailData.email,
    };
    this.homeService.emailOtpReSend(data).subscribe((response) => {
      if (response[0].status === 'true') {
        this.showEmail = false;
        this.notShowContactEmail = true;
        this.userEmailVerify.reset();
        this.jQueryCode();
        this.spinner.hide();
        this.toastr.successToastr(response[0].message, 'success');
        setTimeout(() => {
          const postData = {
            postID: data.postID,
            postMobile: data.postEmail,
          };
          this.homeService.nextUpdatedPostID(postData);
        }, 500);
      } else {
        this.spinner.hide();
        this.toastr.errorToastr(response[0].message);
      }
    }, error => {
      console.error(error);
      this.spinner.hide();
    });
  }

  public onContactSubmitClick = (post: any) => {
    this.markFormTouched(this.userMobileVerify);
    if (this.userMobileVerify.valid) {
      this.spinner.show();
      const otp1 = post.one.concat(post.two);
      const otp2 = post.three.concat(post.four);
      const otpSubmit = otp1.concat(otp2);
      const data: contactNumberVerificationDataWithOtp = {
        languageID: this.selectedLanguageID,
        loginuserID: Cookie.get('userID'),
        postID: this.postData.postID,
        postMobile: this.postMobile.contactNumber,
        postMobileOTP: otpSubmit,
      };
      this.homeService.mobileOtpVerification(data).subscribe((response) => {
        if (response[0].status === 'true') {
          setTimeout(() => {
            this.show = false;
            this.notShowContact = false;
            this.spinner.hide();
            this.successReDirectPage(response[0].data);
          }, 2000);
          this.homeService.setPostInfoInLocalStorage(response[0].data[0]);
          this.toastr.successToastr(response[0].message, 'Verify');
        } else {
          this.spinner.hide();
          this.toastr.errorToastr(response[0].message, 'error');
        }
      }, error => {
        console.error(error);
        this.spinner.hide();
      });
    }
  }

  public onAltContactSubmitClick = (post: any) => {
    this.markFormTouched(this.userAlternateContactVerify);
    if (this.userAlternateContactVerify.valid) {
      this.spinner.show();
      const otp1 = post.one.concat(post.two);
      const otp2 = post.three.concat(post.four);
      const otpSubmit = otp1.concat(otp2);
      const data: alternateNumberVerificationDataWithOtp = {
        languageID: this.selectedLanguageID,
        loginuserID: Cookie.get('userID'),
        postID: this.alternateContactNumber.postID,
        postAlternateNo: this.alternateContactNumber.alternateContactNumber,
        postAlternateNoOTP: otpSubmit,
      };
      this.homeService
        .alternateMobileOtpVerification(data)
        .subscribe((response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.show2 = false;
              this.notShow2AlternateMobile = false;
              this.spinner.hide();
              this.successReDirectPage(response[0].data);
            }, 2000);
            this.homeService.setPostInfoInLocalStorage(response[0].data[0]);
            this.toastr.successToastr(response[0].message, 'success');
          } else {
            this.spinner.hide();
            this.toastr.errorToastr(response[0].message, 'error');
          }
        }, error => {
          console.error(error);
          this.spinner.hide();
        });
    }
  }

  public onEmailSubmitClick = (post: any) => {
    this.markFormTouched(this.userEmailVerify);
    if (this.userEmailVerify.valid) {
      this.spinner.show();
      const otp1 = post.one.concat(post.two);
      const otp2 = post.three.concat(post.four);
      const otpSubmit = otp1.concat(otp2);
      const data: emailVerificationDataWithOtp = {
        languageID: this.selectedLanguageID,
        loginuserID: Cookie.get('userID'),
        postID: this.postData.postID,
        postEmail: this.emailData.email,
        postEmailOTP: otpSubmit,
      };
      this.homeService.emailOtpSubmit(data).subscribe((response) => {
        setTimeout(() => {
          this.showEmail = false;
          this.notShowContactEmail = false;
          this.spinner.hide();
          this.successReDirectPage(response[0].data);
        }, 2000);
        if (response[0].status === 'true') {
          this.homeService.setPostInfoInLocalStorage(response[0].data[0]);
          this.toastr.successToastr(response[0].message, 'Verify');
        } else {
          this.spinner.hide();
          this.toastr.errorToastr(response[0].message, 'error');
        }
      }, error => {
        console.error(error);
        this.spinner.hide();
      });
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
}
