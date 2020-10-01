import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  NgbModalOptions,
  NgbModal,
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.scss'],
})
export class ApplicantDetailsComponent implements OnInit {
  public applicantDetailsData: any;
  public images: any;
  public img: any;
  public imagePath: any;
  public imageUrlArr = [];
  public userProfilePic: any;
  public userProfileUrl = '';
  public imageUrl: any;
  constructor(public homeService: HomeService, private cd: ChangeDetectorRef) {}

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

  DownloadProfilePic(imageUrl: any) {
    const url = imageUrl;
    window.open(url);
  }

  makeItFalse() {
    const isTrue = false;
    this.homeService.nextCountBoolean(isTrue);
  }
}
