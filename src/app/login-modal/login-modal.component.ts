import { Component, OnInit, Input } from '@angular/core';
import { SignUpModalComponent } from '../sign-up-modal/sign-up-modal.component';
import { ModalDismissReasons, NgbModalOptions, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SignInData } from '../interface.component';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomeService } from '../home.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ForgetPasswordModalComponent } from '../forget-password-modal/forget-password-modal.component';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit {
  modalOption: NgbModalOptions = {}; // not null!
  @Input() currentRoute: any;
  @Input() labelData: any;
  closeResult: string;
  public hide = true;
  returnUrl: string;
  loginForm: FormGroup;
  public languageID: any;
  public userInfo = [];
  constructor(
    public modalService: NgbModal,
    public snackBar: MatSnackBar,
    public homeService: HomeService,
    public toastr: ToastrManager,
    public router: Router,
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.loginForm = fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/
          ),
        ]),
      ],
      password: [null, Validators.required],
    });
  }

  ngOnInit(): void {
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

  myFunction() {
    this.hide = !this.hide;
  }

  public onClose = () => {
    this.activeModal.close('manually');
  }

  public openSignUpModal = () => {
    this.activeModal.close('open signUp modal');
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      SignUpModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    modalRef.componentInstance.labelData = this.labelData;
  }

  public openForgetPasswordModal = () => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      ForgetPasswordModalComponent,
      this.modalOption
    );
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

  // UserLogin
  public signInFunction: any = (post: any) => {
    this.markFormTouched(this.loginForm);
    if (this.loginForm.valid) {
      this.spinner.show();
      const data: SignInData = {
        languageID: this.languageID ? this.languageID : '1',
        emailOrMobileNumber: post.email,
        password: post.password,
      };
      this.homeService.userLogin(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.userInfo = response[0].data;
            this.homeService.setInfoInLocalStorage(response[0].data);
            Cookie.set(
              'userName',
              response[0].data[0].userFirstName +
              ' ' +
              response[0].data[0].userLastName
            );
            Cookie.set('userVarified', response[0].data[0].userVerified);
            Cookie.set('emailVarified', response[0].data[0].userEmailVerified);
            Cookie.set('userID', response[0].data[0].userID);
            Cookie.set('userRefKey', response[0].data[0].userReferKey);
            this.homeService.updateNavbr(true);
            setTimeout(() => {
              this.spinner.hide();
              this.currentRoute
                ? this.navigateOnCurrentUrl(this.userInfo)
                : this.activeModal.close();
            }, 1500);
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
  }

  public navigateOnCurrentUrl = (userInfo: any) => {
    this.activeModal.close();
    const url = this.currentRoute.queryParams.returnUrl;
    this.router.navigate([url], {
      state: {
        data: {
          contactNumber: userInfo[0].userMobile ? userInfo[0].userMobile : null,
          email: userInfo[0].userEmail ? userInfo[0].userEmail : '',
        },
      },
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
