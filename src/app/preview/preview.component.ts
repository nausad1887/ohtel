import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HomeService } from '../home.service';
import { NgbModal, NgbActiveModal, NgbModalOptions, } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CongratulationPopUpComponent } from '../congratulation-pop-up/congratulation-pop-up.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  public spacesDetailsData: any;
  public images: any;
  public img: any;
  public imagePath: any;
  public imageUrlArr = [];
  public defaultImageUrl = [];
  public imageUrl: any;
  modalOption: NgbModalOptions = {}; // not null!
  customOptions: OwlOptions = {
    loop: true,
    margin: 15,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 500,
    responsive: {
      0: {
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
    }
  };
  public userID: any;

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
    this.images = this.spacesDetailsData.postImage;
    this.userID = this.spacesDetailsData.userID;
    this.img = this.images.split(',');
    this.imagePath = this.userID;
    this.arrOfImg();
    this.defaultImage();
  }

  public defaultImage = () => {
    if (this.spacesDetailsData.categoryName === 'Used Equipments') {
      for (let i = 1; i <= 4; i++) {
        this.defaultImageUrl.push(`assets/images/equipments${i}.jpg`);
      }
    } else {
      for (let i = 1; i <= 4; i++) {
        this.defaultImageUrl.push(`assets/images/spaces${i}.png`);
      }
    }
  }
  public handleImgError(ev: any, item: any) {
    const source = ev.srcElement;
    const imgSrc = `assets/images/spaces${item + 1}.png`;
    source.src = imgSrc;
  }
  public arrOfImg = () => {
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
  }
  public openConfirmationPopUp = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    setTimeout(() => {
      const modalRef = this.modalService.open(
        CongratulationPopUpComponent,
        this.modalOption
      );
      modalRef.componentInstance.data = data;
    }, 1500);
  }
  public makeItFalse() {
    const isTrue = false;
    this.homeService.nextCountBoolean(isTrue);
  }
}
