import { Component, DoCheck, KeyValueDiffers, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { Router } from '@angular/router';
import { Subject, Subscription, of, Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, mergeMap, delay } from 'rxjs/operators';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, DoCheck {
  modalOption: NgbModalOptions = {}; // not null!
  public closeResult: string;
  public cityID = '3';
  public languageID = '1';
  public languageData = [];
  public cityListArray = [];
  public differ: any;

  // for searcheable
  public keyUp = new Subject<KeyboardEvent>();
  private subscription: Subscription;
  languageLists$: Observable<Array<any>>;
  cityLists$: Observable<Array<any>>;

  constructor(
    public homeService: HomeService,
    public router: Router,
    public modalService: NgbModal,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find({}).create();
    this.subscription = this.keyUp
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(500),
        distinctUntilChanged(),
        mergeMap((search) => of(search).pipe(delay(500)))
      )
      .subscribe((input) => {
        homeService.nextString(input);
      });
  }

  ngOnInit(): void {
    this.languageLists$ = this.homeService.languages;
    this.homeService.nextCityID(this.cityID);
    this.homeService.nextLanguageID(this.languageID);
    this.asyncCall();
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

  public openLoginModal = () => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(LoginModalComponent, this.modalOption);
    modalRef.result.then(
      (result) => { this.closeResult = `Closed with: ${result}`; },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
    modalRef.componentInstance.labelData = this.languageData;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
