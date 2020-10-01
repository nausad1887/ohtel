import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isShow = false;
  public isHome = false;
  public isUser = false;

  constructor(
    public homeService: HomeService,
    public modalService: NgbModal,
    public router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/home']);
    this.homeService.updateNav.subscribe((response) => {
      response ? this.checkStatus() : this.checkStatus();
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.modalService.dismissAll();
      }
    });
    this.homeService.isShow.subscribe((isShow) => {
      this.isShow = isShow;
    });
  }

  public checkStatus = () => {
    if (Cookie.get('userID') && Cookie.get('userName')) {
      this.isHome = false;
      this.isUser = true;
    } else {
      this.isHome = true;
      this.isUser = false;
    }
  }

  onActivate(event: any) {
    window.scroll(0, 0);
  }
}
