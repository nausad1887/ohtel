import { Component, OnInit, Input } from '@angular/core';
import {
  NgbModalOptions,
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomeService } from '../home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmedValidator } from '../sign-up-modal/confirmed.validator';

@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.scss'],
})
export class ResetPasswordModalComponent implements OnInit {
  @Input() usersData: any;
  @Input() labelData: any;
  modalOption: NgbModalOptions = {}; // not null!
  resetForm: FormGroup;
  public hide = true;
  public closeResult: string;
  public passwordData = {
    userID: '',
    languageID: '1',
    newPassword: '',
    reEnterednewPassword: '',
  };
  constructor(
    private snackBar: MatSnackBar,
    public activeModal: NgbActiveModal,
    private homeService: HomeService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    fb: FormBuilder
  ) {
    this.resetForm = fb.group(
      {
        newPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(4),
            // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
          ]),
        ],
        reEnterNewPassword: [
          null,
          Validators.compose([
            Validators.required,
            // Validators.maxLength(16),
            // Validators.minLength(6)
            // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
          ]),
        ],
      },
      {
        validator: ConfirmedValidator('newPassword', 'reEnterNewPassword'),
      }
    );
  }

  ngOnInit(): void {}

  myFunction() {
    this.hide = !this.hide;
  }

  public onClose = () => {
    this.activeModal.close();
  };

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public onResetPasswordSubmit = (post: any) => {
    this.markFormTouched(this.resetForm);
    if (this.resetForm.valid) {
      this.spinner.show();
      this.passwordData.newPassword = post.newPassword;
      this.passwordData.reEnterednewPassword = post.reEnterNewPassword;
      this.passwordData.userID = this.usersData[0].userID;
      this.homeService.resetPassword(this.passwordData).subscribe(
        (response) => {
          this.spinner.hide();
          if (response[0].status === 'true') {
            this.resetForm.reset();
            setTimeout(() => {
              this.activeModal.close();
              this.openSnackBar('Password Reset Successfully', 'success');
            }, 500);
          } else {
            this.spinner.hide();
            this.openSnackBar(response[0].message, 'error');
            console.error(response[0].message);
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
  };

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
