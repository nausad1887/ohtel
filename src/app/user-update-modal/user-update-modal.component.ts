import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HomeService } from '../home.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateUserData } from '../interface.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-user-update-modal',
  templateUrl: './user-update-modal.component.html',
  styleUrls: ['./user-update-modal.component.scss'],
})
export class UserUpdateModalComponent implements OnInit {
  @Input() data: any;
  @Input() labelData: any;
  updateUser: FormGroup;
  public updatedData = [];
  public accountData = [];
  constructor(
    public toastr: ToastrManager,
    public homeService: HomeService,
    public activeModal: NgbActiveModal,
    public fb: FormBuilder,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.updateUser = this.fb.group({
      userfirstName: [
        this.data.userFirstName,
        [
          Validators.required,
          Validators.pattern(`^[a-zA-Z -']+`),
        ],
      ],
      userLastName: [
        this.data.userLastName,
        [
          Validators.required,
          Validators.pattern(`^[a-zA-Z -']+`),
        ],
      ],
      userMobile: [
        {
          value: this.data.userMobile,
          disabled: this.data.userVerified === 'Yes',
        },
        Validators.compose([
          Validators.required,
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ]),
      ],
      userEmail: [
        {
          value: this.data.userEmail,
          disabled: this.data.userEmailVerified === 'Yes',
        },
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]),
      ],
    });
  }
  onClose() {
    this.activeModal.close();
  }

  public checkUserDuplication = (post: any) => {
    if (
      post.userEmail !== this.data.userEmail &&
      post.userMobile !== this.data.userMobile
    ) {
      this.markFormTouched(this.updateUser);
      if (this.updateUser.valid) {
        this.spinner.show();
        const data = {
          userEmail: post.userEmail,
          userMobile: post.userMobile,
          languageID: '1',
        };
        this.homeService.checkUserDuplication(data).subscribe((response) => {
          if (response[0].status === 'true') {
            this.updateUserProfile(post);
          } else if (response[0].message === 'Email already exist.') {
            this.spinner.hide();
            this.updateUser.controls.userEmail.setErrors({
              emailAlreadyExist: true,
            });
          } else {
            this.spinner.hide();
            this.updateUser.controls.userMobile.setErrors({
              mobileExist: true,
            });
          }
        });
      }
    } else if (post.userEmail !== this.data.userEmail) {
      this.markFormTouched(this.updateUser);
      if (this.updateUser.valid) {
        this.spinner.show();
        const data = {
          userEmail: post.userEmail,
          userMobile: '',
          languageID: '1',
        };
        this.homeService.checkUserDuplication(data).subscribe((response) => {
          if (response[0].status === 'true') {
            this.updateUserProfile(post);
          } else if (response[0].message === 'Email already exist.') {
            this.spinner.hide();
            this.updateUser.controls.userEmail.setErrors({
              emailAlreadyExist: true,
            });
          } else {
            this.spinner.hide();
            this.updateUser.controls.userMobile.setErrors({
              mobileExist: true,
            });
          }
        });
      }
    } else if (post.userMobile !== this.data.userMobile) {
      this.markFormTouched(this.updateUser);
      if (this.updateUser.valid) {
        this.spinner.show();
        const data = {
          userEmail: '',
          userMobile: post.userMobile,
          languageID: '1',
        };
        this.homeService.checkUserDuplication(data).subscribe((response) => {
          if (response[0].status === 'true') {
            this.updateUserProfile(post);
          } else if (response[0].message === 'Email already exist.') {
            this.spinner.hide();
            this.updateUser.controls.userEmail.setErrors({
              emailAlreadyExist: true,
            });
          } else {
            this.spinner.hide();
            this.updateUser.controls.userMobile.setErrors({
              mobileExist: true,
            });
          }
        });
      }
    } else {
      this.updateUserProfile(post);
    }
  }

  public updateUserProfile = (post: any) => {
    if (this.updateUser.valid) {
      const userData: UpdateUserData = {
        languageID: this.data.languageID,
        userID: this.data.userID,
        firstName: post.userfirstName,
        lastName: post.userLastName,
        email: post.userEmail ? post.userEmail : this.data.userEmail,
        mobileNumber: post.userMobile ? post.userMobile : this.data.userMobile,
        userProfilePicture: this.data.userProfilePicture,
      };
      this.homeService.userUpdate(userData).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.spinner.hide();
            this.updatedData = response[0].data;
            this.openSnackBar('Profile Update Successfully', 'success');
            this.homeService.setInfoInLocalStorage(response[0].data);
            Cookie.set('userName', `${response[0].data[0].userFirstName} ${response[0].data[0].userLastName}`);
            Cookie.set('userID', response[0].data[0].userID);
            Cookie.set('userRefKey', response[0].data[0].userReferKey);
            Cookie.set('userVarified', response[0].data[0].userVerified);
            Cookie.set('emailVarified', response[0].data[0].userEmailVerified);
            setTimeout(() => {
              this.updateUser.reset();
              this.activeModal.close('success');
            }, 1000);
          } else {
            this.spinner.hide();
            console.error(response[0].message);
            this.openSnackBar('some error occured', 'error');
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );
    }
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
}
