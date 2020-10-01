import { Component, DoCheck, KeyValueDiffers, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Subject, Subscription, of, Observable } from 'rxjs';
import { HomeService } from '../home.service';
import { Router } from '@angular/router';
import { map, debounceTime, distinctUntilChanged, delay, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-users-navbar',
  templateUrl: './users-navbar.component.html',
  styleUrls: ['./users-navbar.component.scss'],
})
export class UsersNavbarComponent implements OnInit, DoCheck {
  public cityID = '3';
  public languageID = '1';
  public imageUrl: string;
  public languageData = [];
  public cityListArray = [];
  public userInfo = [];
  public differ: any;
  public defaultmyImgUrl = 'assets/images/user-icon-transparent-6.jpg';

  // for searcheable
  public keyUp = new Subject<KeyboardEvent>();
  private subscription: Subscription;
  languageLists$: Observable<Array<any>>;
  cityLists$: Observable<Array<any>>;

  constructor(
    public homeService: HomeService,
    public router: Router,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find({}).create();
    this.subscription = this.keyUp
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(500),
        distinctUntilChanged(),
        mergeMap((search) => of(search).pipe(delay(500)))
      ).subscribe((input) => {
        homeService.nextString(input);
      });
  }

  ngOnInit(): void {
    this.checkStatus();
    this.languageLists$ = this.homeService.languages;
    this.asyncCall();
    this.updateUser();
  }

  public asyncCall = async () => {
    await this.getCities().then((city: Array<any>) => {
      if (city.length > 0) {
        city.forEach((cityData) => {
          const ob = { id: cityData.cityID, text: cityData.cityName };
          this.cityListArray.push(ob);
        });
        this.cityListArray.sort((a, b) => a.id - b.id);
        this.homeService.nextCityID(this.cityID);
      } else {
        this.cityListArray = [];
      }
    }).catch(() => console.error());
    this.changeLanguage(this.languageID).then((response: Array<any>) => {
      if (response.length > 0) {
        this.languageData = response;
      } else {
        this.languageData = [];
      }
    }).catch((error) => console.error(error));
  }

  public updateUser = () => {
    this.homeService.count.subscribe(() => {
      setTimeout(() => {
        this.checkStatus();
      }, 2000);
    });
  }

  public checkStatus = () => {
    if (Cookie.get('userRefKey') === undefined || Cookie.get('userRefKey') === '' || Cookie.get('userRefKey') === null) {
      this.userInfo = [];
      this.homeService.nextLanguageID(this.languageID);
    } else {
      this.userInfo = this.homeService.getUserInfoFromLocalStorage();
      this.languageID = this.userInfo[0].languageID;
      this.homeService.nextLanguageID(this.languageID);
      this.isBlank(this.userInfo[0].userProfilePicture)
        ? (this.imageUrl = null)
        : (this.imageUrl = `http://betaapplication.com/ohtel/backend/web/uploads/${this.userInfo[0].userID}/${this.userInfo[0].userProfilePicture}`);
    }
  }

  public isBlank(str: string) {
    return !str || /^\s*$/.test(str);
  }

  public getCities = () => {
    return new Promise((resolve, reject) => {
      this.cityLists$ = this.homeService.cities;
      this.cityLists$.subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public changeLanguage = (languageID: string) => {
    return new Promise((resolve, reject) => {
      this.homeService.changeLanguage(languageID).subscribe(
        (response) => {
          if (response[0].info === 'RECORDFOUND') {
            resolve(response[0].data);
          } else {
            reject(response[0].info);
          }
        },
        (error) => reject(error)
      );
    });
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        switch (item.key) {
          case 'cityID':
            this.homeService.nextCityID(this.cityID);
            break;
          case 'languageID':
            this.homeService.nextLanguageID(this.languageID);
            this.changeLanguage(this.languageID).then((response: Array<any>) => {
              if (response.length > 0) {
                this.languageData = response;
              } else {
                this.languageData = [];
              }
            }).catch((error) => console.error(error));
            break;
          default:
          // Do nothing;
        }
      });
    }
  }

  public signOut = () => {
    Cookie.deleteAll();
    this.userInfo = [];
    setTimeout(() => {
      this.homeService.updateNavbr(false);
      this.router.navigate(['/home']);
    }, 1000);
  }
}
