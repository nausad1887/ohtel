import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  NgbModalOptions,
  NgbModal,
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../home.service';
import { CongratulationPopUpComponent } from '../congratulation-pop-up/congratulation-pop-up.component';

@Component({
  selector: 'app-jobs-applicant-preview',
  templateUrl: './jobs-applicant-preview.component.html',
  styleUrls: ['./jobs-applicant-preview.component.scss'],
})
export class JobsApplicantPreviewComponent implements OnInit {
  public applicantDetailsData: any;
  public images: any;
  public img: any;
  public imagePath: any;
  public imageUrlArr = [];
  public userProfilePic: any;
  public userProfileUrl = '';
  public imageUrl: any;
  modalOption: NgbModalOptions = {}; // not null!
  customOptions: OwlOptions = {
    // stagePadding: 50,
    loop: true,
    margin: 15,
    autoplay: true,
    autoplayTimeout: 1000,
    autoplayHoverPause: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 500,
    // navText: ['Previous', 'Next'],
    responsive: {
      0: {
        // this is for break-point
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 2,
      },
      940: {
        items: 3,
      },
    },
    // nav: true,
  };

  constructor(
    public homeService: HomeService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.makeItFalse();
    });
    this.applicantDetailsData = this.homeService.getPostInfoFromLocalStorage();
    this.images = this.applicantDetailsData.postotherResume;
    this.userProfilePic = this.applicantDetailsData.userProfilePicture;
    this.imagePath = this.applicantDetailsData.userID;
    this.userProfileUrl = `http://betaapplication.com/ohtel/backend/web/uploads/${this.imagePath}/${this.userProfilePic}`;
    this.img = this.images.split(',');
    setTimeout(() => {
      this.arrOfImg();
    }, 1000);
  }

  arrOfImg = () => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.img.length; i++) {
      this.imageUrlArr.push(
        `http://betaapplication.com/ohtel/backend/web/uploads/${this.imagePath}/${this.img[i]}`
      );
      this.cd.detectChanges();
    }
  };

  public openConfirmationPopUp = () => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    setTimeout(() => {
      const modalRef = this.modalService.open(
        CongratulationPopUpComponent,
        this.modalOption
      );
      modalRef.componentInstance.emailData = 'Confirm';
    }, 3000);
  };

  DownloadProfilePic(imageUrl: any) {
    const url = imageUrl;
    window.open(url);
  }

  makeItFalse() {
    const isTrue = false;
    this.homeService.nextCountBoolean(isTrue);
  }
}
