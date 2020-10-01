import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  public cmsPageName = 'Contact Us';
  innnerHTML$: Observable<Array<any>>;
  constructor(public homeService: HomeService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.makeItFalse();
    });
    this.innnerHTML$ = this.homeService.getCmsPage(this.cmsPageName);
  }

  makeItFalse() {
    const isTrue = false;
    this.homeService.nextCountBoolean(isTrue);
  }
}
