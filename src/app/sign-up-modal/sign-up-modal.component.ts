import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomeService } from '../home.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmedValidator } from './confirmed.validator';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SignUpData } from '../interface.component';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { VerificationModalComponent } from '../verification-modal/verification-modal.component';

@Component({
  selector: 'app-sign-up-modal',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.scss'],
})
export class SignUpModalComponent implements OnInit {
  modalOption: NgbModalOptions = {}; // not null!
  @Input() labelData: any;
  public languageID: any;
  closeResult: string;
  public hide = true;
  public flag = 'assets/images/flag_india_1.png'; // default
  signForm: FormGroup;
  public countryCodeOptions = [
    { code: '+91', flag: 'assets/images/flag_india_1.png' },
    { code: '+129', flag: 'assets/images/flag_uae_1.png' },
    { code: '+65', flag: 'assets/images/flag_usa_1.png' }
  ];
  public userInfo = [];
  constructor(
    public modalService: NgbModal,
    public snackBar: MatSnackBar,
    public homeService: HomeService,
    public toastr: ToastrManager,
    public router: Router,
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    fb: FormBuilder
  ) {
    this.signForm = fb.group(
      {
        userfirstName: [
          null,
          [
            Validators.required,
            Validators.pattern(`^[a-zA-Z -']+`),
          ],
        ],
        userLastName: [
          null,
          [
            Validators.required,
            Validators.pattern(`^[a-zA-Z -']+`),
          ],
        ],
        userMobile: [
          null,
          Validators.compose([
            Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          ]),
        ],
        userEmail: [
          null,
          Validators.compose([
            Validators.pattern(
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
          ]),
        ],
        userPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(4),
          ]),
        ],
        userCountryCode: [this.countryCodeOptions[0].code, Validators.compose([
          Validators.required
        ])],
        userConfirmedPassword: [
          null,
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(4),
          ]),
        ],
        terms: [false, Validators.required],
      },
      {
        validator: ConfirmedValidator('userPassword', 'userConfirmedPassword'),
      }
    );
  }

  ngOnInit(): void {
    this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
    });
  }

  public onChangeCode = (code: string) => {
    this.flag = this.countryCodeOptions.filter((data) => data.code === code)[0].flag;
  }
  public myFunction() {
    this.hide = !this.hide;
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public onClose = () => {
    this.activeModal.close();
  }

  public makeSessionStorageEmpty = () => {
    sessionStorage.removeItem('temporaryStorage');
  }

  public openUserMobileVerificationModal = (user: any) => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      VerificationModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (this.closeResult === 'Closed with: manually') {
          this.userInfo = JSON.parse(
            sessionStorage.getItem('temporaryStorage')
          );
          this.homeService.setInfoInLocalStorage(this.userInfo[0].data);
          Cookie.set(
            'userName',
            this.userInfo[0].userFirstName +
            ' ' +
            this.userInfo[0].data[0].userLastName
          );
          Cookie.set('userVarified', this.userInfo[0].data[0].userVerified);
          Cookie.set(
            'emailVarified',
            this.userInfo[0].data[0].userEmailVerified
          );
          Cookie.set('userID', this.userInfo[0].data[0].userID);
          Cookie.set('userRefKey', this.userInfo[0].data[0].userReferKey);
          this.homeService.updateNavbr(true);
          this.makeSessionStorageEmpty();
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        if (
          this.closeResult === 'Dismissed by clicking on a backdrop' ||
          this.closeResult === 'Dismissed by pressing ESC'
        ) {
          this.userInfo = JSON.parse(
            sessionStorage.getItem('temporaryStorage')
          );
          this.homeService.setInfoInLocalStorage(this.userInfo[0].data);
          Cookie.set(
            'userName',
            this.userInfo[0].userFirstName +
            ' ' +
            this.userInfo[0].data[0].userLastName
          );
          Cookie.set('userVarified', this.userInfo[0].data[0].userVerified);
          Cookie.set(
            'emailVarified',
            this.userInfo[0].data[0].userEmailVerified
          );
          Cookie.set('userID', this.userInfo[0].data[0].userID);
          Cookie.set('userRefKey', this.userInfo[0].data[0].userReferKey);
          this.homeService.updateNavbr(true);
          this.makeSessionStorageEmpty();
        }
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
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      VerificationModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (this.closeResult === 'Closed with: manually') {
          this.userInfo = JSON.parse(
            sessionStorage.getItem('temporaryStorage')
          );
          this.homeService.setInfoInLocalStorage(this.userInfo[0].data);
          Cookie.set(
            'userName',
            this.userInfo[0].userFirstName +
            ' ' +
            this.userInfo[0].data[0].userLastName
          );
          Cookie.set('userVarified', this.userInfo[0].data.userVerified);
          Cookie.set('emailVarified', this.userInfo[0].data.userEmailVerified);
          Cookie.set('userID', this.userInfo[0].data[0].userID);
          Cookie.set('userRefKey', this.userInfo[0].data[0].userReferKey);
          this.homeService.updateNavbr(true);
          this.makeSessionStorageEmpty();
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        if (
          this.closeResult === 'Dismissed by clicking on a backdrop' ||
          this.closeResult === 'Dismissed by pressing ESC'
        ) {
          this.userInfo = JSON.parse(
            sessionStorage.getItem('temporaryStorage')
          );
          this.homeService.setInfoInLocalStorage(this.userInfo[0].data);
          Cookie.set(
            'userName',
            this.userInfo[0].userFirstName +
            ' ' +
            this.userInfo[0].data[0].userLastName
          );
          Cookie.set('userVarified', this.userInfo[0].data.userVerified);
          Cookie.set('emailVarified', this.userInfo[0].data.userEmailVerified);
          Cookie.set('userID', this.userInfo[0].data[0].userID);
          Cookie.set('userRefKey', this.userInfo[0].data[0].userReferKey);
          this.homeService.updateNavbr(true);
          this.makeSessionStorageEmpty();
        }
      }
    );
    modalRef.componentInstance.userMobileData = user;
    modalRef.componentInstance.labelData = this.labelData;
    modalRef.componentInstance.forgetPassword = false;
    modalRef.componentInstance.userMobile = false;
    modalRef.componentInstance.userEmail = true;
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

  // checking which form control is invalid
  public findInvalidControls() {
    const invalid = [];
    const controls = this.signForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  public checkUserDuplication = (post: any) => {
    this.markFormTouched(this.signForm);
    if (!post.userMobile && !post.userEmail) {
      this.signForm.get('userMobile').setErrors({
        emptyMobile: true,
      });
      this.signForm.get('userEmail').setErrors({
        emptyEmail: true,
      });
    } else {
      this.signForm.get('userMobile').setErrors(null);
      this.signForm.get('userEmail').setErrors(null);
      this.signForm
        .get('userMobile')
        .setValidators([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]);
      this.signForm.get('userMobile').updateValueAndValidity();
      this.signForm
        .get('userEmail')
        .setValidators([
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]);
      this.signForm.get('userEmail').updateValueAndValidity();
      const invalidinput = this.findInvalidControls();
      if (this.signForm.valid && invalidinput.length === 0) {
        this.spinner.show();
        const data = {
          userEmail: post.userEmail ? post.userEmail : '',
          userMobile: post.userMobile ? post.userMobile : '',
          languageID: '1',
        };
        this.homeService.checkUserDuplication(data).subscribe((response) => {
          if (response[0].status === 'true') {
            this.signUpFunction(post);
          } else if (response[0].message === 'Email already exist.') {
            this.spinner.hide();
            this.signForm.controls.userEmail.setErrors({
              emailAlreadyExist: true,
            });
          } else if (response[0].message === 'Mobile already exist.') {
            this.spinner.hide();
            this.signForm.controls.userMobile.setErrors({
              mobileExist: true,
            });
          } else {
            this.signUpFunction(post);
          }
        });
      }
    }
  }

  public signUpFunction: any = (post: any) => {
    this.markFormTouched(this.signForm);
    if (this.signForm.valid) {
      const data: SignUpData = {
        userFirstName: post.userfirstName,
        userLastName: post.userLastName,
        userEmail: post.userEmail ? post.userEmail : '',
        userCountryCode: '+91',
        userMobile: post.userMobile ? post.userMobile : '',
        userPassword: post.userPassword,
        userProfilePicture: '',
        languageID: this.languageID ? this.languageID : '1',
      };
      this.homeService.userRegistration(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.openSnackBar(response[0].message, 'success');
            sessionStorage.setItem(
              'temporaryStorage',
              JSON.stringify(response)
            );
            const verificationdata = {
              userID: response[0].data[0].userID,
              userMobile: post.userMobile,
              userEmail: post.userEmail,
              languageID: this.languageID ? this.languageID : '1',
            };
            setTimeout(() => {
              this.spinner.hide();
              this.activeModal.close();
              this.checkInputStatus(verificationdata);
            });
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
      this.signForm.controls.terms.setValue(false);
    }
  } // end of SignUp session

  public checkInputStatus = (input: any) => {
    if (input.userMobile && input.userEmail) {
      const data = {
        loginuserID: input.userID,
        userMobile: input.userMobile,
        languageID: input.languageID,
        message: '',
      };
      this.userMobileVerification(data);
    } else if (input.userMobile) {
      const data = {
        loginuserID: input.userID,
        userMobile: input.userMobile,
        languageID: input.languageID,
        message: '',
      };
      this.userMobileVerification(data);
    } else if (input.userEmail) {
      const data = {
        loginuserID: input.userID,
        userEmail: input.userEmail,
        languageID: input.languageID,
        message: '',
      };
      this.userEmailVerification(data);
    }
  }

  public userMobileVerification = (data: any) => {
    this.homeService.userMobileVerification(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
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
          console.error(response[0].message);
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public userEmailVerification = (data: any) => {
    this.homeService.userEmailVerification(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
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
          console.error(response[0].message);
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (error) => {
        console.error(error);
      }
    );
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
