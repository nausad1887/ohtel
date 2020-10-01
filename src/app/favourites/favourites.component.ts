import { Component, OnInit, DoCheck, KeyValueDiffers, OnDestroy } from '@angular/core';
import { HomeService } from '../home.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { trigger } from '@angular/animations';
import { fadeIn } from '../details/animation';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
  animations: [trigger('fadeIn', fadeIn())]
})
export class FavouritesComponent implements OnInit, DoCheck, OnDestroy {
  public labelData = [];
  public differ: any;
  public p = 1;
  public languageID = '';
  public cityID: string;
  public categoryID = '11';
  categoryLists$: Observable<Array<any>>;
  userFavouriteLists$: Observable<Array<any>>;
  labelSubscription: Subscription;
  public data = {
    categoryID: '11',
    loginuserID: Cookie.get('userID') ? Cookie.get('userID') : '',
    languageID: '',
  };

  constructor(
    public homeService: HomeService,
    public toastr: ToastrManager,
    public router: Router,
    private spinner: NgxSpinnerService,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.updatedLanguageAndUpdatedCity();
    this.getAccountLabel().then((response: Array<any>) => {
      response.length > 0
        ? (this.labelData = response)
        : (this.labelData = []);
    }).catch(() => this.spinner.hide());
    this.categoryLists$ = this.homeService.getCategoryList;
    setTimeout(() => {
      this.getUserFavouritesLists();
    });
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'languageID') {
          this.spinner.show();
          this.getAccountLabel().then((response: Array<any>) => {
            response.length > 0
              ? (this.labelData = response)
              : (this.labelData = []);
            this.spinner.hide();
          }).catch(() => this.spinner.hide());
        }
        if (item.key === 'categoryID') {
          this.getUserFavouritesLists();
        }
      });
    }
  }

  public updatedLanguageAndUpdatedCity = () => {
    this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
      this.data.languageID = languageID;
    });
    this.homeService.updatedID.subscribe((cityId) => {
      this.cityID = cityId;
    });
  }

  public getAccountLabel = () => {
    return new Promise((resolve, reject) => {
      this.labelSubscription = this.homeService.getLabel().subscribe(
        (response) => {
          if (response[0].info === 'RECORDFOUND') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        }, (error) => reject(error));
    });
  }

  public onChangeCategoryID = (categoryID: string) => {
    this.categoryID = categoryID;
    this.data.categoryID = categoryID;
  }

  public getUserFavouritesLists = () => {
    this.userFavouriteLists$ = this.homeService.getUserFavourites(this.data);
  }

  public postFavourites = (post: any) => {
    const data = { postID: post.postID, loginuserID: Cookie.get('userID'), languageID: this.languageID };
    this.unfavourite(data).then((response: string) => {
      if (response === 'success') {
        this.toastr.successToastr('removed', 'success');
        this.getUserFavouritesLists();
      } else { this.toastr.errorToastr(response, 'error'); }
    }).catch((error) => console.error(error));
  }
  public unfavourite = (data: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.postingUserUnFavourites(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve('success');
          } else {
            resolve(response[0].message);
          }
        }, (error) => reject(error));
    });
  }

  public getIndexOfPost = (post: any) => {
    if (post.postType === 'Applicant') {
      this.homeService.setPostInfoInLocalStorage(post);
      setTimeout(() => {
        this.router.navigate(['/applicant-details']);
      }, 100);
    }
    if (post.postType === 'Recruiter') {
      this.homeService.setPostInfoInLocalStorage(post);
      setTimeout(() => {
        this.router.navigate(['/recruiter-details']);
      }, 100);
    }
    if (post.postType === 'Seller' || post.postType === 'Buyer') {
      this.homeService.setPostInfoInLocalStorage(post);
      setTimeout(() => {
        this.router.navigate(['/ads-details']);
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.labelSubscription) { this.labelSubscription.unsubscribe(); }
  }
}
