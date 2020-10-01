import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../home.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { VerificationModalComponent } from '../verification-modal/verification-modal.component';

@Component({
  selector: 'app-forget-password-modal',
  templateUrl: './forget-password-modal.component.html',
  styleUrls: ['./forget-password-modal.component.scss'],
})
export class ForgetPasswordModalComponent implements OnInit {
  @Input() labelData: any;
  forgetForm: FormGroup;
  modalOption: NgbModalOptions = {}; // not null!
  public languageID: any;
  public data = {
    mobileNumber: '',
    email: '',
    languageID: '1',
  };
  public verificationData = {
    userID: '',
    userMobile: '',
    message: '',
  };
  public closedReason: string;
  constructor(
    fb: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private homeService: HomeService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {
    this.forgetForm = fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/
          ),
        ]),
      ],
    });
  }

  ngOnInit(): void {
    this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
    });
  }

  public onClose = () => {
    this.activeModal.close();
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public openOtpVerificationModal = (data: any) => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      VerificationModalComponent,
      this.modalOption
    );
    modalRef.componentInstance.usersData = data;
    modalRef.componentInstance.labelData = this.labelData;
    modalRef.componentInstance.forgetPassword = true;
    modalRef.componentInstance.userMobile = false;
    modalRef.componentInstance.userEmail = false;

    modalRef.result.then(
      (result) => {
        // this.checkStatus();
        this.closedReason = `Closed with: ${result}`;
      },
      (reason) => {
        this.closedReason = `Dismissed ${this.getDismissReason(reason)}`;
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

  public onSubmitEmailOrMobile = (post: any) => {
    this.markFormTouched(this.forgetForm);
    if (this.forgetForm.valid) {
      this.spinner.show();
      if (!isNaN(post.email)) {
        (this.data.languageID = this.languageID),
          (this.data.mobileNumber = post.email);
        this.data.email = '';
        this.forgetPasswordNumber();
      } else {
        (this.data.languageID = this.languageID),
          (this.data.email = post.email);
        this.data.mobileNumber = '';
        this.forgetPasswordEmail();
      }
    } else {
      // this.forgetForm.controls.terms.setValue(false);
    }
  }

  public forgetPasswordNumber = () => {
    this.homeService.forgetPassword(this.data).subscribe(
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
            this.verificationData.userID = response[0].data[0].userID;
            this.verificationData.userMobile = response[0].data[0].userMobile;
            this.verificationData.message = `${firstStr}${this.labelData[0].Mobile_number} ${secondStr}`;
            this.openOtpVerificationModal(this.verificationData);
            this.openSnackBar(
              'Check your phone, We have send OTP on your Mobile Number.',
              'success'
            );
          } else {
            this.verificationData.userID = response[0].data[0].userID;
            this.verificationData.userMobile = response[0].data[0].userMobile;
            this.verificationData.message = `${this.labelData[0].Please_enter_the_4_digit_OTP_received_on_your} ${this.labelData[0].Mobile_number}`;
            this.openOtpVerificationModal(this.verificationData);
            this.openSnackBar(
              'Check your phone, We have send OTP on your Mobile Number.',
              'success'
            );
          }
        } else {
          this.spinner.hide();
          this.openSnackBar(
            'Please Enter Valid Email or Mobile Number',
            'error'
          );
          console.error(response[0].message);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  public forgetPasswordEmail = () => {
    this.homeService.forgetPassword(this.data).subscribe(
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
            this.verificationData.userID = response[0].data[0].userID;
            this.verificationData.userMobile = response[0].data[0].userMobile;
            this.verificationData.message = `${firstStr}${this.labelData[0].Email_id} ${secondStr}`;
            this.openOtpVerificationModal(this.verificationData);
            this.openSnackBar(
              'Check your phone, We have send OTP on your Email.',
              'success'
            );
          } else {
            this.verificationData.userID = response[0].data[0].userID;
            this.verificationData.userMobile = response[0].data[0].userMobile;
            this.verificationData.message = `${this.labelData[0].Please_enter_the_4_digit_OTP_received_on_your} ${this.labelData[0].Email_id}`;
            this.openOtpVerificationModal(this.verificationData);
            this.openSnackBar(
              'Check your phone, We have send OTP on your Email.',
              'success'
            );
          }
        } else {
          this.spinner.hide();
          this.openSnackBar(
            'Please Enter Valid Email or Mobile Number',
            'error'
          );
          console.error(response[0].message);
        }
      },
      (error) => {
        this.spinner.hide();
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
