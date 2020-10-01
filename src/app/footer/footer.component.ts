import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public languageData = [];
  public languageID: any;
  constructor(public homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
      if (this.languageID) {
        this.changeLanguage(this.languageID);
      }
    });
  }
  public changeLanguage = (languageID: string) => {
    return new Promise((resolve, reject) => {
      this.homeService.changeLanguage(languageID).subscribe(
        (response) => {
          if (response[0].info === 'RECORDFOUND') {
            this.languageData = response[0].data;
            resolve(this.languageData);
          } else {
            console.error(response);
            reject(response[0].info);
          }
        },
        (error) => {
          console.error(error);
          reject(error);
        }
      );
    });
  };
}
