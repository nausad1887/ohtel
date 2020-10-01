import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../home.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss'],
})
export class OtpVerifyComponent implements OnInit {
  public postData: any;
  public userInfo: any;
  public one: any;
  public two: any;
  public three: any;
  public four: any;
  public number: number;
  public selectedLanguageID: any;

  public exm = ["1", "2", "3"]
  public show:boolean = false;
  public show2:boolean = false;



  constructor(
    public activeModal: NgbActiveModal,
    public homeService: HomeService,
    public toastr: ToastrManager,
    public router: Router
  ) {}

  ngOnInit(): void {
    //this.postData = this.homeService.getPostIDInfoFromLocalStorage();
    this.userInfo = this.homeService.getUserInfoFromLocalStorage();
    this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.selectedLanguageID = languageID;
    });
    this.homeService.updatedPostID.subscribe((postData) => {
      this.postData = postData;
      //console.log(this.postData.postMobile)
      console.log(this.postData);
      //this.number = this.postData.postMobile;
    });
  }
            
  toggle() {
    this.show = !this.show;
    //this.show2 = !this.show2;

    // CHANGE THE NAME OF THE BUTTON.
    // if(this.show)  
    //   this.buttonName = "Hide";
    // else
    //   this.buttonName = "Show";
  }
  toggle1() {
    //this.show = !this.show;
    this.show2 = !this.show2;

    // CHANGE THE NAME OF THE BUTTON.
    // if(this.show)  
    //   this.buttonName = "Hide";
    // else
    //   this.buttonName = "Show";
  }


  public onResendClick = () => {
    if (this.postData.postMobile === 'true') {
      const data = {
        languageID: this.selectedLanguageID,
        loginuserID: this.userInfo[0].userID,
        postID: this.postData.postID,
        postMobile: this.postData.postMobile,
      };
      console.log(`on resend click mobile data ${JSON.stringify(data)}`);
      this.homeService.mobileOtpResend(data).subscribe((response) => {
        if (response[0].status === 'true') {
          this.toastr.successToastr(response[0].message, 'success');
        } else {
          this.toastr.errorToastr(response[0].message);
        }
      });
    } else {
      const data = {
        languageID: this.selectedLanguageID,
        loginuserID: this.userInfo[0].userID,
        postID: this.postData.postID,
        postAlternateNo: this.postData.postAlternateNo,
      };
      console.log(
        `on resend click alternate mobile data ${JSON.stringify(data)}`
      );
      this.homeService.alternateMobileOtpResend(data).subscribe((response) => {
        if (response[0].status === 'true') {
         
          this.toastr.successToastr(response[0].message, 'success');
        } else {
          this.toastr.errorToastr(response[0].message);
        }
      });
    }
  };

  public onSubmit(form: NgForm) {
    if (this.postData.postMobile) {
      if (!this.one) {
        this.toastr.warningToastr('Please enter Otp currectly');
      } else if (!this.two) {
        this.toastr.warningToastr('Please enter Otp currectly');
      } else if (!this.three) {
        this.toastr.warningToastr('Please enter Otp currectly');
      } else if (!this.four) {
        this.toastr.warningToastr('Please enter Otp currectly');
      } else {
        let otp1 = this.one.concat(this.two);
        let otp2 = this.three.concat(this.four);
        let otp3 = otp1.concat(otp2);
        console.log(otp3);
        const data = {
          languageID: this.selectedLanguageID,
          loginuserID: this.userInfo[0].userID,
          postID: this.postData.postID,
          postMobile: this.postData.postMobile,
          postMobileOTP: otp3,
        };
        console.log(`mobile submit data ${JSON.stringify(data)}`);
        this.homeService.mobileOtpVerification(data).subscribe((response) => {
          if (response[0].status === 'true') {
              this.homeService.setPostInfoInLocalStorage(response[0].data[0]);
            this.toastr.successToastr(response[0].message, 'success');
            form.resetForm();
            this.activeModal.close();
            this.router.navigate(['/review-ad']);
          } else {
            this.toastr.errorToastr(response[0].message, 'error');
            setTimeout(() => {
              this.toastr.warningToastr('Please Re-send otp again', 'warning');
            }, 2000);
          }
        });
      }
    } else {
      if (!this.one) {
        this.toastr.warningToastr('Please enter Otp currectly');
      } else if (!this.two) {
        this.toastr.warningToastr('Please enter Otp currectly');
      } else if (!this.three) {
        this.toastr.warningToastr('Please enter Otp currectly');
      } else if (!this.four) {
        this.toastr.warningToastr('Please enter Otp currectly');
      } else {
        let otp1 = this.one.concat(this.two);
        let otp2 = this.three.concat(this.four);
        let otp3 = otp1.concat(otp2);
        console.log(otp3);
        const data = {
          languageID: this.selectedLanguageID,
          loginuserID: this.userInfo[0].userID,
          postID: this.postData.postID,
          postAlternateNo: this.postData.postAlternateNo,
          postMobileOTP: otp3,
        };
        console.log(`alternate mobile submit data ${JSON.stringify(data)}`);
        this.homeService
          .alternateMobileOtpVerification(data)
          .subscribe((response) => {
            if (response[0].status === 'true') {
                this.homeService.setPostInfoInLocalStorage(response[0].data[0]);
              this.toastr.successToastr(response[0].message, 'success');
              form.resetForm();
              this.activeModal.close();
              this.router.navigate(['/review-ad']);
            } else {
              this.toastr.errorToastr(response[0].message, 'error');
              setTimeout(() => {
                this.toastr.warningToastr(
                  'Please Re-send otp again',
                  'warning'
                );
              }, 2000);
            }
          });
      }
    }
  }
}
