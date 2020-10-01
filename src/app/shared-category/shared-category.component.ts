import { Component, OnInit, DoCheck, KeyValueDiffers } from '@angular/core';
import { HomeService } from '../home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shared-category',
  templateUrl: './shared-category.component.html',
  styleUrls: ['./shared-category.component.scss']
})
export class SharedCategoryComponent implements OnInit, DoCheck {
  public categoryLists = [];
  public labelData = [];
  public differ: any;
  public selectedLanguageID: string;
  categoryLists$: Observable<Array<any>>;

  constructor(
    public homeService: HomeService,
    private differs: KeyValueDiffers,
    private spinner: NgxSpinnerService
  ) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.selectedLanguageID = languageID;
    });
    this.getAccountLabel();
    this.getCategoriesLists();
  }

  public getAccountLabel = () => {
    return new Promise((resolve, reject) => {
      this.homeService.getLabel().subscribe((response) => {
        if (response[0].info === 'RECORDFOUND') {
          this.labelData = response[0].data;
          if (this.categoryLists.length > 0) {
            this.spinner.hide();
          }
          resolve(this.labelData);
        } else {
          console.error(response);
          reject(response[0].info);
        }
      });
    });
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'selectedLanguageID') {
          this.spinner.show();
          this.getAccountLabel();
        }
      });
    }
  }

  public getCategoriesLists = () => {
    this.categoryLists$ = this.homeService.getCategoryList;
    this.categoryLists$.subscribe(
      (response) => {
        if (response.length > 0) {
          this.categoryLists = response;
          this.categoryLists.sort((a, b) => {
            return a.categoryID - b.categoryID;
          });
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
