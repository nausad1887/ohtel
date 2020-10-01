import { Component, OnInit, KeyValueDiffers, DoCheck, OnDestroy } from '@angular/core';
import { HomeService } from '../home.service';
import { NgbActiveModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { fadeIn } from '../details/animation';
import { trigger } from '@angular/animations';
@Component({
  selector: 'app-my-ads',
  templateUrl: './my-ads.component.html',
  styleUrls: ['./my-ads.component.scss'],
  animations: [trigger('fadeIn', fadeIn())]
})
export class MyAdsComponent implements OnInit, DoCheck, OnDestroy {
  public myPostsLive = [];
  public myPostsPast = [];
  public myPosts = [];
  public categoryLists = [];
  public labelData = [];
  public differ: any;
  public pageSize = 6;
  public page = 1;
  public pagePast = 1;
  public noRecordFound = false;
  public loading = false;
  public languageID = '';
  public categoryID = '11';
  public type = 'All';
  public data = {
    categoryID: '11',
    mypostType: 'All',
    loginuserID: Cookie.get('userID') ? Cookie.get('userID') : '',
    languageID: '',
  };
  public status = ['All', 'Live', 'Past'];
  categoryLists$: Observable<Array<any>>;
  catSubscription: Subscription;
  labelSubscription: Subscription;
  myPostSubscription: Subscription;
  constructor(
    public homeService: HomeService,
    public activeModal: NgbActiveModal,
    public toastr: ToastrManager,
    public router: Router,
    private spinner: NgxSpinnerService,
    public config: NgbPaginationConfig,
    private differs: KeyValueDiffers
  ) {
    config.size = 'sm';
    config.boundaryLinks = true;
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.loading = true;
    setTimeout(() => {
      this.makeItFalse();
    });
    this.homeService.updatedLanguageID.subscribe((languageID) => {
      this.languageID = languageID;
      this.data.languageID = languageID;
    });
    this.spinner.show();
    setTimeout(async () => {
      await this.getAccountLabel().then((response: Array<any>) => {
        if (response.length > 0) {
          this.labelData = response;
          if (this.categoryLists.length > 0) {
            this.labelData.map((lanData) => {
              this.categoryLists[0].categoryName = lanData.Spaces;
              this.categoryLists[1].categoryName = lanData.Used_equipments;
              this.categoryLists[2].categoryName = lanData.Jobs;
            });
          }
        } else {
          this.labelData = [];
        }
      }).catch((error) => {
        console.error(error);
      });
      this.getCategoryList().then((response: Array<any>) => {
        if (response.length > 0) {
          this.categoryLists = response;
          this.categoryLists.sort((a, b) => a.categoryID - b.categoryID);
          this.labelData.map((lanData) => {
            this.categoryLists[0].categoryName = lanData.Spaces;
            this.categoryLists[1].categoryName = lanData.Used_equipments;
            this.categoryLists[2].categoryName = lanData.Jobs;
          });
        } else {
          this.categoryLists = [];
        }
      }).catch((error) => {
        console.error(error);
      });
      this.asyncCall();
    });
  }

  public getType = (type: string) => {
    this.type = type;
    this.data.mypostType = type;
  }

  public getCategoryID = (categoryID: string) => {
    this.categoryID = categoryID;
    this.data.categoryID = categoryID;
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'languageID') {
          this.spinner.show();
          this.getAccountLabel().then((response: Array<any>) => {
            if (response.length > 0) {
              this.labelData = response;
              if (this.categoryLists.length > 0) {
                this.labelData.map((lanData) => {
                  this.categoryLists[0].categoryName = lanData.Spaces;
                  this.categoryLists[1].categoryName = lanData.Used_equipments;
                  this.categoryLists[2].categoryName = lanData.Jobs;
                });
                this.spinner.hide();
              }
            } else {
              this.spinner.hide();
              this.labelData = [];
            }
          }).catch((error) => {
            this.spinner.hide();
            console.error(error);
          });
        }
        if (item.key === 'categoryID') {
          this.spinner.show();
          this.myPosts = [];
          this.loading = true;
          this.noRecordFound = false;
          this.asyncCall();
        }
        if (item.key === 'type') {
          this.spinner.show();
          this.myPosts = [];
          this.loading = true;
          this.noRecordFound = false;
          this.asyncCall();
        }
      });
    }
  }

  public asyncCall = () => {
    this.getUserPostsAll().then(async (response: Array<any>) => {
      if (response.length > 0) {
        await this.sortPostByDate(response).then((data: Array<any>) => {
          this.myPosts = this.getHomeImg(data);
          this.myPostsLive = this.checkingWhetherItsLive(this.myPosts);
          this.myPostsPast = this.checkingWhetherItsPast(this.myPosts);
        });
        this.loading = false;
        setTimeout(() => {
          this.spinner.hide();
        }, 100);
      } else {
        setTimeout(() => {
          this.spinner.hide();
        }, 100);
        this.loading = false;
        this.noRecordFound = true;
        this.myPosts = [];
      }
    }).catch((error) => {
      setTimeout(() => {
        this.spinner.hide();
      }, 100);
      this.loading = false;
      console.error(error);
    });
  }

  public sortPostByDate = (post: Array<any>) => {
    return new Promise((resolve) => {
      post.sort((a, b) => {
        a.statusDate = new Date(a.postCreatedDate);
        b.statusDate = new Date(b.postCreatedDate);
        if (a.statusDate.getTime() < b.statusDate.getTime()) { return -1; }
        if (a.statusDate.getTime() > b.statusDate.getTime()) { return 1; }
        return 0;
      });
      resolve(post.reverse());
    });
  }

  public getHomeImg = (postArray: Array<any>) => {
    postArray.map((post: any) => {
      if (post.postImage) {
        const img = post.postImage.split(',');
        post.homeImage = img[0];
      } else {
        post.homeImage = '';
      }
    });
    return postArray;
  }

  public checkingWhetherItsLive = (response: Array<any>) => {
    let live = [];
    const date = new Date();
    live = response.filter((post) => {
      const postEndDate = post.postEndDate;
      const newDate = new Date(postEndDate);
      return newDate.getTime() >= date.getTime() || date.getTime() === newDate.getTime();
    });
    return live;
  }

  public checkingWhetherItsPast = (response: Array<any>) => {
    let past = [];
    const date = new Date();
    past = response.filter((post) => {
      const postEndDate = post.postEndDate;
      const newDate = new Date(postEndDate);
      return newDate.getTime() < date.getTime();
    });
    return past;
  }

  public getIndexOfLive = (postID: any) => {
    for (const post of this.myPostsLive) {
      if (post.postID === postID) {
        if (post.postType === 'Applicant') {
          const data = post;
          this.homeService.setPostInfoInLocalStorage(data);
          setTimeout(() => {
            this.router.navigate(['/applicant-details']);
          }, 100);
        } else if (post.postType === 'Recruiter') {
          const data = post;
          this.homeService.setPostInfoInLocalStorage(data);
          setTimeout(() => {
            this.router.navigate(['/recruiter-details']);
          }, 100);
        } else {
          const data = post;
          this.homeService.setPostInfoInLocalStorage(data);
          setTimeout(() => {
            this.router.navigate(['/ads-details']);
          }, 100);
        }
      }
    }
  }

  public getIndexOfPast = (postID: any) => {
    for (const post of this.myPostsPast) {
      if (post.postID === postID) {
        if (post.postType === 'Applicant') {
          const data = post;
          this.homeService.setPostInfoInLocalStorage(data);
          setTimeout(() => {
            this.router.navigate(['/applicant-details']);
          }, 100);
        } else if (post.postType === 'Recruiter') {
          const data = post;
          this.homeService.setPostInfoInLocalStorage(data);
          setTimeout(() => {
            this.router.navigate(['/recruiter-details']);
          }, 100);
        } else {
          const data = post;
          this.homeService.setPostInfoInLocalStorage(data);
          setTimeout(() => {
            this.router.navigate(['/ads-details']);
          }, 100);
        }
      }
    }
  }

  public getCategoryList = () => {
    return new Promise((resolve, reject) => {
      this.categoryLists$ = this.homeService.getCategoryList;
      this.catSubscription = this.categoryLists$.subscribe(
        (response) => {
          if (response.length > 0) {
            resolve(response);
          } else {
            resolve([]);
          }
        }, error => reject(error)
      );
    });
  }

  public getUserPostsAll = () => {
    return new Promise((resolve, reject) => {
      this.myPostSubscription = this.homeService.getUserPosts(this.data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        }, error => reject(error)
      );
    });
  }

  public getAccountLabel = () => {
    return new Promise((resolve, reject) => {
      this.labelSubscription = this.homeService.getLabel().subscribe((response) => {
        if (response[0].info === 'RECORDFOUND') {
          resolve(response[0].data);
        } else {
          reject([]);
        }
      }, error => reject(error));
    });
  }

  public postFavourites = (post: any) => {
    const data = { postID: post.postID, loginuserID: Cookie.get('userID'), languageID: this.languageID };
    if (post.IsYourFavorite === 'No') {
      this.favourite(data).then((response: string) => {
        if (response === 'success') {
          this.toastr.successToastr('added', 'success');
          this.asyncCall();
        } else { this.toastr.errorToastr(response, 'error'); }
      }).catch((error) => console.error(error));
    } else {
      this.unfavourite(data).then((response: string) => {
        if (response === 'success') {
          this.toastr.successToastr('Removed', 'success');
          this.asyncCall();
        } else { this.toastr.errorToastr(response, 'error'); }
      }).catch((error) => console.error(error));
    }
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
  public favourite = (data: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.postingUserFavourites(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve('success');
          } else {
            resolve(response[0].message);
          }
        }, (error) => reject(error));
    });
  }

  public makeItFalse() {
    const isTrue = false;
    this.homeService.nextCountBoolean(isTrue);
  }

  ngOnDestroy(): void {
    if (this.myPostSubscription) { this.myPostSubscription.unsubscribe(); }
    if (this.catSubscription) { this.catSubscription.unsubscribe(); }
    if (this.labelSubscription) { this.labelSubscription.unsubscribe(); }
  }
}
