import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../home.service';
import { CongratulationPopUpComponent } from '../congratulation-pop-up/congratulation-pop-up.component';
import { NgbModalOptions, NgbModal, NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recruiter-preview',
  templateUrl: './recruiter-preview.component.html',
  styleUrls: ['./recruiter-preview.component.scss'],
})
export class RecruiterPreviewComponent implements OnInit {
  public spacesDetailsData: any;
  public images: any;
  public img: any;
  public imagePath: any;
  public imageUrlArr = [];
  public defaultImageUrl = [];
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
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.makeItFalse();
    });
    this.spacesDetailsData = this.homeService.getPostInfoFromLocalStorage();
    this.spacesDetailsData.interviewtime = this.tConvert(this.spacesDetailsData.postotherInterviewTime);
    this.images = this.spacesDetailsData.postImage;
    this.img = this.images.split(',');
    this.imagePath = this.spacesDetailsData.userID;
    this.arrOfImg();
    this.defaultImage();
  }

  public defaultImage = () => {
    for (let i = 1; i <= 4; i++) {
      this.defaultImageUrl.push(`assets/images/jobs${i}.png`);
    }
  };

  handleImgError(ev: any, item: any) {
    const source = ev.srcElement;
    const imgSrc = `assets/images/jobs${item + 1}.png`;
    source.src = imgSrc;
  }

  arrOfImg = () => {
    if (this.images) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.img.length; i++) {
        this.imageUrlArr.push(
          `http://betaapplication.com/ohtel/backend/web/uploads/${this.imagePath}/${this.img[i]}`
        );
        this.cd.detectChanges();
      }
    } else {
      this.imageUrlArr = [];
    }
  };

  public openConfirmationPopUp = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    setTimeout(() => {
      const modalRef = this.modalService.open(
        CongratulationPopUpComponent,
        this.modalOption
      );
      modalRef.componentInstance.data = data;
    }, 3000);
  };
  makeItFalse() {
    const isTrue = false;
    this.homeService.nextCountBoolean(isTrue);
  }

  public tConvert(time: any) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    time[0] < 10 ? (time[0] = '0' + time[0]) : (time[0] = time[0]);
    return time[0] + '' + time[1] + '' + time[2] + ' ' + time[5]; // return adjusted time or original string
  }
}
