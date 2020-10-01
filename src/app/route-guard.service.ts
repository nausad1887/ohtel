import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { HomeService } from './home.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService implements CanActivate {
  modalOption: NgbModalOptions = {}; // not null!
  public closeResult: string;
  public labelData = [];
  constructor(
    private router: Router,
    public modalService: NgbModal,
    public homeService: HomeService,
    private spinner: NgxSpinnerService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      Cookie.get('userRefKey') === undefined ||
      Cookie.get('userRefKey') === '' ||
      Cookie.get('userRefKey') === null
    ) {
      const url = {
        queryParams: { returnUrl: state.url },
      };
      this.asynsFunction(url);
      return false;
    } else {
      return true;
    }
  }

  public asynsFunction = async (url: any) => {
    this.spinner.show();
    await this.getLabel();
    this.spinner.hide();
    this.openLoginModal(url);
  };

  public openLoginModal = (url: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      LoginModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    modalRef.componentInstance.currentRoute = url;
    modalRef.componentInstance.labelData = this.labelData;
  };

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public getLabel = () => {
    return new Promise((resolve, reject) => {
      this.homeService.getLabel().subscribe((response) => {
        if (response[0].info === 'RECORDFOUND') {
          this.labelData = response[0].data;
          resolve(this.labelData);
        } else {
          console.error(response);
          reject(response[0].info);
        }
      });
    });
  };
}
